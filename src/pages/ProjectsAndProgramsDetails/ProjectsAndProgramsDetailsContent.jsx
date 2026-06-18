// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetailsContent.jsx

// Dynamic Section Renderer
import DynamicSectionRenderer from '../../Shared/DynamicSectionRenderer';

// Program Content Section Component
const ProgramContentSection = ({ programData, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  const data = programData || window.programData;
  if (!data) return null;

  const content = data.fullContentHtml || data.fullContent || data?.content;

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
        {data?.title}
      </h1>

      {data?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={data.image}
            alt={data?.title || 'Program image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

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
    </section>
  );
};

export default function ProjectsAndProgramsDetailsContent({
  sectionConfigs,
  storageUrl,
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
        if (section.component === 'ProgramContentSection') {
          return (
            <ProgramContentSection
              key={section.id}
              programData={pageData.programContentData}
              slug={slug}
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