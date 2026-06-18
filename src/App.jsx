// dus-frontend/src/App.jsx

import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tanstack
import { useQuery } from '@tanstack/react-query';

// Hooks
import useAxiosPublic from './hooks/useAxiosPublic';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Blogs = lazy(() => import('./pages/Blogs/Blogs'));
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs'));
const BlogDetails = lazy(() => import('./pages/BlogDetails/BlogDetails'));
const AboutDetails = lazy(() => import('./pages/AboutDetails/AboutDetails'));
const ProjectsAndPrograms = lazy(() => import('./pages/ProjectsAndPrograms/ProjectsAndPrograms'));
const ProjectsAndProgramsDetails = lazy(() => import('./pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails'));

// Constants
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

// Constants - Route paths
const ROUTE_PATHS = {
  'home': '/',
  'about': '/about',
  'about-details': '/about/:slug',
  'blogs': '/blogs',
  'blog-details': '/blog/:slug',
  'contact': '/contact',
  'projects-programs': '/projects-programs',
  'projects-programs-details': '/projects-programs/:slug',
};

// Page components - Loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-[#515151]">Loading...</p>
    </div>
  </div>
);

// Page components - Error
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

// Page components - Not found
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

// Page components - Default
const DefaultPage = ({ pageTitle }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle || 'Page'}</h1>
      <p className="text-gray-600">This page is currently being built.</p>
    </div>
  </div>
);

// Custom hook for page data
const usePageData = () => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ['pageData'],
    queryFn: () => axiosPublic.get('/public/data/pages.json').then(res => res.data),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry twice on failure
  });
};

function App() {
  const { isPending, error, data, refetch } = usePageData();

  if (isPending) return <LoadingSpinner />;
  if (error) return <ErrorDisplay onRetry={() => refetch()} />;

  const pages = data?.data || [];

  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {pages.map((page) => {
              const Component = PAGE_COMPONENTS[page.slug];
              const path = ROUTE_PATHS[page.slug] || `/${page.slug}`;
              const props = { pageInfo: page };

              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    Component ? (
                      <Component {...props} />
                    ) : (
                      <DefaultPage pageTitle={page.title || page.name || 'Page'} />
                    )
                  }
                />
              );
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;