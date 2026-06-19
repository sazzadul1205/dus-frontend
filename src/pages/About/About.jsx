// dus-frontend/src/pages/About/About.jsx

/**
 * ============================================
 * ABOUT PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for the about page
 * - Passes all props to DynamicPage
 * 
 * WHAT THIS PAGE SHOWS:
 * - About Us section with mission, vision, values
 * - Team members
 * - History timeline
 * - Achievements and impact stats
 * 
 * DATA FLOW:
 * 1. PageInfo from App.jsx → passed as props
 * 2. All props forwarded to DynamicPage
 * 3. DynamicPage fetches and renders sections
 * 
 * PAGE SLUG: 'about'
 * ROUTE: '/about'
 * ============================================
 */

// Components
import DynamicPage from '../DynamicPage';

/**
 * About Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered about page via DynamicPage
 */
export default function About(props) {
  // Pass all props to DynamicPage
  // DynamicPage handles: data fetching, section rendering, layout
  return <DynamicPage {...props} />;
}