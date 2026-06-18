// dus-frontend/src/utils/sanitize.js

import DOMPurify from "dompurify";

// Configure DOMPurify for safe HTML rendering
export const purifyConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "s",
    "strike",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "div",
    "img",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
    "sub",
    "sup",
    "small",
    "mark",
    "del",
    "ins",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "alt",
    "src",
    "class",
    "id",
    "style",
    "title",
    "width",
    "height",
    "align",
    "valign",
    "colspan",
    "rowspan",
    "scope",
    "headers",
    "cellpadding",
    "cellspacing",
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target"],
  FORBID_TAGS: [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
  ],
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "onblur",
    "onsubmit",
  ],
  ALLOWED_URI_REGEXP:
    // eslint-disable-next-line no-useless-escape
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|data|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  USE_PROFILES: { html: true },
};

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param {string} htmlString - The HTML string to sanitize
 * @returns {string} Sanitized HTML string
 */
export const sanitizeHTML = (htmlString) => {
  if (!htmlString) return "";
  try {
    return DOMPurify.sanitize(htmlString, purifyConfig);
  } catch (error) {
    console.error("Error sanitizing HTML content:", error);
    // Fallback: remove all tags
    return htmlString.replace(/<[^>]*>/g, "");
  }
};

/**
 * Create a sanitized HTML object for dangerouslySetInnerHTML
 * @param {string} htmlString - The HTML string to sanitize
 * @returns {Object} { __html: sanitizedString }
 */
export const createSanitizedHTML = (htmlString) => {
  return { __html: sanitizeHTML(htmlString) };
};

// Export DOMPurify for advanced use cases
export { DOMPurify };
