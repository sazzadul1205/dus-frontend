// dus-frontend/src/Sections/LegalSection/LegalSection.jsx

/**
 * ============================================
 * LEGAL SECTION - CTA Banner with Legal Content
 * ============================================
 * 
 * PURPOSE:
 * - Displays a full-width banner with legal/CTA content
 * - Shows a text box overlay with title and button
 * - Used for legal notices, disclaimers, or calls to action
 * 
 * DATA STRUCTURE:
 * {
 *   background: { src, alt },
 *   overlay: { darkOverlay },
 *   textBox: {
 *     title: "We are committed to...",
 *     titleLine2: "transparent governance",
 *     buttonText: "Learn More",
 *     buttonLink: "/legal"
 *   }
 * }
 * 
 * FEATURES:
 * - Full-width background image
 * - Dark overlay for text readability
 * - Text box overlay (bottom-right corner)
 * - Two-line title support
 * - CTA button with arrow icon
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
 * LegalSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Legal section data
 * @param {string} props.bgColor - Background color
 * @param {string} props.height - Height classes (default: 'h-125 md:h-147.25')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'legal')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered legal section
 */
const LegalSection = ({
  data,
  bgColor = '',
  height = 'h-125 md:h-147.25',
  paddingY = '',
  paddingX = '',
  sectionClassName = '',
  sectionId = 'legal',
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
    textBox = {}
  } = data;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasBackground = hasValue(background.src);
  const hasOverlay = hasValue(overlay.darkOverlay);
  const hasTitle = hasValue(textBox.title) || hasValue(textBox.titleLine2);
  const hasButton = hasValue(textBox.buttonText) && hasValue(textBox.buttonLink);

  const hasAnyContent = hasBackground || hasOverlay || hasTitle || hasButton;

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
          alt={background.alt || 'Legal background'}
          fallbackType="banner"
          className="w-full h-full object-cover object-center md:object-cover"
        />
      )}

      {/* Dark Overlay */}
      {hasValue(overlay.darkOverlay) && (
        <div className={`absolute inset-0 ${overlay.darkOverlay}`}></div>
      )}

      {/* Mobile Overlay */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* Text Box Overlay - Bottom Right */}
      {(hasTitle || hasButton) && (
        <div className="absolute bottom-5 right-5 md:bottom-10 lg:bottom-12.5 md:right-10 lg:right-50 bg-white/90 backdrop-blur-sm p-6 md:p-8 lg:p-12.5 w-[calc(100%-2.5rem)] md:w-auto lg:w-182.5 h-auto lg:h-75 shadow-lg rounded-lg">

          {/* Title - Supports two lines */}
          {(hasValue(textBox.title) || hasValue(textBox.titleLine2)) && (
            <h3 className="text-black font-700 text-2xl md:text-3xl lg:text-[40px] bricolage-grotesque leading-tight">
              {hasValue(textBox.title) && <span>{textBox.title}</span>}
              {hasValue(textBox.title) && hasValue(textBox.titleLine2) && <br />}
              {hasValue(textBox.titleLine2) && <span>{textBox.titleLine2}</span>}
            </h3>
          )}

          {/* CTA Button */}
          {hasValue(textBox.buttonText) && hasValue(textBox.buttonLink) && (
            <div className='pt-6 md:pt-7 lg:pt-9'>
              <Link
                to={textBox.buttonLink}
                className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
              >
                <span>{textBox.buttonText}</span>
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LegalSection;