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
 * - Handles Laravel /asset/ paths
 *
 * ============================================
 */

// Get the base URL for assets from environment
const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_URL || "http://localhost:8000/asset/";

/**
 * FALLBACK IMAGES MAP
 * Key: Type of image
 * Value: URL to fallback image
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
 */
export const getFallbackUrl = (type = "default") => {
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
};

/**
 * Check if a URL is valid for use as an image src
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
 * Get image URL with fallback - Handles Laravel /asset/ paths
 */
export const getImageUrl = (
  url,
  fallbackType = "default",
  baseUrl = ASSET_BASE_URL,
) => {
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

  // Handle /storage/ paths → convert to /asset/
  if (url.startsWith("/storage/")) {
    const cleanPath = url.replace(/^\/storage\//, "");
    return `${baseUrl}${cleanPath}`;
  }

  // Handle /asset/ paths (already correct)
  if (url.startsWith("/asset/")) {
    const cleanPath = url.replace(/^\/asset\//, "");
    return `${baseUrl}${cleanPath}`;
  }

  // Handle paths that start with / (but not /asset/ or /storage/)
  if (url.startsWith("/")) {
    const cleanPath = url.replace(/^\//, "");
    return `${baseUrl}${cleanPath}`;
  }

  // Handle paths in format "FolderName/filename.ext"
  // e.g., "AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.webp"
  if (url.includes("/") && !url.startsWith("http")) {
    return `${baseUrl}${url}`;
  }

  // Handle filenames (like from /images/)
  // e.g., "Icon.svg", "Icon-bottom.svg"
  if (!url.includes("/")) {
    return `${baseUrl}images/${url}`;
  }

  // Default: prepend base URL
  return `${baseUrl}${url}`;
};
