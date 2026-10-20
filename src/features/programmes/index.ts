// Public API of the programmes feature. Other modules import only from here.
export { deleteProgramme, saveProgramme, transitionProgramme } from "./admin/actions";
export { getProgrammeForAdmin, listProgrammesForAdmin } from "./admin/admin";
export { getProgrammeEditor } from "./admin/editor";
export { ProgrammeForm } from "./admin/programme-form";
export { ProgrammeDetails } from "./components/programme-details";
export { programmeMetadata } from "./metadata";
export {
  designedProgrammeSections,
  isDesignedProgrammeSlug,
  type DesignedProgrammeContent,
  type DesignedProgrammeSlug,
} from "./designed-content";
export {
  getDesignedProgramme,
  getProgramme,
  listProgrammes,
  nextProgramme,
  type DesignedProgramme,
} from "./queries";
export { bespokeProgrammeSlugs, programmeHref, programmeSchema, type Programme } from "./schema";
