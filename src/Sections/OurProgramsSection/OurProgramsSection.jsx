// dus-frontend/src/Sections/OurProgramsSection/OurProgramsSection.jsx

/**
 * ============================================
 * OUR PROGRAMS SECTION - Sticky Card Program Showcase
 * ============================================
 * 
 * PURPOSE:
 * - Displays programs in a visually stunning sticky card layout
 * - Each program is a card that sticks as you scroll
 * - Cards stack on top of each other with parallax effect
 * 
 * DATA STRUCTURE:
 * {
 *   section: { title, description, button: { text, link } },
 *   programs: [
 *     { id, title, description, image, slug, bg_color, is_featured }
 *   ]
 * }
 * - OR -
 * [ { id, title, description, image, slug, bg_color, is_featured }, ... ]
 * 
 * FEATURES:
 * - Sticky cards with parallax scroll effect
 * - Intersection Observer for fade-in animations
 * - HTML content truncation (9 lines max)
 * - Custom background color per program
 * - "Read More" links with arrow icon
 * 
 * ============================================
 */

import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import ArrowIcon from "../../Shared/ArrowIcon";
import ImageWithFallback from '../../Shared/ImageWithFallback';
import { createSanitizedHTML } from '../../utils/sanitize';

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
// DEFAULT SECTION - Used on the homepage
// ============================================
const DEFAULT_SECTION = {
  title: 'Our Programs',
  description: 'Explore the key programs and initiatives we run to support communities, build resilience, and create lasting impact.',
  button: {
    text: 'View All Programs',
    link: '/projects-programs',
  },
};

/**
 * OurProgramsSection Component
 * 
 * @param {Object} props
 * @param {Object|Array} props.data - Program data (object with section/programs OR array)
 * @param {string} props.pageSlug - Current page slug (home pages use default header)
 * @param {string} props.bgColor - Background color (default: 'bg-white')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'our-programs')
 * @param {number|null} props.limit - Max number of programs to show
 * @param {boolean} props.showFeatured - Show only featured programs
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered our programs section
 */
const OurProgramsSection = ({
  data,
  pageSlug = '',
  bgColor = 'bg-white',
  paddingY = 'py-12 sm:py-16 lg:py-20',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  sectionClassName = '',
  sectionId = 'our-programs',
  limit = null,
  showFeatured = false,
  storageUrl = '',
}) => {
  // ============================================
  // STATE - Track which cards are visible
  // ============================================
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  // ============================================
  // INTERSECTION OBSERVER - Fade-in animation
  // ============================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = parseInt(entry.target.getAttribute("data-id"));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (!prev.includes(cardId)) {
                return [...prev, cardId];
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(data)) return null;

  // ============================================
  // NORMALIZE DATA - Handle both formats
  // ============================================
  let section = {};
  let programList = [];

  if (Array.isArray(data)) {
    programList = data;
  } else if (data && typeof data === 'object') {
    section = data.section || {};
    programList = data.programs || [];
    if (programList.length === 0 && Array.isArray(data.programs)) {
      programList = data.programs;
    }
  }

  if (programList.length === 0 && Array.isArray(data)) {
    programList = data;
  }

  // ============================================
  // PROCESS HEADER - Homepage uses default header
  // ============================================
  const useDefaultHeader = pageSlug === 'home';

  const header = useDefaultHeader
    ? {
      ...DEFAULT_SECTION,
      ...section,
      button: {
        ...DEFAULT_SECTION.button,
        ...(section.button || {}),
      },
    }
    : {
      ...section,
      button: {
        ...(section.button || {}),
      },
    };

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasTitle = hasValue(header.title);
  const hasDescription = hasValue(header.description);
  const hasButton = hasValue(header.button?.text);

  const showHeader = hasTitle || hasDescription || hasButton;
  const hasPrograms = hasValue(programList);

  if (!showHeader && !hasPrograms) return null;

  // ============================================
  // FILTER PROGRAMS
  // ============================================
  let displayPrograms = [...programList];

  if (showFeatured) {
    displayPrograms = displayPrograms.filter(p => p.is_featured === 1);
  }

  if (displayPrograms.length === 0 && showFeatured) {
    displayPrograms = [...programList];
  }

  if (limit !== null && limit > 0) {
    displayPrograms = displayPrograms.slice(0, limit);
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Strip HTML tags to get plain text
   */
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  /**
   * Truncate HTML content to a max number of lines
   * Approximates lines by word count (20 words per line)
   */
  const truncateHtml = (html, maxLines = 9) => {
    if (!html) return '';

    const plainText = stripHtmlTags(html);
    const words = plainText.split(' ');
    const wordsPerLine = 20;
    const maxWords = maxLines * wordsPerLine;

    if (words.length <= maxWords) {
      return html;
    }

    let truncatedText = words.slice(0, maxWords).join(' ');
    truncatedText = truncatedText + '...';

    return `<p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">${truncatedText}</p>`;
  };

  /**
   * Build image URL with storage path
   */
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  // Calculate container height for sticky effect
  const containerHeight = displayPrograms.length > 0 ? displayPrograms.length * 100 : 0;

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* ============================================
          HEADER
          ============================================ */}
      {showHeader && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 sm:pb-10 lg:pb-15 gap-5">
          {/* Title and Description */}
          {(hasTitle || hasDescription) && (
            <div className="max-w-250">
              {hasTitle && (
                <h1 className="bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-[#080C14] pb-3 sm:pb-4 lg:pb-5">
                  {header.title}
                </h1>
              )}
              {hasDescription && (
                <p className="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151]">
                  {header.description}
                </p>
              )}
            </div>
          )}
          {/* "View All" Button */}
          {hasButton && (
            <Link
              to={header.button?.link || '/projects-programs'}
              className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-4 lg:py-5 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              {header.button.text}
              <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </Link>
          )}
        </div>
      )}

      {/* ============================================
          STICKY CARDS - Parallax scroll effect
          ============================================ */}
      {hasPrograms && displayPrograms.length > 0 && (
        <>
          <div
            className={`relative ${showHeader ? "mt-16 sm:mt-24 lg:mt-32" : ""}`}
            style={{ height: `${containerHeight}vh` }}
          >
            {displayPrograms.map((program, index) => {
              // Skip invalid programs
              if (!hasValue(program) && !program.title && !program.description) {
                return null;
              }

              const descriptionText = program.description || program.excerpt || program.full_content_html || '';
              const truncatedDescription = truncateHtml(descriptionText, 9);

              return (
                <div
                  key={program.id || index}
                  ref={(el) => (cardsRef.current[index] = el)}
                  data-id={program.id || index}
                  className={`
                    sticky top-25 w-full
                    transition-all duration-700 ease-out
                    ${visibleCards.includes(program.id || index)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-16"
                    }
                  `}
                  style={{ zIndex: index + 1 }}
                >
                  {/* Program Card */}
                  <div
                    className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-25 p-5 sm:p-6 md:p-8 lg:p-25 rounded-3xl min-h-162.5 lg:h-187.5 shadow-lg"
                    style={{ backgroundColor: program.bg_color || '#ffffff' }}
                  >
                    {/* Left - Program Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      {hasValue(program.title) && (
                        <h3 className="bricolage-grotesque font-600 text-[24px] sm:text-[28px] md:text-[36px] lg:text-[46px] text-[#080C14] leading-tight mb-5">
                          {program.title}
                        </h3>
                      )}

                      {truncatedDescription && (
                        <div
                          className="bricolage-grotesque font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-9"
                          dangerouslySetInnerHTML={createSanitizedHTML(truncatedDescription)}
                        />
                      )}

                      {hasValue(program.slug) && (
                        <Link
                          to={`/projects-programs/${program.slug}`}
                          className="mt-6 bricolage-grotesque flex items-center gap-2 font-500 lg:font-600 text-[16px] sm:text-[17px] lg:text-[20px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300 w-fit"
                        >
                          Read more
                          <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </Link>
                      )}
                    </div>

                    {/* Right - Program Image */}
                    {hasValue(program.image) && (
                      <div className="w-full lg:w-1/2">
                        <ImageWithFallback
                          src={getImageSrc(program.image)}
                          alt={program.title || "Program image"}
                          fallbackType="program"
                          className="w-full h-75 sm:h-100 lg:h-150 object-cover rounded-3xl hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spacer for scroll */}
          <div className="h-50" />
        </>
      )}
    </section>
  );
};

export default OurProgramsSection;