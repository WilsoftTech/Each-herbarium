import "server-only";
import { getDb } from "@/services/db";
import type { ContentStatus } from "./workflow";

export type CollectionSummary = {
  label: string;
  href: string;
  counts: Partial<Record<ContentStatus, number>>;
};

export type ReviewItem = {
  id: string;
  title: string;
  collection: string;
  href: string;
  updatedAt: Date;
  /** True for pending changes to a published item, false for an unpublished item. */
  revision?: boolean;
};

/** Admin list path and singular label for each collection key (content_revisions.collection). */
const collectionAdmin: Record<string, { base: string; label: string }> = {
  pages: { base: "/admin/pages", label: "Page" },
  programmes: { base: "/admin/programmes", label: "Programme" },
  projects: { base: "/admin/projects", label: "Project" },
  articles: { base: "/admin/articles", label: "Article" },
  resources: { base: "/admin/resources", label: "Resource" },
  partners: { base: "/admin/partners", label: "Partner" },
  team: { base: "/admin/team", label: "Team member" },
};

type Counted = { status: ContentStatus; _count: { _all: number } }[];

function toCounts(rows: Counted): Partial<Record<ContentStatus, number>> {
  return Object.fromEntries(rows.map((row) => [row.status, row._count._all]));
}

/** Status counts for every content type (admin dashboard; uncached, per request). */
export async function summariseContent(): Promise<CollectionSummary[]> {
  const db = getDb();
  const [pages, programmes, projects, articles, resources, partners, team] = await Promise.all([
    db.page.groupBy({ by: ["status"], _count: { _all: true } }),
    db.programme.groupBy({ by: ["status"], _count: { _all: true } }),
    db.project.groupBy({ by: ["status"], _count: { _all: true } }),
    db.article.groupBy({ by: ["status"], _count: { _all: true } }),
    db.resource.groupBy({ by: ["status"], _count: { _all: true } }),
    db.partner.groupBy({ by: ["status"], _count: { _all: true } }),
    db.teamMember.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  return [
    { label: "Pages", href: "/admin/pages", counts: toCounts(pages) },
    { label: "Programmes", href: "/admin/programmes", counts: toCounts(programmes) },
    { label: "Projects", href: "/admin/projects", counts: toCounts(projects) },
    { label: "Articles & publications", href: "/admin/articles", counts: toCounts(articles) },
    { label: "Resources", href: "/admin/resources", counts: toCounts(resources) },
    { label: "Partners", href: "/admin/partners", counts: toCounts(partners) },
    { label: "Team", href: "/admin/team", counts: toCounts(team) },
  ];
}

type Titled = { id: string; title: string; updatedAt: Date };

/** Titles of items in several collections, keyed by "<collection>:<id>". */
async function titlesOf(refs: readonly { collection: string; entityId: string }[]) {
  const db = getDb();
  const ids = (collection: string) =>
    refs.filter((ref) => ref.collection === collection).map((ref) => ref.entityId);
  const where = (collection: string) => ({ id: { in: ids(collection) } });
  const titled = { id: true, title: true } as const;
  const named = { id: true, name: true } as const;
  const [pages, programmes, projects, articles, resources, partners, team] = await Promise.all([
    db.page.findMany({ where: where("pages"), select: titled }),
    db.programme.findMany({ where: where("programmes"), select: titled }),
    db.project.findMany({ where: where("projects"), select: titled }),
    db.article.findMany({ where: where("articles"), select: titled }),
    db.resource.findMany({ where: where("resources"), select: titled }),
    db.partner.findMany({ where: where("partners"), select: named }),
    db.teamMember.findMany({ where: where("team"), select: named }),
  ]);
  const titles = new Map<string, string>();
  const add = (collection: string, rows: { id: string; title?: string; name?: string }[]) => {
    for (const row of rows) titles.set(`${collection}:${row.id}`, row.title ?? row.name ?? "");
  };
  add("pages", pages);
  add("programmes", programmes);
  add("projects", projects);
  add("articles", articles);
  add("resources", resources);
  add("partners", partners);
  add("team", team);
  return titles;
}

/** Pending changes to published items, oldest first (at most 50). */
export async function listPendingRevisions(
  status?: "DRAFT" | "IN_REVIEW",
): Promise<(ReviewItem & { status: "DRAFT" | "IN_REVIEW" })[]> {
  const rows = await getDb().contentRevision.findMany({
    where: status ? { status } : {},
    orderBy: { updatedAt: "asc" },
    take: 50,
    select: { id: true, collection: true, entityId: true, status: true, updatedAt: true },
  });
  const titles = await titlesOf(rows);
  return rows.flatMap((row) => {
    const admin = collectionAdmin[row.collection];
    if (!admin) return [];
    return [
      {
        id: row.id,
        title: titles.get(`${row.collection}:${row.entityId}`) ?? "(removed)",
        collection: admin.label,
        href: `${admin.base}/${row.entityId}`,
        updatedAt: row.updatedAt,
        revision: true,
        status: row.status === "IN_REVIEW" ? ("IN_REVIEW" as const) : ("DRAFT" as const),
      },
    ];
  });
}

/** Everything waiting for a reviewer, oldest first (at most 10 per type). */
export async function listAwaitingReview(): Promise<ReviewItem[]> {
  const db = getDb();
  const where = { status: "IN_REVIEW" } as const;
  const orderBy = { updatedAt: "asc" } as const;
  const take = 10;
  const titled = { id: true, title: true, updatedAt: true } as const;
  const named = { id: true, name: true, updatedAt: true } as const;

  const [pages, programmes, projects, articles, resources, partners, team] = await Promise.all([
    db.page.findMany({ where, orderBy, take, select: titled }),
    db.programme.findMany({ where, orderBy, take, select: titled }),
    db.project.findMany({ where, orderBy, take, select: titled }),
    db.article.findMany({ where, orderBy, take, select: titled }),
    db.resource.findMany({ where, orderBy, take, select: titled }),
    db.partner.findMany({ where, orderBy, take, select: named }),
    db.teamMember.findMany({ where, orderBy, take, select: named }),
  ]);

  const toItem = (collection: string, base: string) => (row: Titled) => ({
    id: row.id,
    title: row.title,
    collection,
    href: `${base}/${row.id}`,
    updatedAt: row.updatedAt,
  });
  const fromNamed = ({ name, ...row }: { id: string; name: string; updatedAt: Date }) => ({
    ...row,
    title: name,
  });

  return [
    ...pages.map(toItem("Page", "/admin/pages")),
    ...programmes.map(toItem("Programme", "/admin/programmes")),
    ...projects.map(toItem("Project", "/admin/projects")),
    ...articles.map(toItem("Article", "/admin/articles")),
    ...resources.map(toItem("Resource", "/admin/resources")),
    ...partners.map(fromNamed).map(toItem("Partner", "/admin/partners")),
    ...team.map(fromNamed).map(toItem("Team member", "/admin/team")),
    ...(await listPendingRevisions("IN_REVIEW")),
  ].sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Operational figures for the dashboard, all counted live from the database:
 * what is published, what is waiting, and what needs attention.
 */
export async function summariseOperations() {
  const db = getDb();
  const published = { status: "PUBLISHED" } as const;
  const staleBefore = new Date(Date.now() - 30 * DAY);
  const stuckBefore = new Date(Date.now() - DAY);
  const [
    pages,
    projects,
    articles,
    programmes,
    drafts,
    inReview,
    revisions,
    revisionsInReview,
    media,
    placeholders,
    staleDrafts,
    stuckUploads,
  ] = await Promise.all([
    db.page.count({ where: published }),
    db.project.count({ where: published }),
    db.article.count({ where: published }),
    db.programme.count({ where: published }),
    Promise.all([
      db.page.count({ where: { status: "DRAFT" } }),
      db.programme.count({ where: { status: "DRAFT" } }),
      db.project.count({ where: { status: "DRAFT" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.resource.count({ where: { status: "DRAFT" } }),
      db.partner.count({ where: { status: "DRAFT" } }),
      db.teamMember.count({ where: { status: "DRAFT" } }),
    ]).then((counts) => counts.reduce((sum, count) => sum + count, 0)),
    Promise.all([
      db.page.count({ where: { status: "IN_REVIEW" } }),
      db.programme.count({ where: { status: "IN_REVIEW" } }),
      db.project.count({ where: { status: "IN_REVIEW" } }),
      db.article.count({ where: { status: "IN_REVIEW" } }),
      db.resource.count({ where: { status: "IN_REVIEW" } }),
      db.partner.count({ where: { status: "IN_REVIEW" } }),
      db.teamMember.count({ where: { status: "IN_REVIEW" } }),
    ]).then((counts) => counts.reduce((sum, count) => sum + count, 0)),
    db.contentRevision.count(),
    db.contentRevision.count({ where: { status: "IN_REVIEW" } }),
    db.mediaAsset.count({ where: { status: "READY" } }),
    Promise.all([
      db.page.count({ where: { ...published, placeholder: true } }),
      db.programme.count({ where: { ...published, placeholder: true } }),
      db.project.count({ where: { ...published, placeholder: true } }),
      db.article.count({ where: { ...published, placeholder: true } }),
      db.resource.count({ where: { ...published, placeholder: true } }),
      db.partner.count({ where: { ...published, placeholder: true } }),
      db.teamMember.count({ where: { ...published, placeholder: true } }),
    ]).then((counts) => counts.reduce((sum, count) => sum + count, 0)),
    Promise.all([
      db.page.count({ where: { status: "DRAFT", updatedAt: { lt: staleBefore } } }),
      db.programme.count({ where: { status: "DRAFT", updatedAt: { lt: staleBefore } } }),
      db.project.count({ where: { status: "DRAFT", updatedAt: { lt: staleBefore } } }),
      db.article.count({ where: { status: "DRAFT", updatedAt: { lt: staleBefore } } }),
      db.resource.count({ where: { status: "DRAFT", updatedAt: { lt: staleBefore } } }),
    ]).then((counts) => counts.reduce((sum, count) => sum + count, 0)),
    db.mediaAsset.count({ where: { status: "PENDING", createdAt: { lt: stuckBefore } } }),
  ]);
  return {
    published: { pages, projects, articles, programmes },
    drafts,
    awaitingReview: inReview + revisionsInReview,
    pendingChanges: revisions,
    media,
    attention: { placeholders, staleDrafts, stuckUploads },
  };
}

export type OperationsSummary = Awaited<ReturnType<typeof summariseOperations>>;

/** The latest audit events (at most 100). */
export async function listRecentAudit(take = 10) {
  return getDb().auditEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(take, 100),
    select: { id: true, createdAt: true, actorEmail: true, action: true, summary: true },
  });
}
