// dus-frontend/src/pages/Blogs/Blogs.jsx

/**
 * ============================================
 * BLOGS PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for the blogs listing page
 * - Passes all props to DynamicPage
 * 
 * WHAT THIS PAGE SHOWS:
 * - Blog post listing with pagination
 * - Featured blog posts
 * - Blog categories/tags filter
 * - Search functionality
 * 
 * DATA FLOW:
 * 1. PageInfo from App.jsx → passed as props
 * 2. All props forwarded to DynamicPage
 * 3. DynamicPage fetches and renders sections
 *    - Fetches blogs.json for blog posts
 *    - Renders BlogSection component(s)
 * 
 * PAGE SLUG: 'blogs'
 * ROUTE: '/blogs'
 * ============================================
 */

// Components
import DynamicPage from '../DynamicPage';

/**
 * Blogs Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered blogs page via DynamicPage
 */
export default function Blogs(props) {
  // Pass all props to DynamicPage
  // DynamicPage handles: data fetching, section rendering, layout
  return <DynamicPage {...props} />;
}