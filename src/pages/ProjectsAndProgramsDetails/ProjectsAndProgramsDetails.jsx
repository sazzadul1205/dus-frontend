// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

// React
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Dynamic Page 
import DynamicPage from '../DynamicPage';

// Components
import ProjectsAndProgramsDetailsContent from './ProjectsAndProgramsDetailsContent';

export default function ProjectsAndProgramsDetails(props) {
  const { slug } = useParams();
  const location = useLocation();

  // Scroll to top on page load and route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, slug]);

  // Get data from props (passed from DynamicPage via React.cloneElement)
  const {
    programsData = [],
    pageData = {},
    sectionConfigs = [],
    storageUrl = ''
  } = props;

  // Find the program from programsData
  const programData = programsData.find(item => item.slug === slug);

  // Pass all props including programData to the content component
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