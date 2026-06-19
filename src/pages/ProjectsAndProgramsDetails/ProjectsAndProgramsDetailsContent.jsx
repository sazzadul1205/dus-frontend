// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetailsContent.jsx

/**
 * ============================================
 * PROJECTS & PROGRAMS DETAILS CONTENT - Program Renderer
 * ============================================
 * 
 * PURPOSE:
 * - Finds and renders a single program
 * - Renders program banner with title
 * - Renders program content with image and rich text
 * 
 * DATA SOURCE:
 * - programs.json from the API
 * - Each program has: slug, title, content, full_content_html, image, bg_color
 * 
 * COMPONENT STRUCTURE:
 * 1. PageBannerSection - Hero banner with program title
 * 2. ProgramContentSection - Main content with title, image, rich text
 * 3. Other dynamic sections (e.g., ProgramImpactSection, FAQ)
 * 
 * DATA FLOW:
 * 1. Receives programsData (all programs) and slug from parent
 * 2. Finds the specific program by slug
 * 3. Renders sections with the program data
 * 
 * ============================================
 */

// Shared
import ImageWithFallback from '../../Shared/ImageWithFallback';
import DynamicSectionRenderer from '../../Shared/DynamicSectionRenderer';

// Utility
import { createSanitizedHTML } from '../../utils/sanitize';

// ============================================
// INTERNAL COMPONENTS
// ============================================

/**
 * ProgramContentSection - Renders program content
 * 
 * Displays:
 * - Title
 * - Image (with fallback)
 * - Rich text content
 * 
 * @param {Object} props
 * @param {Object} props.programData - Program data
 * @param {string} props.bgColor - Background color
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID for anchors
 * @param {string} props.storageUrl - Image storage base URL
 */
const ProgramContentSection = ({ programData, bgColor, paddingY, paddingX, sectionClassName, sectionId, storageUrl = '' }) => {
  if (!programData) return null;

  // Get content - supports multiple field names
  const content = programData.full_content_html ||
    programData.full_content ||
    programData.content ||
    '';

  const title = programData.title || '';
  const image = programData.image || '';

  // Don't render if no title or content
  if (!title && !content) return null;

  // Apply defaults if not provided
  const finalBgColor = bgColor || 'bg-white';
  const finalPaddingY = paddingY || 'py-10 sm:py-15 md:py-20 lg:py-25';
  const finalPaddingX = paddingX || 'px-5 sm:px-10 md:px-20 lg:px-50';

  /**
   * Build image URL with storage path
   */
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  return (
    <section id={sectionId} className={`${finalBgColor} ${finalPaddingY} ${finalPaddingX} ${sectionClassName || ''}`}>
      {/* Title */}
      {title && (
        <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
          {title}
        </h1>
      )}

      {/* Image */}
      {image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <ImageWithFallback
            src={getImageSrc(image)}
            alt={title || 'Program image'}
            fallbackType="program"
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Rich Text Content (sanitized) */}
      {content && (
        <div
          className="bricolage-grotesque prose prose-lg max-w-none
            prose-headings:font-700 prose-headings:text-[#080C14] 
            prose-p:text-[#333333] prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-[#333333] prose-ul:leading-relaxed
            prose-li:text-[#333333] prose-li:leading-relaxed
            prose-strong:text-[#009BE2]
            prose-h2:font-700 prose-h2:text-[#080C14] prose-h2:mt-8 prose-h2:mb-4
            prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl"
          dangerouslySetInnerHTML={createSanitizedHTML(content)}
        />
      )}
    </section>
  );
};

// ============================================
// MAIN EXPORT
// ============================================

/**
 * ProjectsAndProgramsDetailsContent - Main program details renderer
 * 
 * @param {Object} props
 * @param {Array} props.sectionConfigs - Section configurations
 * @param {string} props.storageUrl - Image storage base URL
 * @param {Object} props.programData - Program data (passed from parent)
 * @param {Array} props.programsData - All programs
 * @param {Object} props.pageData - Page data from DynamicPage
 * @param {string} props.slug - Program slug from URL
 * 
 * @returns {JSX.Element} Rendered program content
 */
export default function ProjectsAndProgramsDetailsContent({
  sectionConfigs,
  storageUrl,
  programData: propProgramData,
  programsData = [],
  pageData = {},
  slug,
}) {
  // Find the specific program by slug
  const programData = propProgramData || programsData?.find(item => item.slug === slug);

  // ============================================
  // SECTION FILTERING
  // ============================================
  const allSections = (sectionConfigs || [])
    .filter(section => section.is_enabled === 1);

  const fixedSections = allSections.filter(section => section.is_fixed_section === 1);
  const dynamicSections = allSections.filter(section => section.is_fixed_section !== 1)
    .sort((a, b) => a.display_order - b.display_order);

  const bannerSection = dynamicSections.find(s => s.component === 'PageBannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'PageBannerSection');

  // ============================================
  // MERGE PAGE DATA
  // ============================================
  let mergedPageData = { ...pageData };

  // Update banner title with program title
  if (mergedPageData.bannerData && programData) {
    mergedPageData.bannerData = {
      ...mergedPageData.bannerData,
      content: {
        ...mergedPageData.bannerData.content,
        title: {
          ...mergedPageData.bannerData.content?.title,
          text: programData.title || mergedPageData.bannerData.content?.title?.text || 'Program'
        }
      }
    };
  }

  const updatedPageData = {
    ...mergedPageData,
    programContentData: programData,
    programsData: programsData,
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* Banner Section - Dynamic section */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={updatedPageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* Fixed Sections - Rendered by this component */}
      {fixedSections.map((section) => {
        if (section.component === 'ProgramContentSection') {
          // Parse custom props from section config
          let customProps = {};
          if (section.custom_props) {
            try {
              customProps = typeof section.custom_props === 'string'
                ? JSON.parse(section.custom_props)
                : section.custom_props;
            } catch (e) {
              console.error('Failed to parse custom_props:', e);
            }
          }

          return (
            <ProgramContentSection
              key={section.id}
              programData={programData}
              slug={slug}
              storageUrl={storageUrl}
              {...customProps}
            />
          );
        }
        return null;
      })}

      {/* Other Dynamic Sections */}
      {otherDynamicSections.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={updatedPageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </>
  );
}