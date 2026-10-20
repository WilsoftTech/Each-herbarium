import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Migration safeguard (run in CI and by the unit tests). Fails when a
 * migration contains a statement that can destroy data, unless the migration
 * folder also holds APPROVED_DESTRUCTIVE.md recording who approved it and why
 * (AGENTS.md §2.7: no destructive migrations without explicit approval).
 */
export const destructivePatterns: readonly { label: string; pattern: RegExp }[] = [
  { label: "DROP TABLE", pattern: /\bDROP\s+TABLE\b/i },
  { label: "DROP COLUMN", pattern: /\bDROP\s+COLUMN\b/i },
  { label: "DROP SCHEMA", pattern: /\bDROP\s+SCHEMA\b/i },
  { label: "DROP TYPE", pattern: /\bDROP\s+TYPE\b/i },
  { label: "TRUNCATE", pattern: /\bTRUNCATE\b/i },
  { label: "DELETE FROM", pattern: /\bDELETE\s+FROM\b/i },
  { label: "ALTER COLUMN … TYPE", pattern: /\bALTER\s+COLUMN\s+"?\w+"?\s+(SET\s+DATA\s+)?TYPE\b/i },
  { label: "RENAME", pattern: /\bRENAME\s+(COLUMN|TO)\b/i },
];

export type Finding = { migration: string; statement: string };

/** Strips SQL comments so documentation in a migration is not mistaken for a statement. */
function stripComments(sql: string): string {
  return sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

export function findDestructiveStatements(directory: string): Finding[] {
  const findings: Finding[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(directory, entry.name);
    const file = path.join(folder, "migration.sql");
    if (!existsSync(file) || existsSync(path.join(folder, "APPROVED_DESTRUCTIVE.md"))) continue;
    const sql = stripComments(readFileSync(file, "utf8"));
    for (const { label, pattern } of destructivePatterns) {
      if (pattern.test(sql)) findings.push({ migration: entry.name, statement: label });
    }
  }
  return findings;
}

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename);
if (isMain) {
  const findings = findDestructiveStatements(path.join("prisma", "migrations"));
  if (findings.length) {
    console.error("Destructive statements found in unapproved migrations:");
    for (const finding of findings) console.error(`  ${finding.migration}: ${finding.statement}`);
    console.error(
      "Get explicit approval, then add APPROVED_DESTRUCTIVE.md to the migration folder.",
    );
    process.exit(1);
  }
  console.log("Migrations checked: no unapproved destructive statements.");
}
