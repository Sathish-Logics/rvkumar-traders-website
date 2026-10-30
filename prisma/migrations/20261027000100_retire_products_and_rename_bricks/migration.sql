-- Retires products removed by the owner while preserving historical enquiry items.
UPDATE "products"
SET
  "is_published" = false,
  "is_available" = false,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" IN ('ready-mix-concrete', 'build-essentials');

-- Applies the owner-approved public product name.
UPDATE "products"
SET
  "name" = 'Bricks',
  "description" = 'Bricks for structural and masonry work.',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'bricks-stones';
