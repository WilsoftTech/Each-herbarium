import "server-only";
import type { WorkflowCollection } from "@/features/cms";
import { projectInclude, toProject } from "../queries";

/** Workflow adapter for projects (see features/cms/content-workflow.ts). */
export const projectWorkflow: WorkflowCollection = {
  collection: "projects",
  label: "Project",
  async find(db, id) {
    const row = await db.project.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, title: true },
    });
    return row && { ...row, label: row.title };
  },
  updateStatus(db, id, version, change) {
    return db.project.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove(db, id) {
    return db.project.delete({ where: { id } });
  },
  async checkPublishable(db, id) {
    const row = await db.project.findUnique({ where: { id }, include: projectInclude });
    if (!row) return "This project no longer exists.";
    if (row.image.status !== "READY") return "The main image has not finished uploading.";
    try {
      toProject(row);
    } catch {
      return "Some details do not meet the publishing rules. Check that every image has alt text of at least 20 characters and a caption.";
    }
    return null;
  },
};
