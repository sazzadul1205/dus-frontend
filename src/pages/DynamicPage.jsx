// dus-frontend/src/pages/DynamicPage.jsx

/**
 * ============================================
 * DYNAMIC PAGE - Page Data Loader & Renderer
 * ============================================
 * 
 * PURPOSE:
 * - Central page loader that fetches all data for a page
 * - Orchestrates data fetching from multiple sources
 * - Renders sections dynamically based on configuration
 * - Handles loading, error, and empty states
 * - Provides SEO metadata via React Helmet
 * 
 * DATA SOURCES:
 * 1. section_configs.json - Which sections to render and their order
 * 2. shared_data.json - TopBar, Navbar, Footer, and other shared data
 * 3. custom_section_data.json - Custom data for specific sections
 * 4. programs.json - Programs data for projects/programs pages
 * 5. blogs.json - Blog posts data
 * 6. about_content.json - About page content
 * 
 * DATA FLOW:
 * 1. Determine page slug from URL path
 * 2. Fetch section configs for this page
 * 3. Determine what data is needed based on section configs
 * 4. Fetch all required data in parallel
 * 5. Process and combine data
 * 6. Render PublicLayout with sections
 * 
 * HOW IT WORKS:
 * - Each section in section_configs.json specifies:
 *   - component: Which React component to render
 *   - data_table: Where to get data (shared_data, custom_section_data, etc.)
 *   - data_key: What key to look for in the data
 *   - display_order: Order of rendering
 * 
 * PAGE SLUG MAPPING:
 * - '/' → 'home'
 * - '/about' → 'about'
 * - '/about/our-mission' → 'about-details'
 * - '/blogs' → 'blogs'
 * - '/blogs/my-post' → 'blog-details'
 * - '/projects-programs' → 'projects-programs'
 * - '/projects-programs/education' → 'projects-programs-details'
 * 
 * ============================================
 */

import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import PublicLayout from "../Layout/PublicLayout";
import useAxiosPublic from '../hooks/useAxiosPublic';
import DynamicSectionRenderer from '../Shared/DynamicSectionRenderer';

// ============================================
// CONSTANTS
// ============================================

/** Base URL for image storage from environment variables */
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || '';

/**
 * Page titles for SEO
 * Used when pageInfo.title is not available from the API
 * These are hardcoded fallbacks for each page type
 */
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

/** Default meta description for SEO when none is provided */
const DEFAULT_DESC = 'Dwip Unnayan Society (DUS) is a community-based philanthropic organization dedicated to sustainable poverty reduction and community development.';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determines the page slug from the current URL path
 * 
 * URL Pattern → Page Slug Mapping:
 * - '/' → 'home'
 * - '/about' → 'about'
 * - '/about/slug' → 'about-details'
 * - '/blogs' → 'blogs'
 * - '/blogs/slug' → 'blog-details'
 * - '/projects-programs' → 'projects-programs'
 * - '/projects-programs/slug' → 'projects-programs-details'
 * 
 * Why this matters: The page slug determines what data to fetch
 * and which components to render. Different page types have different
 * data requirements and rendering logic.
 * 
 * @param {string} pathname - Current URL path from useLocation
 * @returns {string} Page slug for data fetching
 */
const getPageSlugFromPath = (pathname) => {
  // Remove leading/trailing slashes for consistent parsing
  const path = pathname.replace(/^\/+|\/+$/g, '');
  const segments = path.split('/');

  // Check for details pages (2+ segments in the path)
  // e.g., /blogs/my-post → ['blogs', 'my-post'] → 'blog-details'
  if (segments.length >= 2) {
    const baseSlug = segments[0];
    if (baseSlug === 'blogs') {
      return 'blog-details';
    }
    if (['about', 'projects-programs'].includes(baseSlug)) {
      return `${baseSlug}-details`;
    }
  }

  // Return the first segment or 'home' for the root path
  return segments[0] || 'home';
};

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * DynamicPage Component - The heart of the page rendering system
 * 
 * This component is the entry point for all pages in the application.
 * It handles:
 * - Determining which page is being requested
 * - Fetching all required data for that page
 * - Building the page structure from sections
 * - Rendering the layout with all sections
 * - SEO metadata management
 * 
 * @param {Object} props
 * @param {Object} props.pageInfo - Page metadata from pages.json (title, description, etc.)
 * @param {React.ReactNode} props.children - Optional child content (for details pages)
 * @param {string} props.customTitle - Override page title for SEO
 * @param {Object} props.programData - Program data passed to children
 * @param {Object} props.pageData - Pre-fetched data for the page
 * @param {Array} props.sectionConfigs - Section configurations
 * @param {string} props.storageUrl - Image storage URL
 * 
 * @returns {JSX.Element} Rendered page with layout and sections
 */
export default function DynamicPage({ pageInfo, children, customTitle, ...props }) {
  // ============================================
  // HOOKS
  // ============================================
  const location = useLocation(); // For determining current route
  const axiosPublic = useAxiosPublic(); // API client for public data

  // ============================================
  // 1. DETERMINE PAGE SLUG
  // ============================================
  /**
   * Memoized page slug calculation
   * Only recalculates when the URL path changes
   */
  const pageSlug = useMemo(() => {
    return getPageSlugFromPath(location.pathname);
  }, [location.pathname]);

  // ============================================
  // 2. FETCH SECTION CONFIGURATIONS
  // ============================================
  /**
   * Fetches section configurations for the current page
   * Filters to only enabled sections for this page
   * 
   * Section configs define:
   * - Which components to render
   * - What data to use
   * - Order of rendering
   * - Custom props for each section
   */
  const {
    data: configsData,
    error: configsError,
    isLoading: configsLoading,
  } = useQuery({
    queryKey: ['sectionConfigs', pageSlug],
    queryFn: async () => {
      // Fetch ALL section configs from the API
      const response = await axiosPublic.get('section_configs.json');
      // Filter for the current page and enabled sections only
      const filtered = response.data?.data?.filter(
        c => c.page_slug === pageSlug && c.is_enabled === 1
      ) || [];
      return { data: filtered };
    },
    enabled: !!pageSlug, // Only run when we have a page slug
  });

  // ============================================
  // 3. FETCH CUSTOM SECTION DATA
  // ============================================
  /**
   * Fetches custom data for sections that need it
   * Used for section-specific content (e.g., FAQ data, card data)
   * 
   * Custom data is stored separately from shared data
   * Each section can have its own data structure
   */
  const {
    data: customData,
    error: customError,
    isLoading: customLoading,
  } = useQuery({
    queryKey: ['customSectionData', pageSlug],
    queryFn: () => axiosPublic.get('custom_section_data.json').then(res => res.data),
    enabled: !!pageSlug
  });

  // ============================================
  // 4. DETERMINE NEEDED SHARED DATA TYPES
  // ============================================
  /**
   * Analyzes section configs to determine what shared data is needed
   * Always includes: topbar, navbar, footer (required for all pages)
   * Additional types from section configs (e.g., 'banner', 'about')
   * 
   * This optimization prevents fetching unnecessary data
   * Only data that sections need will be fetched
   */
  const neededTypes = useMemo(() => {
    // Always need these three for the layout
    if (!configsData?.data) return new Set(['topbar', 'navbar', 'footer']);

    const types = new Set(['topbar', 'navbar', 'footer']);
    configsData.data.forEach(config => {
      if (config.data_table === 'shared_data' && config.data_key) {
        // Convert camelCase to kebab-case for consistent lookup
        // e.g., bannerData → banner-data
        const type = config.data_key
          .replace(/Data$/, '')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        if (type) types.add(type);
      }
    });
    return types;
  }, [configsData]);

  // ============================================
  // 5. FETCH SHARED DATA
  // ============================================
  /**
   * Fetches shared data (TopBar, Navbar, Footer, etc.)
   * Uses the neededTypes set to fetch only what's required
   * 
   * Shared data is used across multiple pages
   * Examples: TopBar contact info, Navbar links, Footer content
   */
  const {
    data: sharedData,
    error: sharedError,
    isLoading: sharedLoading,
  } = useQuery({
    queryKey: ['sharedData', [...neededTypes].sort().join(',')],
    queryFn: () => axiosPublic.get('shared_data.json').then(res => res.data),
    enabled: !!configsData && neededTypes.size > 0,
  });

  // ============================================
  // 6. FETCH PROGRAMS DATA
  // ============================================
  /**
   * Fetches programs data for projects/programs pages
   * Also used for program details pages
   * 
   * This data contains:
   * - Program list with titles, descriptions, images
   * - Program sections and categories
   * - Program details for individual program pages
   */
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
    enabled: !!configsData, // Only fetch if we have section configs
  });

  // ============================================
  // 7. FETCH BLOGS DATA
  // ============================================
  /**
   * Fetches blog posts for blogs listing and details pages
   * 
   * This data contains:
   * - Blog post list with titles, excerpts, dates
   * - Blog content for individual posts
   * - Tags and categories for filtering
   */
  const {
    data: blogsData,
    error: blogsError,
    isLoading: blogsLoading,
  } = useQuery({
    queryKey: ['blogsData'],
    queryFn: () => axiosPublic.get('blogs.json').then(res => res.data),
    enabled: !!configsData,
  });

  // ============================================
  // 7.5 FETCH JOBS DATA
  // ============================================
  /**
   * Fetches jobs data for the jobs section
   * 
   * This data contains:
   * - Job listings with type, department, location
   * - Job titles and descriptions
   * - Apply links
   */
  const {
    data: jobsData,
    error: jobsError,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ['jobsData'],
    queryFn: () => axiosPublic.get('jobs.json').then(res => res.data),
    enabled: !!configsData && pageConfigs.some(section => section.data_table === 'jobs' && section.data_key),
  });

  // ============================================
  // 8. FETCH ABOUT CONTENT DATA
  // ============================================
  /**
   * Fetches about content for about-details pages
   * Contains all about sub-pages (mission, vision, team, etc.)
   * 
   * This data contains:
   * - About page content with rich text
   * - Images and media
   * - Buttons and CTAs
   */
  const {
    data: aboutContentData,
    error: aboutContentError,
    isLoading: aboutContentLoading,
  } = useQuery({
    queryKey: ['aboutContentData'],
    queryFn: () => axiosPublic.get('about_content.json').then(res => res.data),
    enabled: !!configsData,
  });

  // ============================================
  // 9. PROCESS DATA
  // ============================================

  /**
   * Parses shared data JSON strings into objects
   * Groups by type (topbar, navbar, footer, etc.)
   * 
   * The API stores JSON data as strings in the database
   * We need to parse them to use them as JavaScript objects
   */
  const parsedShared = useMemo(() => {
    if (!sharedData?.data) return {};
    return sharedData.data.reduce((acc, item) => {
      if (neededTypes.has(item.type) && item.data) {
        try {
          acc[item.type] = JSON.parse(item.data);
        } catch (e) {
          console.error(`Failed to parse ${item.type}:`, e);
        }
      }
      return acc;
    }, {});
  }, [sharedData, neededTypes]);

  /**
   * Parses custom data JSON strings into objects
   * Filters to only current page and active items
   * Groups by section_key
   * 
   * Custom data is for specific sections on specific pages
   * Each section can have its own data structure
   */
  const parsedCustom = useMemo(() => {
    if (!customData?.data) return {};
    return customData.data.reduce((acc, item) => {
      if (item.page_slug === pageSlug && item.is_active === 1 && item.data) {
        try {
          acc[item.section_key] = JSON.parse(item.data);
        } catch (e) {
          console.error(`Failed to parse ${item.section_key}:`, e);
        }
      }
      return acc;
    }, {});
  }, [customData, pageSlug]);

  /**
   * Get page configs and sort by display order
   * Configs are already filtered for the current page and enabled
   * Sorting ensures sections render in the correct order
   */
  const pageConfigs = useMemo(() => {
    if (!configsData?.data) return [];
    return [...configsData.data].sort((a, b) => a.display_order - b.display_order);
  }, [configsData]);

  /**
   * Processes and combines all page data
   * Maps section configs to their data sources
   * Creates a unified pageData object
   * 
   * This is the most important data transformation:
   * - Each section gets its data from the right source
   * - Data is structured for easy consumption by sections
   * - Fallbacks are provided for missing data
   */
  const pageData = useMemo(() => {
    const data = {};

    pageConfigs.forEach(section => {
      // Handle shared data (topbar, navbar, footer, etc.)
      if (section.data_table === 'shared_data' && section.data_key) {
        const type = section.data_key
          .replace(/Data$/, '')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();

        const value = parsedShared[type] || null;
        data[section.data_key] = value;
        data[type] = value;
      }

      // Handle custom section data
      else if (section.data_table === 'custom_section_data' && section.section_key) {
        const value = parsedCustom[section.section_key] || null;
        if (section.data_key) data[section.data_key] = value;
        data[section.section_key] = value;
      }

      // Handle programs data
      else if (section.data_table === 'programs' && section.data_key) {
        const programsPayload = programsData?.data || programsData?.programs || [];

        data[section.data_key] = {
          section: programsData?.section || null,
          programs: programsPayload,
        };

        data['programsData'] = programsPayload;
        data['programsSection'] = programsData?.section || null;
      }

      // Handle blogs data
      else if (section.data_table === 'blogs' && section.data_key) {
        const blogList = blogsData?.data || [];

        data[section.data_key] = blogList;
        data['blogsData'] = blogList;
      }

      // Handle about content data
      else if (section.data_table === 'about_content' && section.data_key) {
        const aboutList = aboutContentData?.data || [];

        data[section.data_key] = aboutList;
        data['aboutContentData'] = aboutList;
      }

      // Handle jobs data
      else if (section.data_table === 'jobs' && section.data_key) {
        const jobList = jobsData?.data || [];

        data[section.data_key] = {
          section: section.section_key === 'jobs'
            ? {
              title: "Join our big family",
              description:
                "Join us on this journey of kindness, and let's make a difference, one act of charity at a time.",
            }
            : null,

          filter: {
            options: [
              { value: "", label: "Browse By" },
              { value: "all", label: "All Jobs" },
              { value: "full-time", label: "Full Time" },
              { value: "part-time", label: "Part Time" },
              { value: "contract", label: "Contract" },
              { value: "remote", label: "Remote" },
              { value: "internship", label: "Internship" },
            ],
          },

          jobs: jobList,
        };

        // Keep the raw list available separately without overwriting the
        // section payload that JobsSection expects.
        data['jobsList'] = jobList;
      }

      // Fallback: pass through props
      else if (section.data_table && section.data_key) {
        data[section.data_key] = props[section.data_key] || null;
      }
    });

    // Always pass programsData and blogsData for details pages
    if (programsData?.data) {
      data.programsData = programsData.data;
    }

    if (programsData?.section) {
      data.programsSection = programsData.section;
    }

    if (blogsData?.data) {
      data.blogsData = blogsData.data;
    }

    if (aboutContentData?.data) {
      const aboutList = aboutContentData.data;
      data.aboutContentData = aboutList;
      data.contentSectionData = aboutList;
    }

    return data;
  }, [
    pageConfigs,
    parsedShared,
    parsedCustom,
    props,
    programsData,
    blogsData,
    aboutContentData,
    jobsData
  ]);

  // ============================================
  // 10. LOADING & ERROR STATES
  // ============================================

  /**
   * Check if any data is still loading
   * All queries must complete before rendering
   */
  const isLoading = configsLoading || sharedLoading || customLoading ||
    programsLoading || blogsLoading || aboutContentLoading || jobsLoading;

  /**
   * Check if any query encountered an error
   * Show error state if any data fetch fails
   */
  const hasError = configsError || sharedError || customError ||
    programsError || blogsError || aboutContentError || jobsError;

  // ============================================
  // 11. RENDER - LOADING STATE
  // ============================================
  /**
   * Show loading spinner while data is being fetched
   * Uses brand color (#009BE2) for the spinner
   */
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

  // ============================================
  // 12. RENDER - ERROR STATE
  // ============================================
  /**
   * Show error message with retry button
   * Logs errors to console for debugging
   */
  if (hasError) {
    console.error('Data Error:', { configsError, sharedError, customError, programsError, blogsError });
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the page data. Please try again later.</p>
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

  // ============================================
  // 13. SEO METADATA
  // ============================================

  /**
   * Determine page title with proper fallbacks:
   * 1. customTitle (if provided)
   * 2. pageInfo.title from API (with brand suffix)
   * 3. Hardcoded TITLES mapping
   * 4. Default fallback
   */
  const pageTitle = customTitle ||
    (pageInfo?.title ? `${pageInfo?.title || ''} | DUS - Dwip Unnayan Society` : TITLES[pageSlug]) ||
    'DUS - Dwip Unnayan Society | Empowering Communities';

  /**
   * Determine meta description with fallback:
   * 1. pageInfo.description from API
   * 2. Default description
   */
  const metaDesc = pageInfo?.description || DEFAULT_DESC;

  /**
   * Layout data for PublicLayout component
   * TopBar, Navbar, and Footer data are required for the layout
   */
  const layoutData = {
    topBarData: parsedShared.topbar || null,
    navbarData: parsedShared.navbar || null,
    footerData: parsedShared.footer || null,
    storageUrl: STORAGE_URL
  };

  /**
   * SEO Helmet component for meta tags
   * Includes title, description, Open Graph tags, and canonical URL
   */
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

  // ============================================
  // 14. RENDER - CHILDREN PROVIDED (Details Pages)
  // ============================================
  /**
   * Option 1: Children Provided
   * Used for details pages (BlogDetails, AboutDetails, etc.)
   * 
   * Details pages have custom content that needs to be rendered
   * inside the layout with additional data from the parent
   * 
   * Examples: Blog post details, About sub-pages, Program details
   */
  if (children) {
    return (
      <PublicLayout {...layoutData}>
        {seoHelmet}
        {React.cloneElement(children, {
          programsData: pageData.programsData || [],
          programsSection: pageData.programsSection || null,
          blogsData: pageData.blogsData || [],
          jobsData: pageData.jobsList || [],
          sectionConfigs: pageConfigs,
          pageData: pageData,
          storageUrl: STORAGE_URL
        })}
      </PublicLayout>
    );
  }

  // ============================================
  // 15. RENDER - EMPTY STATE
  // ============================================
  /**
   * Option 2: No Sections Found
   * Shows empty state with helpful information
   * Includes debug info in development mode
   * 
   * This happens when the page exists but has no configured sections
   * Or when the page is being built but not yet complete
   */
  if (pageConfigs.length === 0) {
    return (
      <PublicLayout {...layoutData}>
        {seoHelmet}
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty state icon */}
            <div className="mb-8">
              <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m4 0h.01M7 12h6m4 0h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">No Content Available</h2>
            <p className="mt-3 text-base text-gray-500">This page is currently being built. Please check back later.</p>
            {/* Debug info - only shown in development */}
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

  // ============================================
  // 16. RENDER - NORMAL PAGE WITH SECTIONS
  // ============================================
  /**
   * Option 3: Normal Render
   * Renders PublicLayout with all sections
   * Each section is rendered by DynamicSectionRenderer
   * 
   * This is the most common case:
   * - Page has sections configured
   * - All data is loaded
   * - Sections render in display_order
   */
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
            jobsData: pageData.jobsList || [],
          }}
        />
      ))}
    </PublicLayout>
  );
}
