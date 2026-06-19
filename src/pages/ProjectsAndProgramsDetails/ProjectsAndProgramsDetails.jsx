// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

/**
 * ============================================
 * PROJECTS & PROGRAMS DETAILS PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for individual program detail pages
 * - Extracts slug from URL
 * - Scrolls to top on page load
 * - Finds program data by slug
 * - Renders ProjectsAndProgramsDetailsContent inside DynamicPage
 * 
 * URL PATTERN: '/projects-programs/:slug'
 * Example: '/projects-programs/education-program', '/projects-programs/healthcare'
 * 
 * DATA FLOW:
 * 1. useParams() gets slug from URL
 * 2. useLocation() tracks route changes for scroll
 * 3. useEffect scrolls to top when route or slug changes
 * 4. Gets programsData from props (passed by DynamicPage)
 * 5. Finds the specific program by slug
 * 6. DynamicPage wraps content with data fetching
 * 7. ProjectsAndProgramsDetailsContent renders the program
 * 
 * ============================================
 */

// React
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// Components
import DynamicPage from '../DynamicPage';
import ProjectsAndProgramsDetailsContent from './ProjectsAndProgramsDetailsContent';

/**
 * ProjectsAndProgramsDetails Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered program detail page
 */
export default function ProjectsAndProgramsDetails(props) {
  // Get the program slug from the URL
  const { slug } = useParams();

  // Get current location for scroll tracking
  const location = useLocation();

  // ============================================
  // SCROLL TO TOP ON PAGE LOAD
  // ============================================
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, slug]);

  // ============================================
  // GET PROGRAM DATA FROM PROPS
  // ============================================
  /**
   * Props from DynamicPage via React.cloneElement:
   * - programsData: Array of all programs
   * - pageData: Combined page data
   * - sectionConfigs: Section configurations
   * - storageUrl: Image storage URL
   */
  const {
    programsData = [],
    pageData = {},
    sectionConfigs = [],
    storageUrl = ''
  } = props;

  // Find the specific program by slug
  const programData = programsData.find(item => item.slug === slug);

  /**
   * Render DynamicPage with ProjectsAndProgramsDetailsContent as child
   * 
   * DynamicPage handles:
   * - Data fetching (programs, shared data, etc.)
   * - Layout (TopBar, Navbar, Footer)
   * - SEO metadata
   * 
   * ProjectsAndProgramsDetailsContent handles:
   * - Finding the correct program by slug
   * - Rendering program content
   */
  return (
    <DynamicPage {...props} programData={programData} slug={slug}>
      <ProjectsAndProgramsDetailsContent
        {...props}
        programData={programData}
        programsData={programsData}
        pageData={pageData}
        sectionConfigs={sectionConfigs}
        storageUrl={storageUrl}
        slug={slug}
      />
    </DynamicPage>
  );
}