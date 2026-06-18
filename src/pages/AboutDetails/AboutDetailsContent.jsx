// dus-frontend/src/pages/AboutDetails/AboutDetailsContent.jsx

// React
import { Link } from 'react-router-dom';

// Dynamic Section Renderer
import DynamicSectionRenderer from '../../Shared/DynamicSectionRenderer';

// Special ContentSection component
const ContentSection = ({ subPageData, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  const data = subPageData || {};
  const { title, content, image, btn } = data;

  if (!title && !content) return null;

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      {title && (
        <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
          {title}
        </h1>
      )}
      {image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={image}
            alt={title || 'About image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}
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
          dangerouslySetInnerHTML={renderHTML(content)}
        />
      )}
      {btn && btn.text && btn.link && (
        <div className="mt-8">
          <Link to={btn.link} className="inline-block bg-[#009BE2] text-white font-600 px-8 py-4 rounded-lg hover:bg-[#007BB5] transition-colors">
            {btn.text}
          </Link>
        </div>
      )}
    </section>
  );
};

export default function AboutDetailsContent({
  sectionConfigs,
  storageUrl,
  // eslint-disable-next-line no-unused-vars
  slug,
  ...pageData
}) {
  const allSections = (sectionConfigs || [])
    .filter(section => section.is_enabled === 1);

  const fixedSections = allSections.filter(section => section.is_fixed_section === 1);
  const dynamicSections = allSections.filter(section => section.is_fixed_section !== 1)
    .sort((a, b) => a.display_order - b.display_order);

  const bannerSection = dynamicSections.find(s => s.component === 'PageBannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'PageBannerSection');

  return (
    <>
      {/* Banner */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* Fixed Sections */}
      {fixedSections.map((section) => {
        if (section.component === 'ContentSection') {
          return (
            <ContentSection
              key={section.id}
              subPageData={pageData.contentSectionData}
              {...section.custom_props}
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
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </>
  );
}