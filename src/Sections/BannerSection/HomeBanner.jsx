// dus-frontend/src/Sections/BannerSection/HomeBanner.jsx

/**
 * ============================================
 * HOME BANNER - Hero Section for Homepage
 * ============================================
 * 
 * PURPOSE:
 * - Displays the main hero banner on the homepage
 * - Features a full-width background image
 * - Shows tagline, title, description, and CTA buttons
 * - Responsive: Different heights on mobile vs desktop
 * 
 * DATA STRUCTURE:
 * {
 *   background: { src, alt },
 *   overlay: { darkOverlay, gradient },
 *   content: {
 *     tagline: { text, className },
 *     title: { text },
 *     description: { text }
 *   },
 *   buttons: [
 *     { id, text, link, className, icon: true }
 *   ]
 * }
 * 
 * FEATURES:
 * - Full-width hero with background image
 * - Gradient and dark overlays
 * - Multiple CTA buttons with arrow icons
 * - Mobile-responsive text sizing
 * 
 * ============================================
 */

import { Link } from 'react-router-dom';
import ArrowIcon from '../../Shared/ArrowIcon';
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
 * HomeBanner Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Banner data from API
 * @param {string} props.bgColor - Background color (optional)
 * @param {string} props.height - Height classes (default: 'h-125 md:h-280')
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'banner')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered home banner
 */
const HomeBanner = ({
  data,
  bgColor = '',
  height = 'h-125 md:h-280',
  sectionClassName = '',
  sectionId = 'banner',
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
    buttons = []
  } = data;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasAnyContent = hasValue(content.tagline?.text) ||
    hasValue(content.title?.text) ||
    hasValue(content.description?.text) ||
    hasValue(buttons);

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
      className={`relative w-full ${height} overflow-hidden ${bgColor} ${sectionClassName}`}
    >
      {/* ============================================
          BACKGROUND IMAGE
          ============================================ */}
      {hasValue(background.src) && (
        <ImageWithFallback
          src={getImageSrc(background.src)}
          alt={background.alt || "Banner background"}
          fallbackType="banner"
          className="w-full h-full object-cover object-center md:object-cover"
        />
      )}

      {/* ============================================
          OVERLAYS
          ============================================ */}
      {/* Dark overlay (e.g., 'bg-black/50') */}
      {hasValue(overlay.darkOverlay) && (
        <div className={`absolute inset-0 ${overlay.darkOverlay}`}></div>
      )}

      {/* Gradient overlay (e.g., 'bg-gradient-to-r from-black/80 to-transparent') */}
      {hasValue(overlay.gradient) && (
        <div className={`absolute inset-0 ${overlay.gradient}`}></div>
      )}

      {/* Mobile-only overlay - ensures text readability on small screens */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      {hasAnyContent && (
        <div className="absolute left-0 md:left-5 inset-0 flex items-center p-5 md:p-12.5">
          <div className="w-full px-4 md:px-20 text-white space-y-3 md:space-y-5">

            {/* Tagline - small text above title */}
            {hasValue(content.tagline?.text) && (
              <p className={`bricolage-grotesque ${content.tagline.className || ''} text-white text-center md:text-left text-sm md:text-[30px] tracking-[2px] md:tracking-[4px]`}>
                {content.tagline.text}
              </p>
            )}

            {/* Title - main heading */}
            {hasValue(content.title?.text) && (
              <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75`}>
                {content.title.text}
              </h1>
            )}

            {/* Description - supporting text */}
            {hasValue(content.description?.text) && (
              <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none`}>
                {content.description.text}
              </p>
            )}

            {/* CTA Buttons */}
            {hasValue(buttons) && (
              <div className='flex flex-col sm:flex-row items-center gap-3 md:gap-6 pt-5 md:pt-7.5'>
                {buttons.map((button) => (
                  <Link
                    key={button.id || button.link || button.text}
                    to={button.link || '#'}
                    className={`capitalize font-600 text-[14px] md:text-[18px] px-5 md:px-7.5 py-3 md:py-5 bricolage-grotesque rounded-md inline-flex items-center justify-center gap-2 md:gap-3 group transition-all duration-300 w-full sm:w-auto ${button.className || ''}`}
                  >
                    <span>{button.text}</span>
                    {/* Arrow icon - only shown if icon: true */}
                    {button.icon && (
                      <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default HomeBanner;