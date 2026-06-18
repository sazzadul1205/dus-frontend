// dus-frontend/src/Sections/HeroFigureSection/HeroFigureSection.jsx

// React
import { Link } from 'react-router-dom';

// Components
import ArrowIcon from '../../Shared/ArrowIcon';

// Utility
import { createSanitizedHTML } from '../../utils/sanitize';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const HeroFigureSection = ({
  data,
  sectionId = 'hero-figure',
  layout = 'text-left',   // 'text-left' or 'text-right'
  bgColor = 'bg-white',   // Customizable background color
  bgImage = null,         // Customizable background image
  bgOverlay = null,       // Customizable overlay for background image
  paddingY = 'py-10 sm:py-15 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  sectionClassName = '',
}) => {
  // Early return if no data
  if (!hasValue(data)) {
    console.warn('HeroFigureSection: No data provided');
    return null;
  }

  // Safe destructuring with defaults
  const {
    section = {},
    content = {},
    image = {},
    btn = {}
  } = data;

  // Check if there's any content to display
  const hasTitle = hasValue(section?.title);
  const hasContent = hasValue(content?.html);
  const hasButton = hasValue(btn?.text) && hasValue(btn?.link);
  const hasImage = hasValue(image?.src);

  const hasAnyContent = hasTitle || hasContent || hasButton || hasImage;

  if (!hasAnyContent) {
    return null;
  }

  // Get image URL with fallback
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/800x600/009BE2/FFFFFF?text=Hero+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  // Get background image URL with fallback
  const getBgImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  // Determine image position based on layout
  const isImageLeft = layout === 'text-right';

  // Render text content
  const renderTextContent = () => (
    <div className='w-full lg:w-1/2 flex flex-col justify-between relative z-10'>
      {/* Only render section title if it exists */}
      {hasTitle && (
        <h1 className='bricolage-grotesque font-700 text-[32px] sm:text-[36px] lg:text-[40px] text-black pb-2'>
          {section.title}
        </h1>
      )}

      {/* Render HTML content with 730px max height and ellipsis */}
      {hasContent && (
        <div className="relative">
          <div
            className='bricolage-grotesque text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug overflow-hidden'
            style={{
              maxHeight: '730px',
              display: '-webkit-box',
              WebkitLineClamp: 'unset',
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={createSanitizedHTML(content.html)}
          />
          {/* Ellipsis indicator - Only show if content overflows */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      )}

      {/* Render button if btn exists */}
      {hasButton && (
        <div className='pt-8'>
          <Link
            to={btn.link}
            className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
          >
            <span>{btn.text}</span>
            <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </Link>
        </div>
      )}
    </div>
  );

  // Render image
  const renderImage = () => (
    hasImage && (
      <div className='w-full lg:w-1/2 flex mt-8 lg:mt-0 relative z-10'>
        <img
          src={getImageUrl(image.src)}
          alt={image.alt || 'Section image'}
          className={image.className || 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'}
        />
      </div>
    )
  );

  // Generate background style
  const getBackgroundStyle = () => {
    const bgImageUrl = getBgImageUrl(bgImage);
    if (hasValue(bgImageUrl)) {
      return {
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  return (
    <section
      id={sectionId}
      className={`relative ${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}
      style={getBackgroundStyle()}
    >
      {/* Background overlay if bgImage is provided */}
      {hasValue(bgImage) && hasValue(bgOverlay) && (
        <div className={`absolute inset-0 ${bgOverlay}`}></div>
      )}

      <div className={`flex flex-col lg:flex-row justify-between items-stretch gap-8 lg:gap-15 relative z-10`}>
        {isImageLeft ? (
          <>
            {renderImage()}
            {renderTextContent()}
          </>
        ) : (
          <>
            {renderTextContent()}
            {renderImage()}
          </>
        )}
      </div>
    </section>
  );
};

export default HeroFigureSection;