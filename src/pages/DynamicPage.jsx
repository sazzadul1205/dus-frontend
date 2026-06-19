// dus-frontend/src/pages/DynamicPage.jsx

// React
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// Tanstack
import { useQuery } from '@tanstack/react-query';

// Layout
import PublicLayout from "../Layout/PublicLayout";

// Hooks
import useAxiosPublic from '../hooks/useAxiosPublic';

// Shared
import DynamicSectionRenderer from '../Shared/DynamicSectionRenderer';

// Storage URL
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || '';

// Page titles
const TITLES = {
  'home': 'Home | DUS - Dwip Unnayan Society | Empowering Communities',
  'about': 'About Us | DUS - Dwip Unnayan Society | Empowering Communities',
  'about-details': 'About | DUS - Dwip Unnayan Society | Empowering Communities',
  'blogs': 'Blogs | DUS - Dwip Unnayan Society | Empowering Communities',
  'blog-details': 'Blog | DUS - Dwip Unnayan Society | Empowering Communities',
  'contact': 'Contact Us | DUS - Dwip Unnayan Society | Empowering Communities',
  'projects-programs': 'Projects & Programs | DUS - Dwip Unnayan Society | Empowering Communities',
  'projects-programs-details': 'Program | DUS - Dwip Unnayan Society | Empowering Communities',
};

// Default page title and description
const DEFAULT_DESC = 'Dwip Unnayan Society (DUS) is a community-based philanthropic organization dedicated to sustainable poverty reduction and community development.';

// Map route patterns to page slugs
const getPageSlugFromPath = (pathname) => {
  const path = pathname.replace(/^\/+|\/+$/g, '');
  const segments = path.split('/');

  // Check for details pages first (they have 2 segments)
  if (segments.length >= 2) {
    const baseSlug = segments[0];
    // If first segment is one of these, it's a details page
    if (baseSlug === 'blogs') {
      return 'blog-details';
    }
    if (['about', 'projects-programs'].includes(baseSlug)) {
      return `${baseSlug}-details`;
    }
  }

  // Return the first segment or 'home'
  return segments[0] || 'home';
};

export default function DynamicPage({ pageInfo, children, customTitle, ...props }) {
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // Get page slug
  const pageSlug = useMemo(() => {
    return getPageSlugFromPath(location.pathname);
  }, [location.pathname]);

  // Fetch section configs - ALWAYS enabled
  const {
    data: configsData,
    error: configsError,
    isLoading: configsLoading,
  } = useQuery({
    queryKey: ['sectionConfigs', pageSlug],
    queryFn: async () => {
      // Fetch ALL section configs and filter on client side
      const response = await axiosPublic.get('section_configs.json');
      // Filter for the current page
      const filtered = response.data?.data?.filter(c => c.page_slug === pageSlug && c.is_enabled === 1) || [];
      return { data: filtered };
    },
    enabled: !!pageSlug,
  });

  // Fetch custom data
  const {
    data: customData,
    error: customError,
    isLoading: customLoading,
  } = useQuery({
    queryKey: ['customSectionData', pageSlug],
    queryFn: () => axiosPublic.get('custom_section_data.json').then(res => res.data),
    enabled: !!pageSlug
  });

  // Determine needed shared data types
  const neededTypes = useMemo(() => {
    if (!configsData?.data) return new Set(['topbar', 'navbar', 'footer']);

    const types = new Set(['topbar', 'navbar', 'footer']);
    configsData.data.forEach(config => {
      if (config.data_table === 'shared_data' && config.data_key) {
        const type = config.data_key.replace(/Data$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        if (type) types.add(type);
      }
    });
    return types;
  }, [configsData]);

  // Fetch shared data
  const {
    data: sharedData,
    error: sharedError,
    isLoading: sharedLoading,
  } = useQuery({
    queryKey: ['sharedData', [...neededTypes].sort().join(',')],
    queryFn: () => axiosPublic.get('shared_data.json').then(res => res.data),
    enabled: !!configsData && neededTypes.size > 0,
  });

  // Fetch programs data
  const {
    data: programsData,
    error: programsError,
    isLoading: programsLoading,
  } = useQuery({
    queryKey: ['programsData'],
    queryFn: async () => {
      const response = await axiosPublic.get('programs.json');
      return response.data;
    },
    enabled: !!configsData,
  });

  // Fetch blogs data
  const {
    data: blogsData,
    error: blogsError,
    isLoading: blogsLoading,
  } = useQuery({
    queryKey: ['blogsData'],
    queryFn: () => axiosPublic.get('blogs.json').then(res => res.data),
    enabled: !!configsData,
  });

  // Fetch about content data for about-details pages
  const {
    data: aboutContentData,
    error: aboutContentError,
    isLoading: aboutContentLoading,
  } = useQuery({
    queryKey: ['aboutContentData'],
    queryFn: () => axiosPublic.get('about_content.json').then(res => res.data),
    enabled: !!configsData,
  });

  // Process data
  const parsedShared = useMemo(() => {
    if (!sharedData?.data) return {};
    return sharedData.data.reduce((acc, item) => {
      if (neededTypes.has(item.type) && item.data) {
        try { acc[item.type] = JSON.parse(item.data); }
        catch (e) { console.error(`Failed to parse ${item.type}:`, e); }
      }
      return acc;
    }, {});
  }, [sharedData, neededTypes]);

  // Process custom data
  const parsedCustom = useMemo(() => {
    if (!customData?.data) return {};
    return customData.data.reduce((acc, item) => {
      if (item.page_slug === pageSlug && item.is_active === 1 && item.data) {
        try { acc[item.section_key] = JSON.parse(item.data); }
        catch (e) { console.error(`Failed to parse ${item.section_key}:`, e); }
      }
      return acc;
    }, {});
  }, [customData, pageSlug]);

  // Get page configs - now configsData.data is already filtered
  const pageConfigs = useMemo(() => {
    if (!configsData?.data) return [];
    return [...configsData.data].sort((a, b) => a.display_order - b.display_order);
  }, [configsData]);

  // Get page data
  const pageData = useMemo(() => {
    const data = {};
    pageConfigs.forEach(section => {
      if (section.data_table === 'shared_data' && section.data_key) {
        const type = section.data_key.replace(/Data$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const value = parsedShared[type] || null;
        data[section.data_key] = value;
        data[type] = value;
      } else if (section.data_table === 'custom_section_data' && section.section_key) {
        const value = parsedCustom[section.section_key] || null;
        if (section.data_key) data[section.data_key] = value;
        data[section.section_key] = value;
      } else if (section.data_table === 'programs' && section.data_key) {
        // Programs data from programs.json
        const programsPayload = programsData?.data || programsData?.programs || [];
        data[section.data_key] = {
          section: programsData?.section || null,
          programs: programsPayload,
        };
        data['programsData'] = programsPayload;
        data['programsSection'] = programsData?.section || null;
      } else if (section.data_table === 'blogs' && section.data_key) {
        // Blogs data from blogs.json
        const blogList = blogsData?.data || [];
        data[section.data_key] = blogList;
        data['blogsData'] = blogList;
      } else if (section.data_table === 'about_content' && section.data_key) {
        const aboutList = aboutContentData?.data || [];
        data[section.data_key] = aboutList;
        data['aboutContentData'] = aboutList;
      } else if (section.data_table && section.data_key) {
        data[section.data_key] = props[section.data_key] || null;
      }
    });

    // Always pass programsData for details pages
    if (programsData?.data) {
      data.programsData = programsData.data;
    }
    if (programsData?.section) {
      data.programsSection = programsData.section;
    }

    // Always pass blogsData for details pages
    if (blogsData?.data) {
      data.blogsData = blogsData.data;
    }

    if (aboutContentData?.data) {
      const aboutList = aboutContentData.data;
      data.aboutContentData = aboutList;
      data.contentSectionData = aboutList;
    }

    return data;
  }, [pageConfigs, parsedShared, parsedCustom, props, programsData, blogsData, aboutContentData]);

  // Loading/Error states
  const isLoading = configsLoading || sharedLoading || customLoading || programsLoading || blogsLoading || aboutContentLoading;
  const hasError = configsError || sharedError || customError || programsError || blogsError || aboutContentError;

  // Render - Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#515151]">Loading...</p>
        </div>
      </div>
    );
  }

  // Render - Error
  if (hasError) {
    console.error('Data Error:', { configsError, sharedError, customError, programsError, blogsError });
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the page data. Please try again later.</p>
          <button onClick={() => window.location.reload()} className="bg-[#009BE2] text-white px-6 py-2 rounded-lg hover:bg-[#009BE2]/80 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get page metadata
  const pageTitle = customTitle || pageInfo?.title ? `${pageInfo?.title || ''} | DUS - Dwip Unnayan Society` : TITLES[pageSlug] || 'DUS - Dwip Unnayan Society | Empowering Communities';
  const metaDesc = pageInfo?.description || DEFAULT_DESC;

  // Layout data
  const layoutData = {
    topBarData: parsedShared.topbar || null,
    navbarData: parsedShared.navbar || null,
    footerData: parsedShared.footer || null,
    storageUrl: STORAGE_URL
  };

  // SEO Helmet
  const seoHelmet = (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:type" content="website" />
      <meta name="description" content={metaDesc} />
      <meta property="og:title" content={pageTitle} />
      <link rel="canonical" href={window.location.href} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={window.location.href} />
    </Helmet>
  );

  // Render children if provided
  if (children) {
    return (
      <PublicLayout {...layoutData}>
        {seoHelmet}
        {React.cloneElement(children, {
          programsData: pageData.programsData || [],
          programsSection: pageData.programsSection || null,
          blogsData: pageData.blogsData || [],
          sectionConfigs: pageConfigs,
          pageData: pageData,
          storageUrl: STORAGE_URL
        })}
      </PublicLayout>
    );
  }

  // Empty state
  if (pageConfigs.length === 0) {
    return (
      <PublicLayout {...layoutData}>
        {seoHelmet}
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m4 0h.01M7 12h6m4 0h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">No Content Available</h2>
            <p className="mt-3 text-base text-gray-500">This page is currently being built. Please check back later.</p>
            {import.meta.env.DEV && (
              <p className="mt-2 text-sm text-gray-400">
                Page Slug: <span className="font-mono">{pageSlug}</span><br />
                Sections Found: {pageConfigs.length}
              </p>
            )}
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Render sections
  return (
    <PublicLayout {...layoutData}>
      {seoHelmet}
      {pageConfigs.map(section => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{
            storageUrl: STORAGE_URL,
            sharedData: parsedShared,
            pageSlug,
            programsData: pageData.programsData || [],
            programsSection: pageData.programsSection || null,
            blogsData: pageData.blogsData || [],
          }}
        />
      ))}
    </PublicLayout>
  );
}
