-- Pending revisions of published content (ADR 0011). Additive only.

-- CreateTable
CREATE TABLE "content_revisions" (
    "id" TEXT NOT NULL,
    "collection" VARCHAR(40) NOT NULL,
    "entity_id" TEXT NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "base_version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_revisions_status_updated_at_idx" ON "content_revisions"("status", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_revisions_collection_entity_id_key" ON "content_revisions"("collection", "entity_id");

-- A revision is a draft or waiting for review; approval applies and removes it.
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_status_valid"
  CHECK ("status" IN ('DRAFT', 'IN_REVIEW'));
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_version_positive"
  CHECK ("version" > 0 AND "base_version" > 0);
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_collection_valid"
  CHECK ("collection" IN ('pages', 'programmes', 'projects', 'articles', 'resources', 'partners', 'team'));
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_data_object"
  CHECK (jsonb_typeof("data") = 'object');
