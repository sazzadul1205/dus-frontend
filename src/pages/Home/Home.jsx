// dus-frontend/src/pages/Home/Home.jsx

/**
 * ============================================
 * HOME PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for the home page
 * - Simply passes all props to DynamicPage
 * - DynamicPage handles all data fetching and rendering
 * 
 * WHY THIS FILE EXISTS:
 * - Clean separation: Each page has its own file
 * - Easy to add page-specific logic later (e.g., custom hooks)
 * - Follows the pattern used for all pages
 * 
 * DATA FLOW:
 * 1. PageInfo from App.jsx → passed as props
 * 2. All props forwarded to DynamicPage
 * 3. DynamicPage fetches and renders sections
 * 
 * ADDING PAGE-SPECIFIC LOGIC:
 * If you need custom logic for the home page, add it here:
 * 
 * export default function Home(props) {
 *   const customData = useCustomHook();
 *   return <DynamicPage {...props} customData={customData} />;
 * }
 * ============================================
 */

// Components
import DynamicPage from '../DynamicPage';

/**
 * Home Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered home page via DynamicPage
 */
export default function Home(props) {
  // Pass all props to DynamicPage
  // DynamicPage handles: data fetching, section rendering, layout
  return <DynamicPage {...props} />;
}