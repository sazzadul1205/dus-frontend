// dus-frontend/src/Sections/OurActionSection/OurActionSection.jsx

/**
 * ============================================
 * OUR ACTION SECTION - Actions/Initiatives Grid
 * ============================================
 * 
 * PURPOSE:
 * - Displays key actions or initiatives in a grid
 * - Each action has an icon, title, and description
 * - Used to showcase what the organization does
 * 
 * DATA STRUCTURE:
 * {
 *   section: { title, description },
 *   actions: [
 *     { id, icon, title, description, alt }
 *   ]
 * }
 * 
 * FEATURES:
 * - Grid layout (1, 2, or 3 columns responsive)
 * - Icon with fallback support
 * - Hover animations (lift + background change)
 * - Clean, card-based design
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
  return true;
};

/**
 * OurActionSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Action data with section and actions
 * @param {string} props.bgColor - Background color (default: 'bg-[#F5F5F5]')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'our-action')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered our action section
 */
const OurActionSection = ({
  data,
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-10 sm:py-15 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  sectionClassName = '',
  sectionId = 'our-action',
  storageUrl = '',
}) => {
  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(data)) return null;

  const { section = {}, actions = [] } = data;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  if (!hasValue(section.title) && !hasValue(section.description) && !hasValue(actions)) {
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`mx-auto ${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* ============================================
          HEADER - Title and Description
          ============================================ */}
      {(section.title || section.description) && (
        <div className="text-center">
          {section.title && (
            <h1 className='bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-center text-[#080C14] pb-3 sm:pb-4'>
              {section.title}
            </h1>
          )}
          {section.description && (
            <p className='mx-auto font-400 text-center text-[16px] sm:text-[18px] lg:text-[20px] max-w-253 text-[#515151] leading-relaxed px-4 sm:px-0'>
              {section.description}
            </p>
          )}
        </div>
      )}

      {/* ============================================
          ACTIONS GRID
          ============================================ */}
      {actions.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7.5 pt-8 sm:pt-10 lg:pt-12.5'>
          {actions.map((action) => (
            <div
              key={action.id}
              className='bg-[#FAFAFA] hover:bg-white p-6 sm:p-8 md:p-10 lg:p-12.5 rounded-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:shadow-[0_6px_12px_rgba(0,0,0,0.10)]'
            >
              {/* Action Icon */}
              {action.icon && (
                <ImageWithFallback
                  src={getImageSrc(action.icon)}
                  alt={action.alt || action.title || "Action icon"}
                  fallbackType="action"
                  className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12.5 lg:h-12.5 group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4 lg:mb-5'
                />
              )}
              {/* Action Title */}
              {action.title && (
                <h3 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] mb-2 sm:mb-3'>
                  {action.title}
                </h3>
              )}
              {/* Action Description */}
              {action.description && (
                <p className='font-400 text-[14px] sm:text-[15px] lg:text-[16px] text-[#515151] leading-relaxed'>
                  {action.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OurActionSection;