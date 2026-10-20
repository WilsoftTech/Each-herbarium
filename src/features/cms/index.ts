// Public API of the CMS core (editorial workflow shared by every content type).
export { idleState, type ActionState } from "./action-state";
export { StatusFilter } from "./components/status-filter";
export { WorkflowPanel } from "./components/workflow-panel";
export {
  applyDelete,
  applySave,
  applyTransition,
  audit,
  expireCollection,
  readTarget,
  type SaveOperations,
  type StatusChange,
  type WorkflowCollection,
  type WorkflowRow,
} from "./content-workflow";
export {
  listAwaitingReview,
  listRecentAudit,
  summariseContent,
  type CollectionSummary,
} from "./dashboard";
export * as formData from "./form-data";
export {
  listHref,
  pageCount,
  pageWindow,
  PAGE_SIZE,
  parseListParams,
  type ListParams,
} from "./list-params";
export { ActionError, ConflictError, fieldErrorsOf, parseInput, runAction } from "./run-action";
export {
  availableTransitions,
  canDelete,
  canEdit,
  canTransition,
  contentStatuses,
  statusLabel,
  transitions,
  type ContentStatus,
  type TransitionName,
} from "./workflow";
