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
  ].sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
}

/** The latest audit events (at most 100). */
export async function listRecentAudit(take = 10) {
  return getDb().auditEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(take, 100),
    select: { id: true, createdAt: true, actorEmail: true, action: true, summary: true },
  });
}
