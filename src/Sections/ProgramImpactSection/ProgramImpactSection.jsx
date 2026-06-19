// dus-frontend/src/Sections/ProgramImpactSection/ProgramImpactSection.jsx

/**
 * ============================================
 * PROGRAM IMPACT SECTION - Impact Gallery with SDGs
 * ============================================
 * 
 * PURPOSE:
 * - Displays impact images with a carousel/slider
 * - Shows SDG (Sustainable Development Goals) icons
 * - Used to showcase program impact and alignment with UN SDGs
 * 
 * DATA STRUCTURE:
 * {
 *   section: {
 *     title: "Our Impact in Photos",
 *     mainImage: { images: ["img1.jpg", "img2.jpg", ...] }
 *   },
 *   sdgImages: [
 *     { id, src, alt, link }
 *   ]
 * }
 * 
 * FEATURES:
 * - Image carousel with dot indicators
 * - Hover zoom on images
 * - SDG icons grid with clickable links
 * - Responsive grid (2, 3, 4, or 6 columns)
 * 
 * ============================================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
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
 * ProgramImpactSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Impact data with section and sdgImages
 * @param {string} props.bgColor - Background color (default: 'bg-white')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'program-impact')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered program impact section
 */
const ProgramImpactSection = ({
  data,
  bgColor = 'bg-white',
  paddingY = 'py-12 sm:py-16 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-75',
  sectionClassName = '',
  sectionId = 'program-impact',
  storageUrl = '',
}) => {
  // ============================================
  // STATE - Current slide index
  // ============================================
  const [index, setIndex] = useState(0);

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(data)) return null;

  const { section = {}, sdgImages = [] } = data;
  const images = section?.mainImage?.images || [];

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasImages = hasValue(images);
  const hasTitle = hasValue(section.title);
  const hasSdgImages = hasValue(sdgImages);

  if (!hasImages && !hasTitle && !hasSdgImages) return null;

  // ============================================
  // HANDLERS
  // ============================================
  const goToSlide = (i) => setIndex(i);

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
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* ============================================
          IMPACT IMAGE CAROUSEL
          ============================================ */}
      {hasImages && (
        <div className="w-full flex flex-col items-center pb-8 sm:pb-10 lg:pb-15">
          <div className="w-full">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl group">
              {/* Current Image */}
              {hasValue(images[index]) && (
                <ImageWithFallback
                  src={getImageSrc(images[index])}
                  alt={`Impact slide ${index + 1}`}
                  fallbackType="impact"
                  className="w-full h-48 sm:h-64 md:h-96 lg:h-186.25 object-cover transition-all duration-500 group-hover:scale-105"
                />
              )}

              {/* Dot Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${i === index
                          ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white"
                          : "w-2 sm:w-2.5 h-1.5 sm:h-2 bg-white/50 hover:bg-white/70"
                        }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          SECTION TITLE
          ============================================ */}
      {hasTitle && (
        <h1 className='text-[#080C14] text-[20px] sm:text-[22px] lg:text-[24px] font-600 mb-4 sm:mb-5 lg:mb-6'>
          {section.title}
        </h1>
      )}

      {/* ============================================
          SDG IMAGES GRID
          ============================================ */}
      {hasSdgImages && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5'>
          {sdgImages.map((image) => (
            <div key={image.id} className="cursor-pointer">
              {image.link ? (
                // Clickable SDG icon
                <Link to={image.link}>
                  <ImageWithFallback
                    src={getImageSrc(image.src)}
                    alt={image.alt || "SDG"}
                    fallbackType="sdg"
                    className='w-full h-auto object-cover rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300'
                  />
                </Link>
              ) : (
                // Non-clickable SDG icon
                <ImageWithFallback
                  src={getImageSrc(image.src)}
                  alt={image.alt || "SDG"}
                  fallbackType="sdg"
                  className='w-full h-auto object-cover rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300'
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProgramImpactSection;