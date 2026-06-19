// dus-frontend/src/pages/ProjectsAndPrograms/ProjectsAndPrograms.jsx

/**
 * ============================================
 * PROJECTS & PROGRAMS PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for the projects & programs listing page
 * - Passes all props to DynamicPage
 * 
 * WHAT THIS PAGE SHOWS:
 * - Program listing with cards
 * - Program categories
 * - Featured programs
 * - Program stats and impact
 * 
 * DATA FLOW:
 * 1. PageInfo from App.jsx → passed as props
 * 2. All props forwarded to DynamicPage
 * 3. DynamicPage fetches and renders sections
 *    - Fetches programs.json for program data
 *    - Renders OurProgramsSection component
 * 
 * PAGE SLUG: 'projects-programs'
 * ROUTE: '/projects-programs'
 * ============================================
 */

// Components
import DynamicPage from '../DynamicPage';

/**
 * Projects & Programs Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered projects & programs page via DynamicPage
 */
export default function ProjectsAndPrograms(props) {
  // Pass all props to DynamicPage
  // DynamicPage handles: data fetching, section rendering, layout
  return <DynamicPage {...props} />;
}