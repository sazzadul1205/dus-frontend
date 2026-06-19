// dus-frontend/src/pages/BlogDetails/BlogDetailsContent.jsx

/**
 * ============================================
 * BLOG DETAILS CONTENT - Blog Post Renderer
 * ============================================
 * 
 * PURPOSE:
 * - Finds and renders a single blog post
 * - Renders blog banner with tags, author, date
 * - Renders blog content with rich text
 * - Shows related blog posts
 * 
 * COMPONENT STRUCTURE:
 * 1. BannerSection - Hero banner with title, tags, author, date
 * 2. BlogContentSection - Main blog content with social sharing
 * 3. Related blogs - From DynamicSectionRenderer (BlogSection with isRelated)
 * 
 * DATA FLOW:
 * 1. Receives blogsData (all blogs) and slug from parent
 * 2. Finds the specific blog by slug
 * 3. Parses tags (if they're stored as JSON string)
 * 4. Renders sections with the blog data
 * 
 * HOW TAGS WORK:
 * - Tags can be stored as array or JSON string
 * - If string: try JSON.parse, fallback to empty array
 * - Related blogs are filtered by tag matching
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
 * BannerSection - Hero banner for blog post
 * 
 * Displays:
 * - Blog image with overlay
 * - Tags with color coding
 * - Title
 * - Author, date, read time
 * 
 * @param {Object} props
 * @param {Object} props.blogData - Blog post data
 * @param {string} props.bgColor - Background color
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID for anchors
 * @param {string} props.storageUrl - Image storage base URL
 */
const BannerSection = ({ blogData, bgColor, paddingY, paddingX, sectionClassName, sectionId, storageUrl = '' }) => {
  // Tag colors for visual variety
  const tagColors = [
    "bg-[#3866FF]", "bg-[#503AF2]", "bg-[#00B894]",
    "bg-[#FF6B6B]", "bg-[#FDCB6E]", "bg-[#6C5CE7]",
  ];

  // Don't render if no blog data
  if (!blogData) return null;

  const tags = blogData.tags || [];

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
      <div className="relative isolate w-full h-125 overflow-hidden bg-[#080C14] rounded-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {blogData?.image && (
            <ImageWithFallback
              src={getImageSrc(blogData.image)}
              alt={blogData.title || 'Blog banner'}
              fallbackType="banner"
              className="h-full w-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-black/60">
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/10 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-275 mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 h-full flex flex-col items-center justify-start text-center">
          {/* Tags */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap mb-5">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-white text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md ${tagColors[index % tagColors.length]}`}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-white bg-[#3866FF] text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md">
                Blog Post
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-white font-bold text-[40px] sm:text-[54px] lg:text-[100px] leading-[1.05] mb-4 max-w-380">
            {blogData?.title || 'Blog Post'}
          </h1>

          {/* Meta Info: Author, Date, Read Time */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-white text-[12px] sm:text-[14px] font-semibold">
            <div className="flex items-center gap-2.5">
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <ImageWithFallback
                  src="https://placehold.co/20x20"
                  alt="Author"
                  fallbackType="user"
                  className="w-5 h-5 object-cover"
                />
                <div className="absolute inset-0 bg-[#503AF2]/40" />
              </div>
              <p className="flex items-center">
                BY : <Link to="/author" className="underline pl-1">{blogData?.author || 'ADMIN'}</Link>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <span>{blogData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">⏱️</span>
              <span>{blogData?.read_time || '5 MIN READ'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * BlogContentSection - Main blog content
 * 
 * Displays:
 * - Blog image (repeated for visual emphasis)
 * - Rich text content with sanitization
 * - Social sharing buttons
 * 
 * @param {Object} props
 * @param {Object} props.blogData - Blog post data
 * @param {string} props.bgColor - Background color
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID for anchors
 * @param {string} props.storageUrl - Image storage base URL
 */
const BlogContentSection = ({ blogData, bgColor, paddingY, paddingX, sectionClassName, sectionId, storageUrl = '' }) => {
  if (!blogData) return null;

  const content = blogData.full_content || blogData.fullContent || '';

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  return (
    <section id={sectionId} className={`${bgColor || 'bg-white'} ${paddingY || 'py-12 lg:py-16'} ${paddingX || 'px-4'} ${sectionClassName || ''}`}>
      {/* Featured Image (sticky, overlapping banner) */}
      <div className="relative z-10 max-w-275 mx-auto">
        {blogData?.image && (
          <div className="-mt-16 sm:-mt-20 lg:-mt-24">
            <ImageWithFallback
              src={getImageSrc(blogData.image)}
              alt={blogData?.title || "Blog main image"}
              fallbackType="blog"
              className="w-full h-auto max-h-96 sm:max-h-125 object-cover object-center rounded-[28px] shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Content with Social Sharing */}
      <div className="max-w-275 mx-auto mt-12 sm:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-25">
          {/* Social Sharing - Desktop (sticky) */}
          <div className="hidden lg:flex flex-col items-center gap-4 pt-2 sticky top-25">
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <span className="text-sm">f</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <span className="text-sm">in</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <span className="text-sm">ig</span>
            </a>
          </div>

          {/* Blog Content with Sanitization */}
          <div className="flex-1">
            {content && (
              <div
                className="bricolage-grotesque prose prose-sm sm:prose-base lg:prose-lg max-w-none
                  prose-headings:font-700 prose-headings:text-[#080C14]
                  prose-p:text-[#333333] prose-p:leading-relaxed
                  prose-ul:text-[#333333] prose-ul:leading-relaxed
                  prose-li:text-[#333333] prose-li:leading-relaxed
                  prose-strong:text-[#009BE2]
                  prose-p:mt-4 prose-p:mb-4
                  prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:mt-6 prose-h3:mb-3"
                dangerouslySetInnerHTML={createSanitizedHTML(content)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// MAIN EXPORT
// ============================================

/**
 * BlogDetailsContent - Main blog details renderer
 * 
 * @param {Object} props
 * @param {Array} props.sectionConfigs - Section configurations
 * @param {string} props.storageUrl - Image storage base URL
 * @param {Object} props.blogData - Blog data (passed from parent)
 * @param {Array} props.blogsData - All blog posts
 * @param {string} props.slug - Blog slug from URL
 * @param {Object} props.pageData - Page data from DynamicPage
 * 
 * @returns {JSX.Element} Rendered blog content
 */
export default function BlogDetailsContent({
  sectionConfigs,
  storageUrl,
  blogData: propBlogData,
  blogsData = [],
  slug,
  ...pageData
}) {
  // Find the specific blog by slug
  const blogData = propBlogData || blogsData?.find(item => item.slug === slug);

  // If blog not found, show error message
  if (!blogData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
          <p className="text-gray-600">The requested blog post could not be found.</p>
          <Link to="/blogs" className="inline-block mt-4 bg-[#009BE2] text-white px-6 py-2 rounded-lg hover:bg-[#009BE2]/80">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // PARSE TAGS (if stored as JSON string)
  // ============================================
  let parsedBlogData = { ...blogData };
  if (blogData?.tags && typeof blogData.tags === 'string') {
    try {
      parsedBlogData.tags = JSON.parse(blogData.tags);
    } catch (error) {
      console.error('Error parsing blog tags:', error);
      parsedBlogData.tags = [];
    }
  }

  // ============================================
  // SECTION FILTERING
  // ============================================
  // Get all enabled sections
  const allSections = (sectionConfigs || [])
    .filter(section => section.is_enabled === 1);

  // Separate fixed sections (rendered by this component) and dynamic sections
  const fixedSections = allSections.filter(section => section.is_fixed_section === 1);
  const dynamicSections = allSections.filter(section => section.is_fixed_section !== 1)
    .sort((a, b) => a.display_order - b.display_order);

  // Find banner section (displayed first)
  const bannerSection = dynamicSections.find(s => s.component === 'BannerSection');
  // Other sections after banner
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'BannerSection');

  // ============================================
  // MERGE PAGE DATA
  // ============================================
  let mergedPageData = { ...pageData };

  // Update banner title with blog title
  if (mergedPageData.bannerData && blogData) {
    mergedPageData.bannerData = {
      ...mergedPageData.bannerData,
      content: {
        ...mergedPageData.bannerData.content,
        title: {
          ...mergedPageData.bannerData.content?.title,
          text: blogData.title || mergedPageData.bannerData.content?.title?.text || 'Blog Post'
        }
      }
    };
  }

  // Create updated page data with blog info
  const inheritedPageData = pageData.pageData || {};
  const updatedPageData = {
    ...inheritedPageData,
    ...mergedPageData,
    blogData: parsedBlogData,
    blogsData: blogsData,
    // Related blogs: filter by matching tags (if tags exist)
    relatedBlogsData: blogsData
      .filter(item => item?.slug && item.slug !== parsedBlogData.slug)
      .filter(item => {
        // If no tags, show all (except current)
        if (!Array.isArray(parsedBlogData.tags) || parsedBlogData.tags.length === 0) {
          return true;
        }

        // Parse item tags (if string)
        const itemTags = Array.isArray(item.tags)
          ? item.tags
          : typeof item.tags === 'string'
            ? (() => {
              try {
                const parsed = JSON.parse(item.tags);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })()
            : [];

        // Check if any tag matches
        return itemTags.some(tag => parsedBlogData.tags.includes(tag));
      }),
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
        const { component, custom_props = {} } = section;

        let parsedCustomProps = {};
        if (custom_props) {
          try {
            parsedCustomProps = typeof custom_props === 'string'
              ? JSON.parse(custom_props)
              : custom_props;
          } catch (e) {
            console.error('Failed to parse custom_props:', e);
          }
        }

        if (component === 'BlogContentSection') {
          return (
            <BlogContentSection
              key={section.id}
              blogData={parsedBlogData}
              storageUrl={storageUrl}
              {...parsedCustomProps}
            />
          );
        }

        if (component === 'BannerSection') {
          return (
            <BannerSection
              key={section.id}
              blogData={parsedBlogData}
              storageUrl={storageUrl}
              {...parsedCustomProps}
            />
          );
        }

        return null;
      })}

      {/* Other Dynamic Sections - e.g., Related Blogs section */}
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