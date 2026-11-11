-- ==============================================================================
-- Script SQL Dọn Dẹp An Toàn (Soft-Delete) Sản Phẩm Thử Nghiệm Ngày 30/10/2026
-- ==============================================================================
BEGIN;

-- 1. Soft-delete các sản phẩm test cũ theo handle và timestamp thử nghiệm
UPDATE product
SET deleted_at = NOW()
WHERE (
  handle IN (
    'tro-ly-cskh-zalo-oa-1793346591',
    'trợ-lý-cskh-chốt-đơn-zalo-oa-tự-động-aut-biz-01'
  )
  OR handle LIKE '%1793346591%'
  OR (handle LIKE 'tro-ly-cskh-zalo-oa-%' AND handle NOT LIKE '%-std%')
)
AND deleted_at IS NULL;

-- 2. Soft-delete các biến thể (variants) tương ứng
UPDATE product_variant
SET deleted_at = NOW()
WHERE product_id IN (
  SELECT id FROM product
  WHERE handle IN (
    'tro-ly-cskh-zalo-oa-1793346591',
    'trợ-lý-cskh-chốt-đơn-zalo-oa-tự-động-aut-biz-01'
  )
  OR handle LIKE '%1793346591%'
  OR (handle LIKE 'tro-ly-cskh-zalo-oa-%' AND handle NOT LIKE '%-std%')
)
AND deleted_at IS NULL;

COMMIT;
