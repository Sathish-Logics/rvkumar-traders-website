-- Seeds deterministic product catalogue data for local development.
-- The owner account is created separately through Supabase Auth because the
-- admin_profiles UUID must match auth.users.id.

INSERT INTO public.products (
  slug,
  name,
  brand,
  description,
  unit,
  image_url
)
VALUES
  ('ultratech-cement', 'UltraTech Cement', 'UltraTech', 'Cement for building and concrete work.', 'bags', '/images/products/ultratech-cement-owner-v2.webp'),
  ('tmt-steel', 'TMT Steel', 'Agni Steel / TSRM Steel', 'Reinforcement steel for structural construction.', 'kg', '/images/products/tmt-steel-owner-v2.webp'),
  ('m-sand-p-sand', 'M-Sand & P-Sand', NULL, 'Sand for concrete, masonry and plastering.', 'unit', '/images/products/sand-owner-v2.webp'),
  ('bricks-stones', 'Bricks', NULL, 'Bricks for structural and masonry work.', 'numbers', '/images/products/bricks-stones-restored-v3.webp'),
  ('gravel-keraval', 'Gravel (Keraval)', NULL, 'Gravel for filling, drainage and site preparation.', 'unit', '/images/products/keraval-gravel.webp'),
  ('crushed-stone-aggregate', 'Crushed Stone Aggregate', NULL, 'Sali Kaal and jelly stone for concrete and foundation work.', 'unit', '/images/products/sali-kaal.webp'),
  ('construction-lime', 'Construction Lime', NULL, 'Chunambu for masonry, plastering and finishing work.', 'bags', '/images/products/construction-lime-v3.webp'),
  ('waterproofing-materials', 'Waterproofing Materials', 'Dr. Fixit', 'Protective coatings and moisture-control solutions.', 'unit', '/images/products/waterproofing.webp')
ON CONFLICT (slug) DO UPDATE SET
  name = excluded.name,
  brand = excluded.brand,
  description = excluded.description,
  unit = excluded.unit,
  image_url = excluded.image_url,
  is_published = true,
  is_available = true,
  updated_at = now();

