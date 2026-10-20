// Public API of the resources feature. Other modules import only from here.
export {
  deleteArticle,
  deleteDownload,
  saveArticle,
  saveDownload,
  transitionArticle,
  transitionDownload,
} from "./admin/actions";
export {
  getArticleForAdmin,
  getDownloadForAdmin,
  listArticlesForAdmin,
  listDownloadsForAdmin,
} from "./admin/admin";
export { getArticleEditor, getArticlePreview, getDownloadEditor } from "./admin/editor";
export { ArticleForm } from "./admin/article-form";
export { DownloadForm } from "./admin/download-form";
export { ArticleDetail } from "./components/article-detail";
export { DownloadList } from "./components/download-list";
export { formatFileSize, formatResourceDate, ResourceList } from "./components/resource-list";
export {
  articleInclude,
  getResource,
  listDownloads,
  listResources,
  toResource,
  type ArticleRow,
} from "./queries";
export { resourceSchema, resourceTypeLabel, type Download, type Resource } from "./schema";
