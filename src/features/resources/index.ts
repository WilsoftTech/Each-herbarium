// Public API of the resources feature. Other modules import only from here.
export { formatResourceDate, ResourceList } from "./components/resource-list";
export { getResource, listResources } from "./queries";
export { resourceSchema, resourceTypeLabel, type Resource } from "./schema";
