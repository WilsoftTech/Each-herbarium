import "server-only";
import type { ReactElement } from "react";
import type { AnyLandingPage } from "../../schema";
import {
  AboutView,
  LeadershipView,
  leadershipData,
  MissionView,
  PartnersView,
  partnersData,
} from "./about";
import {
  BitwiireView,
  ContactView,
  contactData,
  GetInvolvedView,
  PartnershipsView,
  VolunteerView,
} from "./involved";
import {
  HerbariumView,
  ImpactView,
  OurWorkView,
  ourWorkData,
  ProjectsView,
  projectsData,
  ResearchView,
  researchData,
  ResourcesView,
  resourcesData,
} from "./work";

/**
 * Any landing page's composition with the published records it shows. Each
 * public route loads its own data and renders its view; the admin preview
 * uses this, so a preview matches the live page.
 */
export async function renderLandingPage(landing: AnyLandingPage): Promise<ReactElement> {
  switch (landing.slug) {
    case "about":
      return <AboutView landing={landing} />;
    case "about-mission":
      return <MissionView landing={landing} />;
    case "about-leadership":
      return <LeadershipView landing={landing} {...await leadershipData()} />;
    case "about-partners":
      return <PartnersView landing={landing} {...await partnersData()} />;
    case "our-work":
      return <OurWorkView landing={landing} {...await ourWorkData()} />;
    case "herbarium":
      return <HerbariumView landing={landing} />;
    case "research":
      return <ResearchView landing={landing} {...await researchData()} />;
    case "impact":
      return <ImpactView landing={landing} />;
    case "projects":
      return <ProjectsView landing={landing} {...await projectsData()} />;
    case "resources":
      return <ResourcesView landing={landing} {...await resourcesData()} />;
    case "get-involved":
      return <GetInvolvedView landing={landing} />;
    case "volunteer":
      return <VolunteerView landing={landing} />;
    case "partnerships":
      return <PartnershipsView landing={landing} />;
    case "bitwiire-herbarium-cafe":
      return <BitwiireView landing={landing} />;
    case "contact":
      return <ContactView landing={landing} {...await contactData()} />;
  }
}
