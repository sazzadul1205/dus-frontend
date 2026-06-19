// dus-frontend/src/Shared/imageConstants.js

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
 * @param {string} type - Key from FALLBACK_IMAGES
 * @returns {string} Fallback image URL
 */
export const getFallbackUrl = (type = "default") => {
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
};

/**
 * Check if a URL is valid for use as an image src
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  if (typeof url !== "string") return false;

  // Check for common image URL patterns
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith("http")) return true;
  if (trimmedUrl.startsWith("/")) return true;
  if (trimmedUrl.startsWith("data:")) return true;
  if (trimmedUrl.startsWith("blob:")) return true;

  return false;
};

/**
 * Get image URL with fallback
 * @param {string} url - Original URL
 * @param {string} fallbackType - Type of fallback to use
 * @param {string} storageUrl - Base storage URL (for relative paths)
 * @returns {string} Resolved URL with fallback
 */
export const getImageUrl = (url, fallbackType = "default", storageUrl = "") => {
  if (!url) {
    return getFallbackUrl(fallbackType);
  }

  // If URL is already absolute, return it
  if (
    url.startsWith("http") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // If URL is relative, prepend storage URL
  if (storageUrl) {
    return `${storageUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  return url;
};
