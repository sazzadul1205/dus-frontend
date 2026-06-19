// dus-frontend/src/Sections/BlogSection/BlogSection.jsx

/**
 * ============================================
 * BLOG SECTION - Blog Listing Component
 * ============================================
 * 
 * PURPOSE:
 * - Displays blog posts in a listing format
 * - Shows a featured/main blog post
 * - Shows remaining posts in a grid
 * - Can be used for "Related Blogs" with isRelated mode
 * 
 * DATA STRUCTURE:
 * {
 *   section: { title, description, button: { text, link } },
 *   blogs: [ { id, title, excerpt, image, date, slug, tags, is_featured } ]
 * }
 * - OR -
 * [ { id, title, excerpt, image, date, slug, tags, is_featured }, ... ]
 * 
 * MODES:
 * 1. Normal Mode - Shows section header + main blog + grid
 * 2. Related Mode (isRelated=true) - Shows only grid with tags
 * 
 * FEATURES:
 * - Featured blog highlighting
 * - Date display
 * - Tag display (in related mode)
 * - "Read More" links
 * - Responsive grid (1, 2, or 3 columns)
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
 * BlogSection Component
 * 
 * @param {Object} props
 * @param {Object|Array} props.data - Blog data (object with section/blogs OR array)
 * @param {string} props.sectionTitle - Override section title
 * @param {boolean|string|number} props.isRelated - Enable related mode (default: false)
 * @param {string} props.bgColor - Background color (default: 'bg-white')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'blog-section')
 * @param {number|null} props.limit - Max number of blogs to show
 * @param {boolean} props.showFeatured - Show only featured blogs
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered blog section
 */
const BlogSection = ({
  data,
  sectionTitle,
  isRelated = false,
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-15 md:py-20 lg:py-37.5',
  paddingX = 'px-5 sm:px-8 md:px-12 lg:px-50',
  sectionClassName = '',
  sectionId = 'blog-section',
  limit = null,
  showFeatured = false,
  storageUrl = '',
}) => {
  // ============================================
  // NORMALIZE DATA - Handle both formats
  // ============================================
  let section = {};
  let blogList = [];

  if (Array.isArray(data)) {
    blogList = data;
  } else if (data && typeof data === 'object') {
    section = data.section || {};
    blogList = data.blogs || data.blogPosts || [];
    if (blogList.length === 0 && Array.isArray(data.blogs)) {
      blogList = data.blogs;
    }
  }

  if (blogList.length === 0 && Array.isArray(data)) {
    blogList = data;
  }

  // ============================================
  // PROCESS SECTION DATA
  // ============================================
  let finalSection = { ...section };

  // Override title if sectionTitle is provided
  if (sectionTitle && !finalSection.title) {
    finalSection.title = sectionTitle;
  }

  // Related mode - set default title if not provided
  const relatedMode = isRelated === true || isRelated === 'true' || isRelated === 1;
  if (relatedMode) {
    finalSection = {
      ...finalSection,
      title: finalSection.title || sectionTitle || 'Related Blogs',
    };
  }

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasTitle = hasValue(finalSection.title);
  const hasDescription = hasValue(finalSection.description);
  const hasButton = hasValue(finalSection.button?.text);

  const showHeader = hasTitle || hasDescription || hasButton;
  const hasBlogs = hasValue(blogList);

  if (!showHeader && !hasBlogs) {
    return null;
  }

  // ============================================
  // FILTER BLOGS
  // ============================================
  let displayBlogs = [...blogList];

  // Related mode - only show blogs with slugs
  if (relatedMode) {
    displayBlogs = displayBlogs.filter(blog => blog && blog.slug);
  }

  // Show only featured blogs
  if (showFeatured) {
    displayBlogs = displayBlogs.filter(blog => blog.is_featured === 1);
  }

  // If no featured blogs, show all
  if (displayBlogs.length === 0 && showFeatured) {
    displayBlogs = [...blogList];
  }

  // Apply limit
  if (limit !== null && limit > 0) {
    displayBlogs = displayBlogs.slice(0, limit);
  }

  // ============================================
  // SPLIT INTO MAIN + REMAINING
  // ============================================
  const relatedCardBlogs = relatedMode ? displayBlogs : [];
  const mainBlogData = displayBlogs.length > 0 ? displayBlogs[0] : null;
  const remainingBlogs = displayBlogs.slice(1);

  // If no blogs to display, return null
  if (!mainBlogData && remainingBlogs.length === 0) {
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
                  {finalSection.title}
                </h1>
              )}
              {hasDescription && (
                <p className="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151]">
                  {finalSection.description}
                </p>
              )}
            </div>
          )}
          {/* "View All" Button */}
          {hasButton && (
            <Link
              to={finalSection.button?.link || '/blogs'}
              className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-4 lg:py-5 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              {finalSection.button.text}
              <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </Link>
          )}
        </div>
      )}

      {/* ============================================
          MAIN BLOG - Large featured post
          ============================================ */}
      {!relatedMode && mainBlogData && hasValue(mainBlogData.title) && (
        <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12.5 shadow-lg p-5 sm:p-6 md:p-7.5 rounded-2xl bg-white'>
          {/* Main Blog Image */}
          {hasValue(mainBlogData.image) && (
            <ImageWithFallback
              src={getImageSrc(mainBlogData.image)}
              alt={mainBlogData.title || "Main blog image"}
              fallbackType="blog"
              className="w-full lg:w-187.5 h-auto lg:h-112.5 object-cover object-center rounded-2xl"
            />
          )}

          {/* Main Blog Content */}
          <div className="flex-1 w-full">
            {hasValue(mainBlogData.date) && (
              <label className='font-normal text-[14px] sm:text-[16px] text-[#009BE2] pb-2 block'>
                {mainBlogData.date}
              </label>
            )}

            {hasValue(mainBlogData.title) && (
              <h2 className='font-semibold text-[24px] sm:text-[30px] lg:text-[36px] leading-tight sm:leading-snug pb-3 sm:pb-5'>
                {mainBlogData.title}
              </h2>
            )}

            {hasValue(mainBlogData.excerpt) && (
              <p className='font-normal text-[16px] sm:text-[18px] lg:text-[20px] line-clamp-5 text-gray-700'>
                {mainBlogData.excerpt}
              </p>
            )}

            {hasValue(mainBlogData.slug) && (
              <Link
                to={`/blogs/${mainBlogData.slug}`}
                className="mt-4 sm:mt-6 bricolage-grotesque flex items-center gap-2 font-500 lg:font-600 text-[14px] sm:text-[16px] lg:text-[20px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300 w-fit"
              >
                Read more
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ============================================
          BLOG GRID - Remaining posts
          ============================================ */}
      {!relatedMode && remainingBlogs.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7.5 ${mainBlogData ? 'pt-10 sm:pt-12 md:pt-15' : ''}`}>
          {remainingBlogs.map((post) => (
            <div key={post.id} className='shadow-2xl p-5 sm:p-6 md:p-7.5 rounded-2xl hover:shadow-3xl transition-shadow duration-300 bg-white'>
              {/* Blog Image */}
              {hasValue(post.image) && (
                <ImageWithFallback
                  src={getImageSrc(post.image)}
                  alt={post.title || "Blog post image"}
                  fallbackType="blog"
                  className="w-full h-48 sm:h-56 md:h-62.5 object-cover object-center rounded-2xl mb-4 sm:mb-5"
                />
              )}

              {/* Blog Date */}
              {hasValue(post.date) && (
                <label className='font-normal text-[14px] sm:text-[16px] text-[#009BE2] pb-2 block'>
                  {post.date}
                </label>
              )}

              {/* Blog Title */}
              {hasValue(post.title) && (
                <h3 className='font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-snug pb-2 sm:pb-3'>
                  {post.title}
                </h3>
              )}

              {/* Blog Excerpt */}
              {hasValue(post.excerpt) && (
                <p className='font-normal text-[14px] sm:text-[15px] lg:text-[16px] line-clamp-3 sm:line-clamp-4 lg:line-clamp-5 text-gray-600'>
                  {post.excerpt}
                </p>
              )}

              {/* Read More Link */}
              {hasValue(post.slug) && (
                <Link
                  to={`/blogs/${post.slug}`}
                  className="mt-3 sm:mt-4 bricolage-grotesque flex items-center gap-2 font-500 text-[14px] sm:text-[15px] lg:text-[16px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300 w-fit"
                >
                  Read more
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ============================================
          RELATED BLOGS GRID - Tag-based related posts
          ============================================ */}
      {relatedMode && relatedCardBlogs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7.5">
          {relatedCardBlogs.map((post) => (
            <div key={post.id} className='shadow-2xl p-5 sm:p-6 md:p-7.5 rounded-2xl hover:shadow-3xl transition-shadow duration-300 bg-white'>
              {/* Blog Image */}
              {hasValue(post.image) && (
                <ImageWithFallback
                  src={getImageSrc(post.image)}
                  alt={post.title || "Blog post image"}
                  fallbackType="blog"
                  className="w-full h-48 sm:h-56 md:h-62.5 object-cover object-center rounded-2xl mb-4 sm:mb-5"
                />
              )}

              {/* Tags - Color-coded chips */}
              {hasValue(post.tags) && Array.isArray(post.tags) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span key={`${post.id}-tag-${index}`} className="text-white text-[12px] font-semibold px-2 py-1 rounded-md bg-[#3866FF]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Blog Title */}
              {hasValue(post.title) && (
                <h3 className='font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-snug pb-2 sm:pb-3'>
                  {post.title}
                </h3>
              )}

              {/* Blog Excerpt */}
              {hasValue(post.excerpt) && (
                <p className='font-normal text-[14px] sm:text-[15px] lg:text-[16px] line-clamp-3 sm:line-clamp-4 lg:line-clamp-5 text-gray-600'>
                  {post.excerpt}
                </p>
              )}

              {/* Read More Link */}
              {hasValue(post.slug) && (
                <Link
                  to={`/blogs/${post.slug}`}
                  className="mt-3 sm:mt-4 bricolage-grotesque flex items-center gap-2 font-500 text-[14px] sm:text-[15px] lg:text-[16px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300 w-fit"
                >
                  Read more
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;