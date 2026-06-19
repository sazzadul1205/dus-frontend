// dus-frontend/src/Sections/CardsSection/CardsSection.jsx

// React
import { Link } from 'react-router-dom';

// Components
import ArrowIcon from '../../Shared/ArrowIcon';
import ImageWithFallback from '../../Shared/ImageWithFallback';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const CardsSection = ({
  data,
  bgColor = 'bg-white',
  paddingY = 'py-8 sm:py-12 md:py-20 lg:py-37.5',
  paddingX = 'px-4 sm:px-8 md:px-16 lg:px-50',
  gap = 'gap-6 sm:gap-8 md:gap-12 lg:gap-25',
  sectionClassName = '',
  sectionId = 'cards',
  storageUrl = '',
}) => {
  if (!hasValue(data)) return null;

  const { cards = [] } = data;

  if (!hasValue(cards)) return null;

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  return (
    <section
      id={sectionId}
      className={`flex flex-col lg:flex-row justify-between ${bgColor} ${gap} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {cards.map((card) => (
        <div key={card.id} className='w-full lg:w-1/2 flex'>
          <div className={`${card.bgColor || 'bg-white'} w-full rounded-xl sm:rounded-2xl px-4 sm:px-8 md:px-12 lg:px-17 py-6 sm:py-8 md:py-10 lg:py-12.5 flex flex-col`}>
            {hasValue(card.image?.src) && (
              <div className='flex items-center justify-center min-h-50 sm:min-h-62.5 md:min-h-75 lg:min-h-87.5 xl:min-h-110'>
                <ImageWithFallback
                  src={getImageSrc(card.image.src)}
                  alt={card.image.alt || card.title || 'Card image'}
                  fallbackType="card"
                  className={`${card.image.className || ''} max-w-full max-h-full object-contain w-auto h-auto`}
                />
              </div>
            )}

            {(hasValue(card.title) || hasValue(card.buttonText)) && (
              <div className={`${card.cardBgColor || 'bg-white'} w-full rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12.5 mt-4 sm:mt-5 md:mt-6 lg:mt-7.5 flex flex-col justify-between min-h-50 sm:min-h-62.5 md:min-h-70 lg:min-h-62.5`}>
                {hasValue(card.title) && (
                  <h1 className='font-700 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-tight'>
                    {card.title}
                  </h1>
                )}

                {hasValue(card.buttonText) && hasValue(card.buttonLink) && (
                  <div className='pt-3 sm:pt-4 md:pt-5 lg:pt-6'>
                    <Link
                      to={card.buttonLink}
                      className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3.5 xl:p-4 font-600 text-xs sm:text-sm md:text-base lg:text-[16px] inline-flex items-center gap-2 sm:gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
                    >
                      <span>{card.buttonText}</span>
                      <ArrowIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default CardsSection;