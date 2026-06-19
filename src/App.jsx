// dus-frontend/src/App.jsx

/**
 * ============================================
 * APP - Main Application Entry Point
 * ============================================
 * 
 * PURPOSE:
 * - Sets up routing for the entire application
 * - Fetches page configuration data from the server
 * - Dynamically loads page components based on route
 * - Handles loading and error states
 * 
 * DATA FLOW:
 * 1. Fetches 'pages.json' from API using usePageData hook
 * 2. Maps each page to a route using PAGE_COMPONENTS mapping
 * 3. Renders the appropriate component or a fallback
 * 
 * TECHNICAL NOTES:
 * - Uses lazy loading for code splitting (performance)
 * - React Router for navigation
 * - React Helmet for SEO metadata
 * - React Query for data fetching with caching
 * 
 * HOW TO ADD A NEW PAGE:
 * 1. Add the page component to PAGE_COMPONENTS
 * 2. Add the route path to ROUTE_PATHS
 * 3. Ensure the page slug matches the data from the API
 * ============================================
 */

// React
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tanstack 
import { useQuery } from '@tanstack/react-query';

// Hooks
import useAxiosPublic from './hooks/useAxiosPublic';

// ============================================
// LAZY LOADED PAGES (Code Splitting)
// ============================================
// These are loaded only when the route is visited
// This improves initial load performance
// ============================================

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Blogs = lazy(() => import('./pages/Blogs/Blogs'));
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs'));
const BlogDetails = lazy(() => import('./pages/BlogDetails/BlogDetails'));
const AboutDetails = lazy(() => import('./pages/AboutDetails/AboutDetails'));
const ProjectsAndPrograms = lazy(() => import('./pages/ProjectsAndPrograms/ProjectsAndPrograms'));
const ProjectsAndProgramsDetails = lazy(() => import('./pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails'));

// ============================================
// PAGE COMPONENT MAPPING
// ============================================
// Maps page slugs from the API to React components
// slug (from API) → Component to render
// ============================================

const PAGE_COMPONENTS = {
  'home': Home,
  'about': About,
  'about-details': AboutDetails,
  'blogs': Blogs,
  'blog-details': BlogDetails,
  'contact': ContactUs,
  'projects-programs': ProjectsAndPrograms,
  'projects-programs-details': ProjectsAndProgramsDetails,
};

// ============================================
// ROUTE PATH MAPPING
// ============================================
// Maps page slugs to URL paths
// slug → URL pattern (supports dynamic params like :slug)
// ============================================

const ROUTE_PATHS = {
  'home': '/',
  'about': '/about',
  'about-details': '/about/:slug',      // Dynamic: /about/our-mission
  'blogs': '/blogs',
  'blog-details': '/blogs/:slug',       // Dynamic: /blogs/my-blog-post
  'contact': '/contact',
  'projects-programs': '/projects-programs',
  'projects-programs-details': '/projects-programs/:slug', // Dynamic: /projects-programs/education
};

// ============================================
// UI COMPONENTS - Loading, Error, Not Found, Default
// ============================================

/**
 * LoadingSpinner - Shown while page data is being fetched
 * Uses Tailwind CSS for styling with the brand color (#009BE2)
 */
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-[#515151]">Loading...</p>
    </div>
  </div>
);

/**
 * ErrorDisplay - Shown when data fetching fails
 * Provides a Retry button to refetch data
 */
const ErrorDisplay = ({ onRetry }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">We couldn't load the page data. Please try again later.</p>
      <button
        onClick={onRetry}
        className="bg-[#009BE2] text-white px-6 py-2 rounded-lg hover:bg-[#009BE2]/80 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

/**
 * NotFound - Shown when a route doesn't match any page
 * 404 page with a link back to home
 */
const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="bg-[#009BE2] text-white px-6 py-2 rounded-lg hover:bg-[#009BE2]/80 transition-colors inline-block">
        Go Home
      </a>
    </div>
  </div>
);

/**
 * DefaultPage - Fallback for pages without a specific component
 * Used when a page exists in the API but doesn't have a matching component
 */
const DefaultPage = ({ pageTitle }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle || 'Page'}</h1>
      <p className="text-gray-600">This page is currently being built.</p>
    </div>
  </div>
);

// ============================================
// CUSTOM HOOK - usePageData
// ============================================
/**
 * Fetches page configuration data from the API
 * 
 * RETURNS: React Query result object with:
 * - data: The page data from the API
 * - isPending: Boolean indicating if data is being fetched
 * - error: Any error that occurred
 * - refetch: Function to manually refetch data
 * 
 * CACHING: 5 minutes stale time, retries twice on failure
 */
const usePageData = () => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ['pageData'],
    queryFn: () => axiosPublic.get('pages.json').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh
    retry: 2, // Retry twice on failure
  });
};

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  // Fetch page data using React Query
  const { isPending, error, data, refetch } = usePageData();

  // Show loading spinner while data is being fetched
  if (isPending) return <LoadingSpinner />;

  // Show error with retry button if fetching failed
  if (error) return <ErrorDisplay onRetry={() => refetch()} />;

  // Extract pages array from response (with fallback to empty array)
  const pages = data?.data || [];

  return (
    <HelmetProvider> {/* Provides SEO metadata management */}
      <Router> {/* React Router for navigation */}
        <Suspense fallback={<LoadingSpinner />}> {/* Handles lazy loading states */}
          <Routes>
            {/* Dynamically generate routes from page data */}
            {pages.map((page) => {
              // Get the component for this page slug
              const Component = PAGE_COMPONENTS[page.slug];
              // Get the route path for this page slug
              const path = ROUTE_PATHS[page.slug] || `/${page.slug}`;
              // Pass page info as props to the component
              const props = { pageInfo: page };

              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    Component ? (
                      // Render the mapped component if it exists
                      <Component {...props} />
                    ) : (
                      // Otherwise show the default placeholder page
                      <DefaultPage pageTitle={page.title || page.name || 'Page'} />
                    )
                  }
                />
              );
            })}
            {/* Catch-all route for 404 - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;