-- CMS content fields: page sections and hero images, SEO fields, programme,
-- project, article and partner details, site settings (ADR 0011). Additive only;
-- the settings defaults carry the footer and tagline copy previously in code.

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'ON_HOLD');

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "copyright_text" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footer_note" TEXT NOT NULL DEFAULT 'Photography is credited alongside each image. Some content is awaiting approval and is marked on the page.',
ADD COLUMN     "footer_statement" TEXT NOT NULL DEFAULT 'Preserving East Africa''s Plant Heritage.',
ADD COLUMN     "location_text" TEXT,
ADD COLUMN     "navigation" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "social_image_id" TEXT,
ADD COLUMN     "tagline" TEXT NOT NULL DEFAULT 'Plant conservation, herbarium development and botanical knowledge for East Africa, beginning in Uganda.';

-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "content" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "hero_image_id" TEXT,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seo_title" TEXT;

-- AlterTable
ALTER TABLE "programmes" ADD COLUMN     "body" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "country" TEXT,
ADD COLUMN     "end_date" DATE,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "operational_status" "project_status",
ADD COLUMN     "outcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "references" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT,
ADD COLUMN     "start_date" DATE;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "references" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT;

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "logo_id" TEXT;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_social_image_id_fkey" FOREIGN KEY ("social_image_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_fkey" FOREIGN KEY ("hero_image_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- A project cannot end before it starts.
ALTER TABLE "projects" ADD CONSTRAINT "projects_dates_ordered"
  CHECK ("start_date" IS NULL OR "end_date" IS NULL OR "end_date" >= "start_date");

-- Homepage and other section content is a JSON object validated by the page registry.
ALTER TABLE "pages" ADD CONSTRAINT "pages_content_object" CHECK (jsonb_typeof("content") = 'object');
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_navigation_object" CHECK (jsonb_typeof("navigation") = 'object');
