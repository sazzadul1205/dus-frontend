// dus-frontend/src/pages/DynamicPage.jsx

import { Helmet } from 'react-helmet-async';

// layout
import PublicLayout from "../../layouts/PublicLayout";

// Components
import DynamicSectionRenderer from '../Shared/DynamicSectionRenderer';

const DynamicPage = ({
  topbarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  pageTitle,
  ...pageData
}) => {
  // Get enabled sections sorted by order
  const sectionsToRender = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  return (
    <PublicLayout
      topBarData={topbarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Helmet>
        <title>{pageTitle || "DUS - Dwip Unnayan Society | Empowering Communities"}</title>
      </Helmet>

      {sectionsToRender.length === 0 && (
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">
          No page sections were found for this page.
        </div>
      )}

      {sectionsToRender.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </PublicLayout>
  );
};

export default DynamicPage;