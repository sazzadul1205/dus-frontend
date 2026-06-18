// dus-frontend/src/App.jsx

// React
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Dynamic Page
import { useQuery } from '@tanstack/react-query';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Blogs from './pages/Blogs/Blogs';
import ContactUs from './pages/ContactUs/ContactUs';
import BlogDetails from './pages/BlogDetails/BlogDetails';
import AboutDetails from './pages/AboutDetails/AboutDetails';
import ProjectsAndPrograms from './pages/ProjectsAndPrograms/ProjectsAndPrograms';
import ProjectsAndProgramsDetails from './pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails';

// Hooks
import useAxiosPublic from './hooks/useAxiosPublic';

// Page Component Registry - Map page slugs to their components
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

// Default page component fallback
const DefaultPage = ({ pageTitle }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle || 'Page'}</h1>
        <p className="text-gray-600">This page is currently being built.</p>
      </div>
    </div>
  );
};

// Route path mapping for special slugs
const getRoutePath = (slug) => {
  const pathMap = {
    'home': '/',
    'about': '/about',
    'about-details': '/about/:slug',
    'blogs': '/blogs',
    'blog-details': '/blog/:slug',
    'contact': '/contact',
    'projects-programs': '/projects-programs',
    'projects-programs-details': '/projects-programs/:slug',
  };

  return pathMap[slug] || `/${slug}`;
};

function App() {
  const axiosPublic = useAxiosPublic();

  // Fetch page data using axiosPublic
  const {
    isPending: pageDataPending,
    error: pageDataError,
    data: pageData
  } = useQuery({
    queryKey: ['pageData'],
    queryFn: async () => {
      const response = await axiosPublic.get('/public/data/pages.json');
      return response.data;
    },
  });

  // Handle loading state
  if (pageDataPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#515151] font-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (pageDataError) {
    console.error('Page Data Error:', pageDataError);

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


  // Get page data from API response
  const pages = pageData?.data || [];

  // Generate routes dynamically based on page data
  const renderRoutes = () => {
    const routes = [];

    // Helper to create route elements
    const createRoute = (path, Component, props = {}) => {
      return (
        <Route
          key={path}
          path={path}
          element={<Component {...props} />}
        />
      );
    };

    // Map each page to a route
    pages.forEach((page) => {
      const Component = PAGE_COMPONENTS[page.slug];
      const routePath = getRoutePath(page.slug);

      if (Component) {

        // Add route
        routes.push(
          createRoute(routePath, Component, {
            pageInfo: page,
          })
        );

        // console.log(`✅ Route registered: ${routePath} → ${page.name} (${page.slug})`);
      } else {
        // console.warn(`⚠️ No component found for page slug: ${page.slug}`);

        // Create a fallback route for unknown pages
        routes.push(
          createRoute(routePath, DefaultPage, {
            pageTitle: page.title || page.name || 'Page',
          })
        );
      }
    });

    // Add a catch-all route for 404
    routes.push(
      <Route
        key="404"
        path="*"
        element={
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
              <a
                href="/"
                className="bg-[#009BE2] text-white px-6 py-2 rounded-lg hover:bg-[#009BE2]/80 transition-colors inline-block"
              >
                Go Home
              </a>
            </div>
          </div>
        }
      />
    );

    return routes;
  };

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {renderRoutes()}
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;