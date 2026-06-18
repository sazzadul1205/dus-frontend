// dus-frontend/src/pages/AboutDetails/AboutDetails.jsx

import DynamicPage from '../DynamicPage';
import AboutDetailsContent from './AboutDetailsContent';

export default function AboutDetails(props) {
  return (
    <DynamicPage {...props}>
      <AboutDetailsContent {...props} />
    </DynamicPage>
  );
}