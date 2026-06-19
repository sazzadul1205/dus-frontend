// dus-frontend/src/Shared/imageConstants.js

/**
 * ============================================
 * IMAGE CONSTANTS - Fallback Images & Utilities
 * ============================================
 *
 * PURPOSE:
 * - Provides fallback image URLs for when images fail to load
 * - Centralizes image URL validation and resolution logic
 * - Used by ImageWithFallback component
 *
 * FALLBACK IMAGES:
 * Each fallback is a placeholder with a specific size and text
 * Color scheme: Brand blue (#009BE2) with white text
 *
 * USAGE:
 * import { getFallbackUrl, getImageUrl } from './imageConstants';
 *
 * const fallbackUrl = getFallbackUrl('banner');
 * const resolvedUrl = getImageUrl('/images/photo.jpg', 'blog', storageUrl);
 *
 * ============================================
 */

/**
 * FALLBACK IMAGES MAP
 * Key: Type of image
 * Value: URL to fallback image
 *
 * Each fallback is a placeholder from placehold.co with:
 * - Width x Height
 * - Background color (brand blue or dark)
 * - Text describing the image type
 */
export const FALLBACK_IMAGES = {
  default:
    "https://placehold.co/800x600/009BE2/FFFFFF?text=Image+Not+Available",
  banner: "https://placehold.co/1920x800/080C14/FFFFFF?text=DUS+Banner",
  blog: "https://placehold.co/600x400/009BE2/FFFFFF?text=Blog+Post",
  program: "https://placehold.co/600x400/009BE2/FFFFFF?text=Program",
  story: "https://placehold.co/400x300/009BE2/FFFFFF?text=Story",
  card: "https://placehold.co/400x300/009BE2/FFFFFF?text=Card+Image",
  about: "https://placehold.co/800x600/009BE2/FFFFFF?text=About+Us",
  event: "https://placehold.co/600x400/009BE2/FFFFFF?text=Event",
  stat: "https://placehold.co/60x60/009BE2/FFFFFF?text=Stat",
  office: "https://placehold.co/60x60/009BE2/FFFFFF?text=Office",
  social: "https://placehold.co/66x66/1D2566/FFFFFF?text=S",
  logo: "https://placehold.co/200x80/080C14/FFFFFF?text=DUS",
  user: "https://placehold.co/40x40/009BE2/FFFFFF?text=User",
  flag: "https://placehold.co/20x15/009BE2/FFFFFF?text=Flag",
  action: "https://placehold.co/60x60/009BE2/FFFFFF?text=Action",
  impact: "https://placehold.co/1200x600/009BE2/FFFFFF?text=Impact+Image",
  sdg: "https://placehold.co/150x150/009BE2/FFFFFF?text=SDG",
};

/**
 * Get fallback URL by type
 *
 * @param {string} type - Key from FALLBACK_IMAGES (default: 'default')
 * @returns {string} Fallback image URL
 *
 * @example
 * getFallbackUrl('banner') // Returns banner placeholder
 * getFallbackUrl() // Returns default placeholder
 */
export const getFallbackUrl = (type = "default") => {
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
};

/**
 * Check if a URL is valid for use as an image src
 *
 * Valid URL patterns:
 * - http:// or https:// (absolute URLs)
 * - / (relative URLs)
 * - data: (data URIs)
 * - blob: (blob URLs)
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 *
 * @example
 * isValidImageUrl('https://example.com/photo.jpg') // true
 * isValidImageUrl('/images/photo.jpg') // true
 * isValidImageUrl('') // false
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  if (typeof url !== "string") return false;

  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith("http")) return true;
  if (trimmedUrl.startsWith("/")) return true;
  if (trimmedUrl.startsWith("data:")) return true;
  if (trimmedUrl.startsWith("blob:")) return true;

  return false;
};

/**
 * Get image URL with fallback
 *
 * Resolves a URL by:
 * 1. If URL is empty → return fallback
 * 2. If URL is absolute (http, data, blob) → return as-is
 * 3. If URL is relative → prepend storageUrl
 * 4. Otherwise → return fallback
 *
 * @param {string} url - Original URL
 * @param {string} fallbackType - Type of fallback to use (default: 'default')
 * @param {string} storageUrl - Base storage URL for relative paths
 * @returns {string} Resolved URL with fallback
 *
 * @example
 * getImageUrl('', 'banner') // Returns banner fallback
 * getImageUrl('https://example.com/photo.jpg', 'blog') // Returns same URL
 * getImageUrl('/images/photo.jpg', 'blog', 'https://storage.com') // Returns 'https://storage.com/images/photo.jpg'
 */
export const getImageUrl = (url, fallbackType = "default", storageUrl = "") => {
  // Empty URL → fallback
  if (!url) {
    return getFallbackUrl(fallbackType);
  }

  // Absolute URLs → return as-is
  if (
    url.startsWith("http") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Relative URLs → prepend storage URL
  if (storageUrl) {
    return `${storageUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  // Fallback to original if nothing else works
  return url;
};
