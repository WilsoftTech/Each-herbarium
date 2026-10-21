-- Public enquiry forms (M05). Additive only: the inquiries table has been empty
-- since it was created, and every new column has a default.

CREATE TYPE "inquiry_kind" AS ENUM ('CONTACT', 'VOLUNTEER', 'PARTNERSHIP');
CREATE TYPE "delivery_status" AS ENUM ('PENDING', 'SENT', 'FAILED', 'NOT_CONFIGURED');

ALTER TABLE "inquiries"
    ADD COLUMN "kind" "inquiry_kind" NOT NULL DEFAULT 'CONTACT',
    ADD COLUMN "details" JSONB NOT NULL DEFAULT '{}',
    ADD COLUMN "notification_status" "delivery_status" NOT NULL DEFAULT 'PENDING',
    ADD COLUMN "acknowledgement_status" "delivery_status" NOT NULL DEFAULT 'PENDING',
    ADD COLUMN "delivery_error" TEXT,
    ADD COLUMN "delivery_attempts" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "inquiries_kind_created_at_idx" ON "inquiries"("kind", "created_at");

-- Forms stay hidden until an administrator turns them on.
ALTER TABLE "site_settings" ADD COLUMN "accept_enquiries" BOOLEAN NOT NULL DEFAULT false;
