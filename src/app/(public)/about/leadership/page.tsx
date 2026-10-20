import { LeadershipView, leadershipData, loadLandingPage, metadataForPage } from "@/features/pages";
import { listTeamMembers } from "@/features/team";

// Indexed only once real, consented profiles are published.
export async function generateMetadata() {
  const members = await listTeamMembers();
  return metadataForPage("about-leadership", {
    noindex: !members.some((member) => member.status === "published"),
  });
}

export default async function LeadershipPage() {
  const [landing, data] = await Promise.all([
    loadLandingPage("about-leadership"),
    leadershipData(),
  ]);
  return <LeadershipView landing={landing} {...data} />;
}
