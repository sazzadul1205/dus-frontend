// dus-frontend/src/Sections/BannerSection/PageBannerSection.jsx

import ImageWithFallback from '../../Shared/ImageWithFallback';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const PageBannerSection = ({
  data,
  bgColor = '',
  height = 'h-125 md:h-147.25',
  paddingY = '',
  paddingX = '',
  sectionClassName = '',
  sectionId = 'page-banner',
  storageUrl = '',
}) => {
  if (!hasValue(data)) return null;

  const {
    background = {},
    overlay = {},
    content = {},
  } = data;

  const title = content.title || {};
  const description = content.description || {};

  const hasTitle = hasValue(title.text);
  const hasDescription = hasValue(description.text);
  const hasBackground = hasValue(background.src);
  const hasOverlays = hasValue(overlay.darkOverlay) || hasValue(overlay.gradient);

  const hasAnyContent = hasTitle || hasDescription || hasBackground || hasOverlays;

  if (!hasAnyContent) return null;

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  return (
    <section
      id={sectionId}
      className={`relative w-full ${height} overflow-hidden ${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}
    >
      {hasValue(background.src) && (
        <ImageWithFallback
          src={getImageSrc(background.src)}
          alt={background.alt || 'Banner background'}
          fallbackType="banner"
          className="w-full h-full object-cover object-center md:object-cover"
        />
      )}

      {hasValue(overlay.darkOverlay) && (
        <div className={`absolute inset-0 ${overlay.darkOverlay}`}></div>
      )}

      {hasValue(overlay.gradient) && (
        <div className={`absolute inset-0 ${overlay.gradient}`}></div>
      )}

      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {(hasTitle || hasDescription) && (
        <div className="absolute left-0 md:left-10 inset-0 flex items-center p-5 md:p-12.5">
          <div className="w-full px-4 md:px-20 text-white space-y-3 md:space-y-5">

            {hasTitle && (
              <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75 ${title.className || ''}`}>
                {title.text}
              </h1>
            )}

            {hasDescription && (
              <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none ${description.className || ''}`}>
                {description.text}
              </p>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default PageBannerSection;