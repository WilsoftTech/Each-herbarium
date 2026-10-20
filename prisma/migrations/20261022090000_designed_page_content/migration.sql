-- Designed sections of the founding programmes' pages (ADR 0013), validated
-- by src/features/programmes/designed-content.ts. Additive and non-destructive:
-- existing rows get an empty object, which the seed fills without overwriting.

-- AlterTable
ALTER TABLE "programmes" ADD COLUMN     "content" JSONB NOT NULL DEFAULT '{}';

-- Section content is a JSON object.
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_content_object" CHECK (jsonb_typeof("content") = 'object');
