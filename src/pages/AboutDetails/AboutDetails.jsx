// dus-frontend/src/pages/AboutDetails/AboutDetails.jsx

// React
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Dynamic Page 
import DynamicPage from '../DynamicPage';

// Components
import AboutDetailsContent from './AboutDetailsContent';

export default function AboutDetails(props) {
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

  return (
    <DynamicPage {...props} slug={slug}>
      <AboutDetailsContent {...props} slug={slug} />
    </DynamicPage>
  );
}
