// dus-frontend/src/pages/BlogDetails/BlogDetails.jsx

/**
 * ============================================
 * BLOG DETAILS PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for individual blog post pages
 * - Extracts blog slug from URL
 * - Scrolls to top on page load
 * - Renders BlogDetailsContent inside DynamicPage
 * 
 * URL PATTERN: '/blogs/:slug'
 * Example: '/blogs/my-awesome-blog-post'
 * 
 * DATA FLOW:
 * 1. useParams() gets slug from URL
 * 2. useLocation() tracks route changes for scroll
 * 3. useEffect scrolls to top when route or slug changes
 * 4. DynamicPage fetches all data and passes to children
 * 5. BlogDetailsContent uses slug to find the specific blog
 * 
 * HOW IT WORKS:
 * - DynamicPage acts as a wrapper with data fetching
 * - BlogDetailsContent is the child that renders content
 * - slug is passed to both for finding the right blog
 * 
 * ============================================
 */

// React
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// Components
import DynamicPage from '../DynamicPage';
import BlogDetailsContent from './BlogDetailsContent';

/**
 * BlogDetails Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered blog detail page
 */
export default function BlogDetails(props) {
  // Get the blog slug from the URL (e.g., /blogs/my-post → 'my-post')
  const { slug } = useParams();

  // Get current location for scroll tracking
  const location = useLocation();

  // ============================================
  // SCROLL TO TOP ON PAGE LOAD
  // ============================================
  /**
   * Smoothly scrolls to top when:
   * - Page first loads
   * - User navigates to a different blog post
   * - User clicks a link that changes the path
   * 
   * Why? Better UX - user doesn't stay at the bottom of previous post
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, slug]);

  /**
   * Render DynamicPage with BlogDetailsContent as child
   * 
   * DynamicPage handles:
   * - Data fetching (blogs, shared data, etc.)
   * - Layout (TopBar, Navbar, Footer)
   * - SEO metadata
   * 
   * BlogDetailsContent handles:
   * - Finding the correct blog by slug
   * - Rendering blog content
   * - Related blogs
   */
  return (
    <DynamicPage {...props} slug={slug}>
      {/* BlogDetailsContent receives props from DynamicPage */}
      <BlogDetailsContent {...props} slug={slug} />
    </DynamicPage>
  );
}