// dus-frontend/src/pages/AboutDetails/AboutDetailsContent.jsx

/**
 * ============================================
 * ABOUT DETAILS CONTENT - About Sub-Page Renderer
 * ============================================
 * 
 * PURPOSE:
 * - Finds and renders a single about sub-page
 * - Renders content with title, image, rich text
 * - Supports custom button (CTA)
 * 
 * DATA SOURCE:
 * - about_content.json from the API
 * - Each item has: slug, title, content, full_content, image, btn_text, btn_link
 * 
 * COMPONENT STRUCTURE:
 * 1. PageBannerSection - Hero banner with title
 * 2. ContentSection - Main content with title, image, rich text, button
 * 3. Other dynamic sections (e.g., FAQ, Cards)
 * 
 * DATA FLOW:
 * 1. Receives aboutContentData (all about items) and slug from parent
 * 2. Finds the specific content by slug
 * 3. Renders sections with the content data
 * 
 * ============================================
 */

// React
import { Link } from 'react-router-dom';

// Shared
import ImageWithFallback from '../../Shared/ImageWithFallback';
import DynamicSectionRenderer from '../../Shared/DynamicSectionRenderer';

// Utility
import { createSanitizedHTML } from '../../utils/sanitize';

// ============================================
// INTERNAL COMPONENTS
// ============================================

/**
 * ContentSection - Renders about content
 * 
 * Displays:
 * - Title
 * - Image (with fallback)
 * - Rich text content
 * - CTA Button (optional)
 * 
 * @param {Object} props
 * @param {Object} props.subPageData - About content data
 * @param {string} props.bgColor - Background color
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID for anchors
 * @param {string} props.storageUrl - Image storage base URL
 */
const ContentSection = ({ subPageData, bgColor, paddingY, paddingX, sectionClassName, sectionId, storageUrl = '' }) => {
  const data = subPageData || {};
  const {
    title,
    content,
    full_content: fullContent,
    image,
    btn_text: btnText,
    btn_link: btnLink
  } = data;

  const bodyContent = fullContent || content || '';

  // Don't render if no title or content
  if (!title && !bodyContent) return null;

  // CTA button (if both text and link are provided)
  const btn = (btnText && btnLink) ? { text: btnText, link: btnLink } : null;

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
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
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
            alt={title || 'About image'}
            fallbackType="about"
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Rich Text Content (sanitized) */}
      {bodyContent && (
        <div
          className="bricolage-grotesque prose prose-lg max-w-none
            prose-headings:font-700 prose-headings:text-[#080C14] 
            prose-p:text-[#333333] prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-[#333333] prose-ul:leading-relaxed
            prose-li:text-[#333333] prose-li:leading-relaxed
            prose-strong:text-[#009BE2]
            prose-h2:font-700 prose-h2:text-[#080C14] prose-h2:mt-8 prose-h2:mb-4
            prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl"
          dangerouslySetInnerHTML={createSanitizedHTML(bodyContent)}
        />
      )}

      {/* CTA Button */}
      {btn && (
        <div className="mt-8">
          <Link to={btn.link} className="inline-block bg-[#009BE2] text-white font-600 px-8 py-4 rounded-lg hover:bg-[#007BB5] transition-colors">
            {btn.text}
          </Link>
        </div>
      )}
    </section>
  );
};

// ============================================
// MAIN EXPORT
// ============================================

/**
 * AboutDetailsContent - Main about details renderer
 * 
 * @param {Object} props
 * @param {Array} props.sectionConfigs - Section configurations
 * @param {string} props.storageUrl - Image storage base URL
 * @param {string} props.slug - About slug from URL
 * @param {Object} props.pageData - Page data from DynamicPage
 * 
 * @returns {JSX.Element} Rendered about content
 */
export default function AboutDetailsContent({
  sectionConfigs,
  storageUrl,
  slug,
  ...pageData
}) {
  // Get about content data
  const inheritedPageData = pageData.pageData || {};
  const aboutContentList = pageData.contentSectionData ||
    inheritedPageData.contentSectionData ||
    pageData.aboutContentData ||
    inheritedPageData.aboutContentData ||
    [];

  // Find the specific content by slug
  const contentData = Array.isArray(aboutContentList)
    ? aboutContentList.find(item => item.slug === slug) || aboutContentList[0] || null
    : aboutContentList;

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
  let mergedPageData = {
    ...inheritedPageData,
    ...pageData,
    contentSectionData: contentData,
    aboutContentData: contentData,
  };

  // Update banner title with content title
  if (mergedPageData.bannerData && contentData) {
    mergedPageData.bannerData = {
      ...mergedPageData.bannerData,
      content: {
        ...mergedPageData.bannerData.content,
        title: {
          ...mergedPageData.bannerData.content?.title,
          text: contentData.title || mergedPageData.bannerData.content?.title?.text || 'About'
        }
      }
    };
  }

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
          pageData={mergedPageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* Fixed Sections - Rendered by this component */}
      {fixedSections.map((section) => {
        if (section.component === 'ContentSection') {
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
            <ContentSection
              key={section.id}
              subPageData={contentData}
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
          pageData={mergedPageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </>
  );
}