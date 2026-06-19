// dus-frontend/src/pages/AboutDetails/AboutDetails.jsx

/**
 * ============================================
 * ABOUT DETAILS PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for individual about sub-pages
 * - Extracts slug from URL
 * - Scrolls to top on page load
 * - Renders AboutDetailsContent inside DynamicPage
 * 
 * URL PATTERN: '/about/:slug'
 * Example: '/about/our-mission', '/about/our-team'
 * 
 * DATA FLOW:
 * 1. useParams() gets slug from URL
 * 2. useLocation() tracks route changes for scroll
 * 3. useEffect scrolls to top when route or slug changes
 * 4. DynamicPage fetches all data and passes to children
 * 5. AboutDetailsContent uses slug to find the specific content
 * 
 * ============================================
 */

// React
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// Components
import DynamicPage from '../DynamicPage';
import AboutDetailsContent from './AboutDetailsContent';

/**
 * AboutDetails Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered about detail page
 */
export default function AboutDetails(props) {
  // Get the slug from the URL (e.g., /about/our-mission → 'our-mission')
  const { slug } = useParams();

  // Get current location for scroll tracking
  const location = useLocation();

  // ============================================
  // SCROLL TO TOP ON PAGE LOAD
  // ============================================
  /**
   * Smoothly scrolls to top when:
   * - Page first loads
   * - User navigates to a different about sub-page
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, slug]);

  /**
   * Render DynamicPage with AboutDetailsContent as child
   * 
   * DynamicPage handles:
   * - Data fetching (about content, shared data, etc.)
   * - Layout (TopBar, Navbar, Footer)
   * - SEO metadata
   * 
   * AboutDetailsContent handles:
   * - Finding the correct content by slug
   * - Rendering content sections
   */
  return (
    <DynamicPage {...props} slug={slug}>
      <AboutDetailsContent {...props} slug={slug} />
    </DynamicPage>
  );
}