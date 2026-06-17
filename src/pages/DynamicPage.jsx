// dus-frontend/src/pages/DynamicPage.jsx

import { Helmet } from 'react-helmet-async';

// layout
import PublicLayout from "../Layout/PublicLayout";

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
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty state illustration */}
            <div className="mb-8">
              <svg
                className="mx-auto h-32 w-32 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m4 0h.01M7 12h6m4 0h.01"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              No Content Available
            </h2>

            {/* Description */}
            <p className="mt-3 text-base text-gray-500">
              This page is currently being built. Please check back later for updates.
            </p>

            {/* Optional: Show page name for debugging */}
            {import.meta.env.DEV && pageTitle && (
              <p className="mt-2 text-sm text-gray-400">
                Page: <span className="font-mono">{pageTitle}</span>
              </p>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Page
              </button>

              <a
                href="/"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Homepage
              </a>
            </div>

            {/* Show section config for debugging in dev */}
            {import.meta.env.DEV && sectionConfig && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-xs font-mono text-gray-500">
                  <span className="font-semibold text-gray-700">Debug Info:</span>
                  <br />
                  Sections: {sectionConfig?.sections?.length || 0}
                  {sectionConfig?.sections?.length > 0 && (
                    <span className="text-yellow-600">
                      {' '}
                      ({sectionConfig.sections.filter(s => s.enabled).length} enabled)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
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