// dus-frontend/src/Sections/BlogSection/BlogSection.jsx

// React Router
import { Link } from 'react-router-dom';

// Components
import ArrowIcon from '../../Shared/ArrowIcon';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const BlogSection = ({
  data,
  sectionTitle,
  isRelated = false,
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-15 md:py-20 lg:py-37.5',
  paddingX = 'px-5 sm:px-8 md:px-12 lg:px-50',
  sectionClassName = '',
  sectionId = 'blog-section',
  limit = null, // Number of blogs to show, null = show all
  showFeatured = false, // Only show featured blogs
}) => {
  // Handle both formats:
  // 1. { section: {...}, blogs: [...] } - from custom_section_data
  // 2. [...] - direct array from blogs.json
  let section = {};
  let blogList = [];

  if (Array.isArray(data)) {
    // Direct array format from blogs.json
    blogList = data;
  } else if (data && typeof data === 'object') {
    // Object format with section and blogs
    section = data.section || {};
    blogList = data.blogs || data.blogPosts || [];

    // If no blogs in the object, try to use data directly
    if (blogList.length === 0 && Array.isArray(data.blogs)) {
      blogList = data.blogs;
    }
  }

  // If blogList is empty, try to use data directly if it's an array
  if (blogList.length === 0 && Array.isArray(data)) {
    blogList = data;
  }

  // Allow section title to come from config custom props
  if (sectionTitle && !section.title) {
    section.title = sectionTitle;
  }

  // Related blogs should always be rendered as cards only.
  const relatedMode = isRelated === true || isRelated === 'true' || isRelated === 1;
  if (relatedMode) {
    section = {
      ...section,
      title: section.title || sectionTitle || 'Related Blogs',
    };
  }

  const hasTitle = hasValue(section.title);
  const hasDescription = hasValue(section.description);
  const hasButton = hasValue(section.button?.text);

  const showHeader = hasTitle || hasDescription || hasButton;
  const hasBlogs = hasValue(blogList);

  if (!showHeader && !hasBlogs) {
    return null;
  }

  // Filter blogs based on props
  let displayBlogs = [...blogList];

  if (relatedMode) {
    displayBlogs = displayBlogs.filter(blog => blog && blog.slug);
  }

  // Filter featured blogs if requested
  if (showFeatured) {
    displayBlogs = displayBlogs.filter(blog => blog.is_featured === 1);
  }

  // If no featured blogs, show all
  if (displayBlogs.length === 0 && showFeatured) {
    displayBlogs = [...blogList];
  }

  // Apply limit if set
  if (limit !== null && limit > 0) {
    displayBlogs = displayBlogs.slice(0, limit);
  }

  const relatedCardBlogs = relatedMode ? displayBlogs : [];

  // Get image URL with fallback
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/600x400/009BE2/FFFFFF?text=Blog+Post';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  // Get first blog as main blog (if showFeatured is true, use first featured)
  const mainBlogData = displayBlogs.length > 0 ? displayBlogs[0] : null;
  const remainingBlogs = displayBlogs.slice(1);

  // If no blogs to display
  if (!mainBlogData && remainingBlogs.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* Header - Only show if there's header content */}
      {showHeader && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 sm:pb-10 lg:pb-15 gap-5">
          {(hasTitle || hasDescription) && (
            <div className="max-w-250">
              {hasTitle && (
                <h1 className="bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-[#080C14] pb-3 sm:pb-4 lg:pb-5">
                  {section.title}
                </h1>
              )}
              {hasDescription && (
                <p className="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151]">
                  {section.description}
                </p>
              )}
            </div>
          )}
          {hasButton && (
            <Link
              to={section.button?.link || '/blogs'}
              className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-4 lg:py-5 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              {section.button.text}
              <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </Link>
          )}
        </div>
      )}

      {/* Main Blog */}
      {!relatedMode && mainBlogData && hasValue(mainBlogData.title) && (
        <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12.5 shadow-lg p-5 sm:p-6 md:p-7.5 rounded-2xl bg-white'>
          {/* Main Blog Image */}
          {hasValue(mainBlogData.image) && (
            <img
              src={getImageUrl(mainBlogData.image)}
              alt={mainBlogData.title || "Main blog image"}
              className="w-full lg:w-187.5 h-auto lg:h-112.5 object-cover object-center rounded-2xl"
            />
          )}

          {/* Main Blog Content */}
          <div className="flex-1 w-full">
            {/* Date */}
            {hasValue(mainBlogData.date) && (
              <label className='font-normal text-[14px] sm:text-[16px] text-[#009BE2] pb-2 block'>
                {mainBlogData.date}
              </label>
            )}

            {/* Heading */}
            {hasValue(mainBlogData.title) && (
              <h2 className='font-semibold text-[24px] sm:text-[30px] lg:text-[36px] leading-tight sm:leading-snug pb-3 sm:pb-5'>
                {mainBlogData.title}
              </h2>
            )}

            {/* Description/Excerpt */}
            {hasValue(mainBlogData.excerpt) && (
              <p className='font-normal text-[16px] sm:text-[18px] lg:text-[20px] line-clamp-5 text-gray-700'>
                {mainBlogData.excerpt}
              </p>
            )}

            {/* Button */}
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

      {/* Blogs Grid - Only show if there are remaining blogs */}
      {!relatedMode && remainingBlogs.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7.5 ${mainBlogData ? 'pt-10 sm:pt-12 md:pt-15' : ''}`}>
          {remainingBlogs.map((post) => (
            <div key={post.id} className='shadow-2xl p-5 sm:p-6 md:p-7.5 rounded-2xl hover:shadow-3xl transition-shadow duration-300 bg-white'>
              {/* Post Image */}
              {hasValue(post.image) && (
                <img
                  src={getImageUrl(post.image)}
                  alt={post.title || "Blog post image"}
                  className="w-full h-48 sm:h-56 md:h-62.5 object-cover object-center rounded-2xl mb-4 sm:mb-5"
                />
              )}

              {/* Post Date */}
              {hasValue(post.date) && (
                <label className='font-normal text-[14px] sm:text-[16px] text-[#009BE2] pb-2 block'>
                  {post.date}
                </label>
              )}

              {/* Post Title */}
              {hasValue(post.title) && (
                <h3 className='font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-snug pb-2 sm:pb-3'>
                  {post.title}
                </h3>
              )}

              {/* Post Description/Excerpt */}
              {hasValue(post.excerpt) && (
                <p className='font-normal text-[14px] sm:text-[15px] lg:text-[16px] line-clamp-3 sm:line-clamp-4 lg:line-clamp-5 text-gray-600'>
                  {post.excerpt}
                </p>
              )}

              {/* Post Button */}
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

      {/* Related Blogs Grid - cards only */}
      {relatedMode && relatedCardBlogs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7.5">
          {relatedCardBlogs.map((post) => (
            <div key={post.id} className='shadow-2xl p-5 sm:p-6 md:p-7.5 rounded-2xl hover:shadow-3xl transition-shadow duration-300 bg-white'>
              {hasValue(post.image) && (
                <img
                  src={getImageUrl(post.image)}
                  alt={post.title || "Blog post image"}
                  className="w-full h-48 sm:h-56 md:h-62.5 object-cover object-center rounded-2xl mb-4 sm:mb-5"
                />
              )}

              {hasValue(post.tags) && Array.isArray(post.tags) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span key={`${post.id}-tag-${index}`} className="text-white text-[12px] font-semibold px-2 py-1 rounded-md bg-[#3866FF]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {hasValue(post.title) && (
                <h3 className='font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-snug pb-2 sm:pb-3'>
                  {post.title}
                </h3>
              )}

              {hasValue(post.excerpt) && (
                <p className='font-normal text-[14px] sm:text-[15px] lg:text-[16px] line-clamp-3 sm:line-clamp-4 lg:line-clamp-5 text-gray-600'>
                  {post.excerpt}
                </p>
              )}

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
