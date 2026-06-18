// dus-frontend/src/pages/BlogDetails/BlogDetailsContent.jsx

// React
import { Link } from 'react-router-dom';

// Dynamic Section Renderer
import DynamicSectionRenderer from '../../Shared/DynamicSectionRenderer';

// Utility
import { createSanitizedHTML } from '../../utils/sanitize';

// Internal components (used as fallback or for special handling)
const BannerSection = ({ blogData, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const tagColors = [
    "bg-[#3866FF]", "bg-[#503AF2]", "bg-[#00B894]",
    "bg-[#FF6B6B]", "bg-[#FDCB6E]", "bg-[#6C5CE7]",
  ];

  if (!blogData) return null;

  const tags = blogData.tags || [];

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      <div className="relative isolate w-full h-125 overflow-hidden bg-[#080C14] rounded-2xl">
        <div className="absolute inset-0 z-0">
          {blogData?.image && (
            <img
              src={blogData.image}
              alt={blogData.title || 'Blog banner'}
              className="h-full w-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-black/60">
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/10 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 max-w-275 mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 h-full flex flex-col items-center justify-start text-center">
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

          <h1 className="text-white font-bold text-[40px] sm:text-[54px] lg:text-[100px] leading-[1.05] mb-4 max-w-380">
            {blogData?.title || 'Blog Post'}
          </h1>

          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-white text-[12px] sm:text-[14px] font-semibold">
            <div className="flex items-center gap-2.5">
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <img src="https://placehold.co/20x20" alt="Author" className="w-5 h-5 object-cover" />
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

const BlogContentSection = ({ blogData, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  if (!blogData) return null;

  const content = blogData.full_content || blogData.fullContent || '';

  return (
    <section id={sectionId} className={`${bgColor || 'bg-white'} ${paddingY || 'py-12 lg:py-16'} ${paddingX || 'px-4'} ${sectionClassName || ''}`}>
      <div className="relative z-10 max-w-275 mx-auto">
        {blogData?.image && (
          <div className="-mt-16 sm:-mt-20 lg:-mt-24">
            <img
              src={blogData.image}
              alt={blogData?.title || "Blog main image"}
              className="w-full h-auto max-h-96 sm:max-h-125 object-cover object-center rounded-[28px] shadow-2xl"
            />
          </div>
        )}
      </div>

      <div className="max-w-275 mx-auto mt-12 sm:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-25">
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

export default function BlogDetailsContent({
  sectionConfigs,
  storageUrl,
  blogData: propBlogData,
  blogsData = [],
  slug,
  ...pageData
}) {
  // Get blog data from props or find it from blogsData
  const blogData = propBlogData || blogsData?.find(item => item.slug === slug);

  // Show not found if no blog data
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

  // Parse tags if they're a string
  let parsedBlogData = { ...blogData };
  if (blogData?.tags && typeof blogData.tags === 'string') {
    try {
      parsedBlogData.tags = JSON.parse(blogData.tags);
    } catch (error) {
      console.error('Error parsing blog tags:', error);
      parsedBlogData.tags = [];
    }
  }

  // Filter enabled sections
  const allSections = (sectionConfigs || [])
    .filter(section => section.is_enabled === 1);

  // Separate fixed sections from dynamic sections
  const fixedSections = allSections.filter(section => section.is_fixed_section === 1);
  const dynamicSections = allSections.filter(section => section.is_fixed_section !== 1)
    .sort((a, b) => a.display_order - b.display_order);

  // Find banner section (could be in dynamic sections)
  const bannerSection = dynamicSections.find(s => s.component === 'BannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'BannerSection');

  // MERGE: Override banner data with blog data for dynamic title
  let mergedPageData = { ...pageData };

  // If we have bannerData and blogData, update the banner title dynamically
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

  // Flatten the inherited `pageData` prop from DynamicPage so section renderers
  // can read keys like `relatedBlogsData`, `bannerData`, and `upcomingEventsData`.
  const inheritedPageData = pageData.pageData || {};

  // Merge pageData with our custom data
  const updatedPageData = {
    ...inheritedPageData,
    ...mergedPageData,
    blogData: parsedBlogData,
    blogsData: blogsData,
    relatedBlogsData: blogsData
      .filter(item => item?.slug && item.slug !== parsedBlogData.slug)
      .filter(item => {
        if (!Array.isArray(parsedBlogData.tags) || parsedBlogData.tags.length === 0) {
          return true;
        }

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

        return itemTags.some(tag => parsedBlogData.tags.includes(tag));
      }),
  };

  return (
    <>
      {/* Banner - Use DynamicSectionRenderer if available, otherwise fallback to BannerSection component */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={updatedPageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* Fixed Sections - These are special components that need custom rendering */}
      {fixedSections.map((section) => {
        const { component, custom_props = {} } = section;

        // Parse custom_props if it's a string
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
              {...parsedCustomProps}
            />
          );
        }

        // If there's a BannerSection in fixed sections (unlikely but handle it)
        if (component === 'BannerSection') {
          return (
            <BannerSection
              key={section.id}
              blogData={parsedBlogData}
              {...parsedCustomProps}
            />
          );
        }

        return null;
      })}

      {/* Other Dynamic Sections (non-fixed, non-banner) */}
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