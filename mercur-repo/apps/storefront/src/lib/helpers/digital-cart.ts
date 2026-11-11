/**
 * Helper nhận diện giỏ hàng số và sản phẩm số cho Sàn Đại Việt AI.
 * Sàn Đại Việt AI giao dịch 100% tài nguyên số (AI Workflows, SaaS Boilerplates, AI Agents, Prompts),
 * bàn giao qua Cloudflare R2 presigned URL / Zalo OA, hoàn toàn không yêu cầu vận chuyển vật lý.
 */

export function isDigitalItem(item: any): boolean {
  if (!item) return false;

  // 1. Kiểm tra cờ requires_shipping chuẩn của Medusa 2.0 / Mercur
  if (item.requires_shipping === false) return true;
  if (item.variant && item.variant.requires_shipping === false) return true;

  // 2. Metadata sản phẩm hoặc line item
  if (item.product?.metadata?.is_digital === true || item.product?.metadata?.type === 'digital') {
    return true;
  }
  if (item.metadata?.is_digital === true || item.metadata?.type === 'digital') {
    return true;
  }

  // 3. Phân loại theo category hoặc handle đặc thù của Sàn Đại Việt AI
  const categories = item.product?.categories || [];
  const isDigitalCategory = categories.some((cat: any) => {
    const handle = (cat.handle || '').toLowerCase();
    const name = (cat.name || '').toLowerCase();
    return (
      handle.includes('ai') ||
      handle.includes('workflow') ||
      handle.includes('prompt') ||
      handle.includes('boilerplate') ||
      handle.includes('code') ||
      handle.includes('agent') ||
      handle.includes('digital') ||
      name.includes('ai') ||
      name.includes('workflow') ||
      name.includes('mã nguồn') ||
      name.includes('tài nguyên')
    );
  });
  if (isDigitalCategory) return true;

  // 4. Mặc định: Nếu sản phẩm không bị đánh dấu tường minh requires_shipping === true
  // trên Sàn Đại Việt AI thì được coi là tài sản số
  if (item.requires_shipping !== true && item.variant?.requires_shipping !== true) {
    return true;
  }

  return false;
}

export function isDigitalCart(cart: any): boolean {
  if (!cart) return false;
  const items = cart.items || [];
  if (items.length === 0) return true;
  return items.every(isDigitalItem);
}

export const DIGITAL_DELIVERY_INFO = {
  name: 'Bàn giao kỹ thuật số trực tuyến',
  description: 'Tự động 100% qua Cloudflare R2 presigned URL & Zalo OA ngay sau khi thanh toán',
  amount: 0,
  price_type: 'flat' as const,
  estimated_time: 'Tức thì (< 30 giây)'
};
