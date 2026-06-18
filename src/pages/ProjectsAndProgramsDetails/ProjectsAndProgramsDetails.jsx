// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

// React
import { useParams } from 'react-router-dom';

// Dynamic Page 
import DynamicPage from '../DynamicPage';

// Components
import ProjectsAndProgramsDetailsContent from './ProjectsAndProgramsDetailsContent';

export default function ProjectsAndProgramsDetails(props) {
  const { slug } = useParams();

  // Find the program from props
  const programData = props.programsData?.find(item => item.slug === slug);

  return (
    <DynamicPage {...props} programData={programData} slug={slug}>
      <ProjectsAndProgramsDetailsContent {...props} programData={programData} />
    </DynamicPage>
  );
}