// dus-frontend/src/pages/DynamicPage.jsx

// React
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Layout
import PublicLayout from "../Layout/PublicLayout";

// Hooks
import useAxiosPublic from '../hooks/useAxiosPublic';

// Dynamic Section Renderer
import DynamicSectionRenderer from '../Shared/DynamicSectionRenderer';

export default function DynamicPage({
  pageInfo,
  children,
  customTitle,
  ...props
}) {
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // Auto-detect page slug
  const getPageSlug = () => {
    const path = location.pathname;
    const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
    if (!cleanPath) return 'home';
    return cleanPath.split('/')[0] || 'home';
  };

  const pageSlug = getPageSlug();

  // Fetch section configs
  const {
    data: sectionConfigsData,
    isLoading: configsLoading,
    error: configsError
  } = useQuery({
    queryKey: ['sectionConfigs', pageSlug],
    queryFn: async () => {
      const response = await axiosPublic.get(`/public/data/section_configs.json?page_slug=${pageSlug}`);
      return response.data;
    },
    enabled: !!pageSlug
  });

  // Fetch custom section data
  const {
    data: customSectionData,
    isLoading: customLoading,
    error: customError
  } = useQuery({
    queryKey: ['customSectionData', pageSlug],
    queryFn: async () => {
      const response = await axiosPublic.get('/public/data/custom_section_data.json');
      return response.data;
    },
    enabled: !!pageSlug
  });

  // DYNAMICALLY determine which shared data types are needed
  const neededSharedDataTypes = useMemo(() => {
    if (!sectionConfigsData?.data) {
      return new Set();
    }

    const types = new Set();

    sectionConfigsData.data.forEach(config => {
      if (config.data_table === 'shared_data') {
        let type = config.data_key;
        if (type && type.endsWith('Data')) {
          type = type.slice(0, -4);
        }
        if (type) {
          type = type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          types.add(type);
        }
      }
    });

    // Always include layout data
    types.add('topbar');
    types.add('navbar');
    types.add('footer');

    return types;
  }, [sectionConfigsData]);

  // Fetch ONLY the needed shared data
  const {
    data: sharedData,
    isLoading: sharedLoading,
    error: sharedError
  } = useQuery({
    queryKey: ['sharedData', Array.from(neededSharedDataTypes).sort().join(',')],
    queryFn: async () => {
      const response = await axiosPublic.get('/public/data/shared_data.json');
      return response.data;
    },
    enabled: !!sectionConfigsData && neededSharedDataTypes.size > 0,
  });

  // Process shared data
  const parsedSharedData = useMemo(() => {
    if (!sharedData?.data) {
      return {};
    }

    const result = {};
    sharedData.data.forEach(item => {
      if (neededSharedDataTypes.has(item.type) && item.data) {
        try {
          result[item.type] = JSON.parse(item.data);
        } catch (e) {
          console.error(`Failed to parse ${item.type} data:`, e);
        }
      }
    });

    return result;
  }, [sharedData, neededSharedDataTypes]);

  // Process custom section data - ONLY for the current page
  const parsedCustomData = useMemo(() => {
    if (!customSectionData?.data) {
      return {};
    }

    const result = {};
    customSectionData.data.forEach(item => {
      // Only include data for the current page
      if (item.page_slug === pageSlug && item.data && item.is_active === 1) {
        try {
          // Parse the JSON string data
          const parsedData = JSON.parse(item.data);
          // Store by section_key
          result[item.section_key] = parsedData;
        } catch (e) {
          console.error(`Failed to parse custom data for ${item.section_key}:`, e);
        }
      }
    });

    return result;
  }, [customSectionData, pageSlug]);

  // Filter section configs for the current page
  const pageConfigs = useMemo(() => {
    if (!sectionConfigsData?.data) {
      return [];
    }

    return sectionConfigsData.data
      .filter(config => config.page_slug === pageSlug && config.is_enabled === 1)
      .sort((a, b) => a.display_order - b.display_order);
  }, [sectionConfigsData, pageSlug]);

  // Build pageData for each section
  const pageData = useMemo(() => {
    const data = {};

    pageConfigs.forEach(section => {
      // If section uses shared_data, get it from parsedSharedData
      if (section.data_table === 'shared_data') {
        let type = section.data_key;
        if (type && type.endsWith('Data')) {
          type = type.slice(0, -4);
        }
        if (type) {
          type = type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          const value = parsedSharedData[type] || null;

          // Store under BOTH keys for maximum compatibility
          data[section.data_key] = value;
          data[type] = value;
        }
      }
      // If section uses custom_section_data, get it from parsedCustomData
      else if (section.data_table === 'custom_section_data') {
        const sectionKey = section.section_key;
        const value = parsedCustomData[sectionKey] || null;

        // Store under the data_key if provided
        if (section.data_key) {
          data[section.data_key] = value;
        }
        // Also store under the section_key
        data[sectionKey] = value;
      }
      // For other data tables (like 'programs'), use props
      else if (section.data_table) {
        const value = props[section.data_key] || null;
        if (section.data_key) {
          data[section.data_key] = value;
        }
      }
    });

    return data;
  }, [pageConfigs, parsedSharedData, parsedCustomData, props]);

  // Loading state
  if (configsLoading || sharedLoading || customLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#515151]">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (configsError || sharedError || customError) {
    console.error('Data Error:', { configsError, sharedError, customError });
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            We couldn't load the page data. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#009BE2] text-white px-6 py-2 rounded-lg hover:bg-[#009BE2]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get page title
  const getPageTitle = () => {
    if (customTitle) {
      return customTitle;
    }
    if (pageInfo?.title) {
      return `${pageInfo.title} | DUS - Dwip Unnayan Society`;
    }

    const titles = {
      'home': 'Home | DUS - Dwip Unnayan Society | Empowering Communities',
      'about': 'About Us | DUS - Dwip Unnayan Society | Empowering Communities',
      'about-details': 'About | DUS - Dwip Unnayan Society | Empowering Communities',
      'blogs': 'Blogs | DUS - Dwip Unnayan Society | Empowering Communities',
      'blog-details': 'Blog | DUS - Dwip Unnayan Society | Empowering Communities',
      'contact': 'Contact Us | DUS - Dwip Unnayan Society | Empowering Communities',
      'projects-programs': 'Projects & Programs | DUS - Dwip Unnayan Society | Empowering Communities',
      'projects-programs-details': 'Program | DUS - Dwip Unnayan Society | Empowering Communities',
    };
    return titles[pageSlug] || 'DUS - Dwip Unnayan Society | Empowering Communities';
  };

  // Get meta description
  const getMetaDescription = () => {
    if (pageInfo?.description) {
      return pageInfo.description;
    }
    return 'Dwip Unnayan Society (DUS) is a community-based philanthropic organization dedicated to sustainable poverty reduction and community development.';
  };

  const storageUrl = import.meta.env.VITE_STORAGE_URL || '';

  // If children are provided (custom page)
  if (children) {
    return (
      <PublicLayout
        topBarData={parsedSharedData.topbar || null}
        navbarData={parsedSharedData.navbar || null}
        footerData={parsedSharedData.footer || null}
        storageUrl={storageUrl}
      >
        <Helmet>
          <title>{getPageTitle()}</title>
          <meta name="description" content={getMetaDescription()} />
          <meta property="og:title" content={getPageTitle()} />
          <meta property="og:description" content={getMetaDescription()} />
        </Helmet>
        {children}
      </PublicLayout>
    );
  }

  // Standard dynamic page
  return (
    <PublicLayout
      topBarData={parsedSharedData.topbar || null}
      navbarData={parsedSharedData.navbar || null}
      footerData={parsedSharedData.footer || null}
      storageUrl={storageUrl}
    >
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Empty state */}
      {pageConfigs.length === 0 && (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-32 w-32 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m4 0h.01M7 12h6m4 0h.01"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              No Content Available
            </h2>
            <p className="mt-3 text-base text-gray-500">
              This page is currently being built. Please check back later.
            </p>
            {import.meta.env.DEV && (
              <p className="mt-2 text-sm text-gray-400">
                Page Slug: <span className="font-mono">{pageSlug}</span>
                <br />
                Sections Found: {pageConfigs.length}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Render all sections */}
      {pageConfigs.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{
            storageUrl,
            sharedData: parsedSharedData,
            pageSlug
          }}
        />
      ))}
    </PublicLayout>
  );
}