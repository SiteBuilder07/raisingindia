/**
 * Small helpers to keep page title, description and social preview tags
 * in sync with the content being viewed.
 */
const DEFAULT_TITLE = 'RaisingIndia — Expert Parenting Tips for Indian Families';
const DEFAULT_DESCRIPTION =
  'Expert parenting tips, child development insights and education advice for Indian families, all in one place.';

function setTag(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (selector.includes('property=')) {
      el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
    } else {
      el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function setPageMeta({ title, description, image, url } = {}) {
  const fullTitle = title ? `${title} | RaisingIndia` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const pageUrl = url || window.location.href;

  document.title = fullTitle;
  setTag('meta[name="description"]', 'content', desc);
  setTag('meta[property="og:title"]', 'content', fullTitle);
  setTag('meta[property="og:description"]', 'content', desc);
  setTag('meta[property="og:url"]', 'content', pageUrl);
  setTag('meta[property="og:image"]', 'content', image);
  setTag('meta[name="twitter:card"]', 'content', image ? 'summary_large_image' : 'summary');
  setTag('meta[name="twitter:title"]', 'content', fullTitle);
  setTag('meta[name="twitter:description"]', 'content', desc);
  setTag('meta[name="twitter:image"]', 'content', image);
  setCanonical(pageUrl);
}

export function resetPageMeta() {
  setPageMeta({});
}