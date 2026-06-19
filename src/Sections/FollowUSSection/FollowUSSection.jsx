// dus-frontend/src/Sections/FollowUSSection/FollowUSSection.jsx

/**
 * ============================================
 * FOLLOW US SECTION - Social Media Grid
 * ============================================
 * 
 * PURPOSE:
 * - Displays social media links in a grid
 * - Shows branded icons for each platform
 * - Used to drive social media engagement
 * 
 * DATA STRUCTURE:
 * {
 *   title: "Follow Us",
 *   socialItems: [
 *     { label, url, icon, iconUrl }
 *   ]
 * }
 * - OR -
 * [ { label, url, icon, iconUrl }, ... ]
 * 
 * ICON SUPPORT:
 * - Built-in: facebook, instagram, linkedin, youtube, twitter, x
 * - Custom: iconUrl for custom images
 * 
 * FEATURES:
 * - Grid layout (2, 3, or 5 columns responsive)
 * - Hover animations (scale + background change)
 * - Support for both icon components and custom images
 * - Border separators between items
 * 
 * ============================================
 */

import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
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

// ============================================
// ICON MAPPING
// ============================================
const iconMapping = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  x: FaXTwitter,
};

/**
 * FollowUSSection Component
 * 
 * @param {Object} props
 * @param {Object|Array} props.data - Social data (object with socialItems OR array)
 * @param {string} props.bgColor - Background color (default: 'bg-white')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'follow-us')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered follow us section
 */
const FollowUSSection = ({
  data,
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-14 lg:py-37.5',
  paddingX = 'px-4 sm:px-6 lg:px-8 xl:px-50',
  sectionClassName = '',
  sectionId = 'follow-us',
  storageUrl = '',
}) => {
  // ============================================
  // NORMALIZE DATA - Handle both formats
  // ============================================
  let socialItems = [];
  let title = "Follow Us";

  if (Array.isArray(data)) {
    socialItems = data;
  } else if (data && typeof data === 'object') {
    socialItems = data.socialItems || [];
    title = data.title || title;
  }

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(socialItems) || socialItems.length === 0) {
    return null;
  }

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

  /**
   * Render the appropriate icon for each social item
   * - If iconUrl is provided: use custom image
   * - Else: use built-in icon mapping
   * - Fallback: show placeholder
   */
  const renderIcon = (item) => {
    // If custom icon URL is provided, use it
    if (hasValue(item.iconUrl)) {
      return (
        <ImageWithFallback
          src={getImageSrc(item.iconUrl)}
          alt={item.label || 'Social icon'}
          fallbackType="social"
          className="w-16 h-16 object-contain"
        />
      );
    }

    // Otherwise use icon mapping
    const IconComponent = iconMapping[item.icon?.toLowerCase()];
    if (!IconComponent) {
      // Fallback to placeholder if icon not found
      return (
        <ImageWithFallback
          src={null}
          alt={item.label || 'Social icon'}
          fallbackType="social"
          className="w-16 h-16 object-contain"
        />
      );
    }
    return <IconComponent className="text-[66px]" />;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`${bgColor} ${sectionClassName}`}
    >
      <div className={`${paddingX} ${paddingY}`}>
        {/* Section Title */}
        {hasValue(title) && (
          <h2 className="text-[#1D2566] font-bold text-[28px] sm:text-[32px] lg:text-[36px] leading-tight pb-6 sm:pb-8 lg:pb-12.5 text-center sm:text-left">
            {title}
          </h2>
        )}

        {/* Social Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border border-[#EFEFEF] bg-white rounded-lg overflow-hidden">
          {socialItems.map((item, index) => (
            <a
              key={item.label || index}
              href={item.url || '#'}
              target={item.url?.startsWith('http') ? '_blank' : '_self'}
              rel={item.url?.startsWith('http') ? 'noopener noreferrer' : ''}
              aria-label={item.label}
              className={`
                flex items-center justify-center py-12 sm:py-16 lg:py-22.5 px-4 sm:px-6 lg:px-30 
                text-[#1D2566] transition-all duration-300 hover:bg-[#F7F8FC] hover:scale-105
                /* Border styling - complex borders */
                ${index !== socialItems.length - 1 && (index % 2 === 0 || (index % 2 === 1 && index < socialItems.length - 1))
                  ? 'border-r border-[#EFEFEF]'
                  : ''
                }
                ${index < socialItems.length - 2 && index % 2 === 0
                  ? 'border-b border-[#EFEFEF] md:border-b-0'
                  : index < socialItems.length - 1 && index % 2 === 1 && socialItems.length > 2
                    ? 'border-b border-[#EFEFEF] md:border-b-0'
                    : ''
                }
                ${index % 2 === 1 && index !== socialItems.length - 1
                  ? 'border-r-0 sm:border-r md:border-r border-[#EFEFEF]'
                  : ''
                }
              `}
            >
              {renderIcon(item)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FollowUSSection;