-- Moves the designed programme pages' search descriptions from code into the
-- CMS (programmes.seo_description). Only fills empty values; never overwrites
-- editorial changes. Fresh databases get them from the seed.

UPDATE "programmes" SET "seo_description" = 'Why East Africa''s native plants need protecting, and how plants are conserved in the wild, in collections and in herbaria.' WHERE "slug" = 'plant-conservation' AND "seo_description" IS NULL;
UPDATE "programmes" SET "seo_description" = 'The forests, wetlands and grasslands that East Africa''s plants depend on, and why protecting them matters for people too.' WHERE "slug" = 'environmental-conservation' AND "seo_description" IS NULL;
UPDATE "programmes" SET "seo_description" = 'How EACH approaches East Africa''s medicinal plants: accurate identification, cultural context, consent and conservation. Not medical advice.' WHERE "slug" = 'medicinal-plants' AND "seo_description" IS NULL;
UPDATE "programmes" SET "seo_description" = 'Recording East African communities'' knowledge of plants with consent, credit and community control.' WHERE "slug" = 'indigenous-knowledge' AND "seo_description" IS NULL;
