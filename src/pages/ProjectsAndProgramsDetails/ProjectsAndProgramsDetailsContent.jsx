// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetailsContent.jsx

// Dynamic Section Renderer
import DynamicSectionRenderer from '../../Shared/DynamicSectionRenderer';

// Utility
import { createSanitizedHTML } from '../../utils/sanitize';
import ImageWithFallback from '../../Shared/ImageWithFallback';

const ProgramContentSection = ({ programData, bgColor, paddingY, paddingX, sectionClassName, sectionId, storageUrl = '' }) => {
  if (!programData) return null;

  const content = programData.full_content_html ||
    programData.full_content ||
    programData.content ||
    '';

  const title = programData.title || '';
  const image = programData.image || '';

  if (!title && !content) return null;

  const finalBgColor = bgColor || 'bg-white';
  const finalPaddingY = paddingY || 'py-10 sm:py-15 md:py-20 lg:py-25';
  const finalPaddingX = paddingX || 'px-5 sm:px-10 md:px-20 lg:px-50';

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  return (
    <section id={sectionId} className={`${finalBgColor} ${finalPaddingY} ${finalPaddingX} ${sectionClassName || ''}`}>
      {title && (
        <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
          {title}
        </h1>
      )}

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

export default function ProjectsAndProgramsDetailsContent({
  sectionConfigs,
  storageUrl,
  programData: propProgramData,
  programsData = [],
  pageData = {},
  slug,
}) {
  const programData = propProgramData || programsData?.find(item => item.slug === slug);

  const allSections = (sectionConfigs || [])
    .filter(section => section.is_enabled === 1);

  const fixedSections = allSections.filter(section => section.is_fixed_section === 1);
  const dynamicSections = allSections.filter(section => section.is_fixed_section !== 1)
    .sort((a, b) => a.display_order - b.display_order);

  const bannerSection = dynamicSections.find(s => s.component === 'PageBannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'PageBannerSection');

  let mergedPageData = { ...pageData };

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

  return (
    <>
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={updatedPageData}
          globalProps={{ storageUrl }}
        />
      )}

      {fixedSections.map((section) => {
        if (section.component === 'ProgramContentSection') {
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