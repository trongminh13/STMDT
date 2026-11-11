import { Button } from "@/components/atoms"
import { retrieveDigitalAssets, initPayOSPayment } from "@/lib/data/orders"
import { ReviewButton } from "@/components/molecules/ReviewButton/ReviewButton"
import Link from "next/link"

interface DigitalAssetItem {
  id: string
  name?: string
  file_name?: string
  file_size?: number
  download_url?: string | null
  remaining_downloads?: number
  version?: string
  file_hash_sha256?: string
}

interface ConciergeServiceItem {
  sku: string
  title: string
  channel: string
  url: string
  sla: string
  instructions: string
}

type DigitalAssetDeliveryProps = {
  orderId?: string
  paymentStatus?: string
  orderGroup?: any
  orders?: any[]
}

export const DigitalAssetDelivery = async ({
  orderId,
  paymentStatus,
  orderGroup,
  orders,
}: DigitalAssetDeliveryProps) => {
  const childOrders: any[] = orders || orderGroup?.orders || []
  const primaryOrder = childOrders[0]
  const targetOrderId = orderId || primaryOrder?.id || orderGroup?.id || ""
  const displayId = orderGroup?.display_id
    ? `#${orderGroup.display_id}`
    : primaryOrder?.display_id
    ? `#${primaryOrder.display_id}`
    : targetOrderId

  // 1. Kiểm tra trạng thái thanh toán captured
  let isCaptured = false
  if (childOrders.length > 0) {
    isCaptured = childOrders.every((o) => o.payment_status === "captured")
  } else if (paymentStatus) {
    isCaptured = paymentStatus === "captured"
  }

  const ordersToFetch = childOrders.length > 0 ? childOrders : targetOrderId ? [{ id: targetOrderId, payment_status: paymentStatus }] : []

  let digitalAssets: DigitalAssetItem[] = []
  let conciergeServices: ConciergeServiceItem[] = []

  if (ordersToFetch.length > 0) {
    const results = await Promise.all(
      ordersToFetch.map(async (ord) => {
        try {
          const res = await retrieveDigitalAssets(ord.id)
          return {
            orderId: ord.id,
            assets: (res?.digital_assets as DigitalAssetItem[]) || [],
            concierge: (res?.concierge_services as ConciergeServiceItem[]) || [],
            payment_status: res?.payment_status || ord.payment_status,
            items: ord.items || [],
          }
        } catch {
          return {
            orderId: ord.id,
            assets: [],
            concierge: [],
            payment_status: ord.payment_status,
            items: ord.items || [],
          }
        }
      })
    )

    if (results.some((r) => r.payment_status === "captured")) {
      isCaptured = true
    }

    results.forEach((r) => {
      if (r.assets.length > 0) {
        digitalAssets.push(...r.assets)
      }
      if (r.concierge.length > 0) {
        conciergeServices.push(...r.concierge)
      }
    })

    // Fallback thông minh: Nếu đơn hàng đã captured nhưng chưa có bản ghi trong bảng digital_asset
    if (isCaptured && digitalAssets.length === 0) {
      const allItems = ordersToFetch.flatMap((o) => o.items || [])
      digitalAssets = allItems.map((item: any, idx: number) => ({
        id: item.id || `asset_${idx}`,
        name: item.title || item.product_title || "Tài sản số AI Đại Việt",
        file_name: `${(item.variant?.sku || item.title || "daiviet-ai-asset")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")}.zip`,
        file_size: 15 * 1024 * 1024,
        remaining_downloads: 5,
        download_url: `/api/downloads/${item.order_id || targetOrderId}?asset_id=${item.variant_id || item.id}`,
      }))
    }
  }

  // Nếu đơn hàng chưa thanh toán, tự động lấy thông tin VietQR từ payOS
  const payosData = !isCaptured && targetOrderId ? await initPayOSPayment(primaryOrder?.id || targetOrderId) : null

  return (
    <div className="w-full mt-6 border rounded-sm p-6 bg-component" data-testid="digital-asset-delivery">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="heading-md uppercase text-primary">
            TÀI SẢN SỐ &amp; DỊCH VỤ CÀI ĐẶT 1-1
          </h2>
          <p className="text-secondary text-sm mt-1">
            Mã đơn hàng: <span className="font-semibold text-primary">{displayId}</span>
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold uppercase rounded-sm border ${
            isCaptured
              ? "bg-green-500/10 text-green-600 border-green-500/30"
              : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
          }`}
        >
          {isCaptured ? "ĐÃ MỞ KHÓA TẢI TỆP" : "CHỜ THANH TOÁN VIETQR"}
        </span>
      </div>

      {!isCaptured ? (
        <div className="p-6 rounded-sm bg-primary border space-y-6">
          <div className="text-center">
            <h3 className="heading-sm uppercase text-primary font-bold">
              QUÉT MÃ VIETQR ĐỂ MỞ KHÓA TÀI SẢN SỐ TỨC THÌ
            </h3>
            <p className="text-sm text-secondary mt-1">
              Hệ thống kết nối trực tiếp cổng thanh toán VietQR (payOS NAPAS 24/7). Tệp tin số sẽ tự động mở khóa ngay sau khi nhận tiền.
            </p>
          </div>

          {payosData?.vietqr_url ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-component border rounded-sm">
              <div className="flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payosData.vietqr_url}
                  alt="Mã QR Thanh Toán VietQR"
                  className="w-56 h-auto rounded border shadow-sm bg-white p-2"
                />
                <span className="text-xs text-secondary mt-2">Quét bằng ứng dụng ngân hàng bất kỳ</span>
              </div>

              <div className="space-y-3 text-left w-full md:w-auto text-sm">
                <div>
                  <span className="text-secondary text-xs block">Ngân hàng thụ hưởng:</span>
                  <span className="font-semibold text-primary">{payosData.bank_info?.bank_name || "TPBank"}</span>
                </div>
                <div>
                  <span className="text-secondary text-xs block">Số tài khoản:</span>
                  <span className="font-mono font-bold text-lg text-primary">{payosData.bank_info?.account_number}</span>
                </div>
                <div>
                  <span className="text-secondary text-xs block">Chủ tài khoản:</span>
                  <span className="font-semibold text-primary uppercase">{payosData.bank_info?.account_name}</span>
                </div>
                <div>
                  <span className="text-secondary text-xs block">Số tiền thanh toán:</span>
                  <span className="font-bold text-lg text-action">
                    {payosData.amount
                      ? `${payosData.amount.toLocaleString("vi-VN")} đ`
                      : orderGroup?.total
                      ? `${Number(orderGroup.total).toLocaleString("vi-VN")} đ`
                      : "Theo tổng giá trị đơn"}
                  </span>
                </div>
                <div>
                  <span className="text-secondary text-xs block">Nội dung chuyển khoản (bắt buộc):</span>
                  <span className="font-mono font-bold px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/30 rounded inline-block">
                    {payosData.description || `DH ${orderGroup?.display_id || targetOrderId}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-sm bg-component border text-center text-secondary text-sm">
              Đang kết nối cổng thanh toán VietQR... Vui lòng tải lại trang sau giây lát.
            </div>
          )}

          <div className="text-xs text-secondary text-center">
            💡 Sau khi hoàn tất chuyển khoản thành công, vui lòng giữ nguyên trang hoặc tải lại (F5) để nhận quyền tải tệp tin ngay lập tức.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Danh sách file số tải về */}
          {digitalAssets.length > 0 ? (
            <div>
              <h3 className="label-lg uppercase text-primary mb-3">
                TỆP TIN SỐ KHẢ DỤNG ({digitalAssets.length})
              </h3>
              <div className="space-y-3">
                {digitalAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-primary">{asset.name || asset.file_name || "Tài sản số Đại Việt AI"}</p>
                        {asset.version && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/10 border text-secondary">
                            {asset.version.startsWith("v") ? asset.version : `v${asset.version}`}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary mt-1">
                        Dung lượng: {asset.file_size ? `${(asset.file_size / 1024).toFixed(1)} KB` : "Tiêu chuẩn"} • 
                        Thời hạn token: 24 giờ • Lượt tải còn lại: {asset.remaining_downloads ?? 5}/5
                      </p>
                      {asset.file_hash_sha256 && (
                        <p className="text-[11px] text-secondary font-mono mt-0.5 select-all">
                          SHA-256: {asset.file_hash_sha256.substring(0, 16)}...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {asset.download_url ? (
                        <Link
                          href={asset.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          <Button size="large" className="w-full sm:w-auto uppercase">
                            TẢI XUỐNG TỆP SỐ
                          </Button>
                        </Link>
                      ) : (
                        <Link
                          href={`/api/downloads/${targetOrderId}?asset_id=${asset.id}`}
                          target="_blank"
                          className="shrink-0"
                        >
                          <Button size="large" className="w-full sm:w-auto uppercase">
                            TẢI XUỐNG TỆP SỐ
                          </Button>
                        </Link>
                      )}
                      <ReviewButton
                        orderId={targetOrderId}
                        productId={asset.id}
                        productTitle={asset.name || asset.file_name || "Tài sản số Đại Việt AI"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-sm bg-primary text-secondary text-sm">
              Đơn hàng này không chứa tệp tin tải trực tiếp hoặc tài sản số đang được khởi tạo.
            </div>
          )}

          {/* 2. Dịch vụ cài đặt PRO 1-1 */}
          {conciergeServices.length > 0 && (
            <div className="border border-action/40 rounded-sm p-5 bg-action/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-action text-action-on-primary">
                  PRO CONCIERGE 1-1
                </span>
                <span className="text-xs text-secondary font-medium">Cam kết phản hồi trong 2 giờ</span>
              </div>
              <h3 className="heading-sm uppercase text-primary mb-2">
                DỊCH VỤ CÀI ĐẶT &amp; HUẤN LUYỆN CHUYÊN MÔN
              </h3>
              <p className="text-sm text-secondary mb-4 leading-relaxed">
                Đơn hàng của bạn đã bao gồm gói hỗ trợ kỹ thuật thực chiến 1-1. Vui lòng kết nối ngay với đội ngũ kỹ sư Đại Việt AI qua Zalo OA hoặc Telegram để gửi mã đơn và đặt lịch hẹn remote qua UltraViewer/AnyDesk:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://zalo.me/daivietai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="large" className="bg-[#0068FF] text-white hover:bg-[#0055d4] uppercase">
                    KẾT NỐI ZALO OFFICIAL ACCOUNT
                  </Button>
                </Link>
                <Link
                  href="https://t.me/daiviet_ai_support"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="tonal" size="large" className="uppercase">
                    KÊNH TELEGRAM KỸ THUẬT
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
