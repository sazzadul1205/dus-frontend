// dus-frontend/src/pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import DynamicPage from '../DynamicPage';
import ProjectsAndProgramsDetailsContent from './ProjectsAndProgramsDetailsContent';

export default function ProjectsAndProgramsDetails(props) {
  return (
    <DynamicPage {...props}>
      <ProjectsAndProgramsDetailsContent {...props} />
    </DynamicPage>
  );
}