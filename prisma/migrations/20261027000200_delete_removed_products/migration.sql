-- These owner-removed products have no enquiry-item references, so their
-- catalogue rows can be deleted safely instead of remaining as retired data.
DELETE FROM "products"
WHERE "slug" IN ('ready-mix-concrete', 'build-essentials');
