import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"
import { downloadLimiter } from "../../../../../modules/digital-asset/utils/download-limiter"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const orderId = req.params.id
  const customerId = req.auth_context?.actor_id
  const action = (req.query.action as string) || "inspect"
  const requestedAssetId = req.query.asset_id as string | undefined

  // Gate 1: Check authentication
  if (!customerId) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Authentication required to access digital assets."
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const fileService = req.scope.resolve(Modules.FILE)

    // Gate 2: Query order and items
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "customer_id",
        "status",
        "payment_status",
        "items.*",
        "items.variant_id",
        "items.variant.*",
        "items.variant.product.*",
      ],
      filters: { id: orderId },
    })

    const order = orders[0] as any
    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id ${orderId} was not found.`
      )
    }

    // Gate 3: Check IDOR (Customer must own the order)
    if (order.customer_id !== customerId) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You are not authorized to access assets for this order."
      )
    }

    // Gate 4: Check Payment Status & Order Status (Must be active and captured)
    if (order.status === "canceled" || order.payment_status !== "captured") {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        order.status === "canceled"
          ? "Đơn hàng đã bị hủy, quyền truy cập tài sản số bị khóa."
          : "Digital assets can only be accessed after payment is captured."
      )
    }

  // Trích xuất các dịch vụ cài đặt / chuyển giao kỹ thuật (Concierge Services) nếu có trong đơn hàng
  const conciergeServices = (order.items || [])
    .filter((item: any) => {
      const sku = item.variant?.sku || item.product?.metadata?.sku || ""
      const supportType =
        item.variant?.product?.metadata?.support_type ||
        item.variant?.metadata?.support_type ||
        item.metadata?.support_type
      return supportType === "concierge_service" || sku.startsWith("PRO-")
    })
    .map((item: any) => ({
      service_id: item.id,
      sku: item.variant?.sku || item.product?.metadata?.sku || "PRO-SERVICE",
      service_name: item.title || item.variant?.product?.title || "Dịch Vụ Kỹ Thuật 1-1",
      status: "READY_FOR_SUPPORT",
      instructions: "Vui lòng liên hệ Kỹ thuật viên qua Zalo OA hoặc Telegram chính thức của Đại Việt AI, cung cấp Mã Đơn Hàng để được hỗ trợ remote 1-1 qua UltraViewer trong vòng 24 giờ.",
      support_channels: {
        zalo_oa: "https://zalo.me/daivietai",
        telegram: "https://t.me/daiviet_ai_support",
        hotline: "1900-DAIVIET-AI",
        working_hours: "08:00 - 21:00 (Thứ 2 - Thứ 7)",
      },
      order_reference: order.id,
    }))

  // Find all digital assets linked to variants in this order
  const variantIds = (order.items || [])
    .map((item: any) => item.variant_id)
    .filter(Boolean)

  if (variantIds.length === 0) {
    return res.json({
      order_id: orderId,
      action,
      digital_assets: [],
      ...(conciergeServices.length > 0 && { concierge_services: conciergeServices }),
    })
  }

  const { data: assets } = await query.graph({
    entity: "digital_asset",
    fields: ["id", "file_id", "name", "mime_type", "is_revoked", "metadata", "product_variant.*"],
    filters: {
      product_variant: {
        id: variantIds,
      },
    },
  })

  // Gate 5: Filter out revoked assets
  const activeAssets = assets.filter((asset: any) => !asset.is_revoked)

  if (activeAssets.length === 0) {
    return res.json({
      order_id: orderId,
      action,
      digital_assets: [],
      ...(conciergeServices.length > 0 && {
        concierge_services: conciergeServices,
        message: "Đơn hàng chứa dịch vụ kỹ thuật 1-1. Vui lòng kết nối Zalo OA hoặc Telegram để được hỗ trợ.",
      }),
      ...(conciergeServices.length === 0 && {
        message: "No active digital assets found for this order.",
      }),
    })
  }

  // If a specific asset was requested, filter to it
  const targetAssets = requestedAssetId
    ? activeAssets.filter((a: any) => a.id === requestedAssetId)
    : activeAssets

  if (requestedAssetId && targetAssets.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Asset ${requestedAssetId} not found or has been revoked for order ${orderId}.`
    )
  }

  // Gate 6 & 7: Inspect Mode (Default)
  // Zero URL Leakage: download_url is strictly null.
  if (action !== "download") {
    const inspectedAssets = await Promise.all(
      targetAssets.map(async (asset: any) => {
        const stats = await downloadLimiter.getStats(orderId, asset.id, 5)
        return {
          id: asset.id,
          name: asset.name,
          mime_type: asset.mime_type,
          file_size: asset.metadata?.file_size || null,
          version: asset.metadata?.version || "1.0.0",
          file_hash_sha256: asset.metadata?.file_hash_sha256 || null,
          download_url: null, // QA Security Guard: Never leak download URL in inspect mode
          download_count: stats.count,
          max_downloads: stats.max,
          remaining_downloads: stats.remaining,
          is_exhausted: stats.is_exhausted,
        }
      })
    )

    return res.json({
      order_id: orderId,
      action: "inspect",
      digital_assets: inspectedAssets,
      ...(conciergeServices.length > 0 && { concierge_services: conciergeServices }),
    })
  }

  // Gate 8: Download Mode (action = download)
  // Check and consume download quota via Redis Lua Script
  const processedAssets = await Promise.all(
    targetAssets.map(async (asset: any) => {
      const limitResult = await downloadLimiter.checkAndIncrement(
        orderId,
        asset.id,
        5
      )

      if (!limitResult.allowed) {
        return {
          id: asset.id,
          name: asset.name,
          mime_type: asset.mime_type,
          file_size: asset.metadata?.file_size || null,
          version: asset.metadata?.version || "1.0.0",
          file_hash_sha256: asset.metadata?.file_hash_sha256 || null,
          download_url: null,
          download_count: limitResult.count,
          max_downloads: limitResult.max,
          remaining_downloads: limitResult.remaining,
          is_exhausted: true,
          error: "DOWNLOAD_LIMIT_EXCEEDED",
        }
      }

      // Generate presigned download URL with 15 minutes (900 seconds) expiration
      let downloadUrl = ""
      try {
        const file = await fileService.retrieveFile(asset.file_id)
        downloadUrl = file?.url || ""
      } catch {
        const fileBase =
          process.env.FILE_BACKEND_URL ||
          (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/static` : "") ||
          (process.env.MEDUSA_BACKEND_URL ? `${process.env.MEDUSA_BACKEND_URL}/static` : "") ||
          "http://localhost:9000/static"
        downloadUrl = `${fileBase}/downloads/${asset.file_id}`
      }

      return {
        id: asset.id,
        name: asset.name,
        mime_type: asset.mime_type,
        file_size: asset.metadata?.file_size || null,
        version: asset.metadata?.version || "1.0.0",
        file_hash_sha256: asset.metadata?.file_hash_sha256 || null,
        download_url: downloadUrl,
        download_count: limitResult.count,
        max_downloads: limitResult.max,
        remaining_downloads: limitResult.remaining,
        is_exhausted: limitResult.is_exhausted,
        is_resumed_session: limitResult.is_resumed_session || false,
      }
    })
  )

  // If a specific asset was requested and it was exhausted, throw 429
  if (requestedAssetId && processedAssets[0]?.is_exhausted && !processedAssets[0]?.download_url) {
    return res.status(429).json({
      type: "not_allowed",
      code: "DOWNLOAD_LIMIT_EXCEEDED",
      message: "Tài sản số này đã vượt quá giới hạn tối đa 5 lượt tải cho đơn hàng.",
      asset: processedAssets[0],
    })
  }

  return res.json({
    order_id: orderId,
    action: "download",
    digital_assets: processedAssets,
    ...(conciergeServices.length > 0 && { concierge_services: conciergeServices }),
  })
}
