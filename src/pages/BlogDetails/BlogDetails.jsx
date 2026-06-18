// dus-frontend/src/pages/BlogDetails/BlogDetails.jsx

// React
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Dynamic Page 
import DynamicPage from '../DynamicPage';

// Components
import BlogDetailsContent from './BlogDetailsContent';

export default function BlogDetails(props) {
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

  // Pass props to DynamicPage with children
  return (
    <DynamicPage {...props} slug={slug}>
      <BlogDetailsContent {...props} slug={slug} />
    </DynamicPage>
  );
}