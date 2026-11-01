import { base44 } from '@/api/base44Client';

// An article record has a size cap, so long HTML is kept in a private file and
// referenced by the record instead. This is the content size the record can
// still hold comfortably alongside every other field.
export const MAX_INLINE_CONTENT_BYTES = 60000;

export const contentBytes = (html) => new Blob([html || '']).size;

// Stores the full HTML privately and returns the file URI to save on the article.
export async function uploadArticleContent(html) {
  const file = new File([html], `article-content-${Date.now()}.html`, { type: 'text/html' });
  const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
  if (!file_uri) throw new Error('The article content could not be uploaded.');
  return file_uri;
}

// Reads back the HTML stored for a file-backed article.
export async function fetchArticleContent(articleId) {
  const res = await base44.functions.invoke('getArticleContent', { article_id: articleId });
  if (res.data?.error) throw new Error(res.data.error);
  return res.data?.content || '';
}