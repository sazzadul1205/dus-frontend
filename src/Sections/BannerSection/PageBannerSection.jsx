// dus-frontend/src/Sections/BannerSection/PageBannerSection.jsx

/**
 * ============================================
 * PAGE BANNER SECTION - Inner Page Hero
 * ============================================
 * 
 * PURPOSE:
 * - Displays a hero banner for inner pages
 * - Simpler than HomeBanner - just title and description
 * - Used on About, Blog, Contact, and other inner pages
 * 
 * DATA STRUCTURE:
 * {
 *   background: { src, alt },
 *   overlay: { darkOverlay, gradient },
 *   content: {
 *     title: { text, className },
 *     description: { text, className }
 *   }
 * }
 * 
 * DIFFERENCES FROM HOMEBANNER:
 * - Lower height (h-147.25 vs h-280)
 * - No tagline or buttons
 * - Title and description only
 * - More subdued styling
 * 
 * ============================================
 */

import ImageWithFallback from '../../Shared/ImageWithFallback';

// ============================================
// UTILITY: Check if value exists
// ============================================
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * PageBannerSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Banner data from API
 * @param {string} props.bgColor - Background color
 * @param {string} props.height - Height classes (default: 'h-125 md:h-147.25')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'page-banner')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered page banner
 */
const PageBannerSection = ({
  data,
  bgColor = '',
  height = 'h-125 md:h-147.25',
  paddingY = '',
  paddingX = '',
  sectionClassName = '',
  sectionId = 'page-banner',
  storageUrl = '',
}) => {
  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(data)) return null;

  // ============================================
  // DESTRUCTURE DATA
  // ============================================
  const {
    background = {},
    overlay = {},
    content = {},
  } = data;

  const title = content.title || {};
  const description = content.description || {};

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasTitle = hasValue(title.text);
  const hasDescription = hasValue(description.text);
  const hasBackground = hasValue(background.src);
  const hasOverlays = hasValue(overlay.darkOverlay) || hasValue(overlay.gradient);

  const hasAnyContent = hasTitle || hasDescription || hasBackground || hasOverlays;

  if (!hasAnyContent) return null;

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Build image URL with storage path
   */
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`relative w-full ${height} overflow-hidden ${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}
    >
      {/* Background Image */}
      {hasValue(background.src) && (
        <ImageWithFallback
          src={getImageSrc(background.src)}
          alt={background.alt || 'Banner background'}
          fallbackType="banner"
          className="w-full h-full object-cover object-center md:object-cover"
        />
      )}

      {/* Overlays */}
      {hasValue(overlay.darkOverlay) && (
        <div className={`absolute inset-0 ${overlay.darkOverlay}`}></div>
      )}
      {hasValue(overlay.gradient) && (
        <div className={`absolute inset-0 ${overlay.gradient}`}></div>
      )}

      {/* Mobile overlay */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* Content */}
      {(hasTitle || hasDescription) && (
        <div className="absolute left-0 md:left-10 inset-0 flex items-center p-5 md:p-12.5">
          <div className="w-full px-4 md:px-20 text-white space-y-3 md:space-y-5">

            {/* Title */}
            {hasTitle && (
              <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75 ${title.className || ''}`}>
                {title.text}
              </h1>
            )}

            {/* Description */}
            {hasDescription && (
              <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none ${description.className || ''}`}>
                {description.text}
              </p>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default PageBannerSection;