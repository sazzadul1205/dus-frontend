// dus-frontend/src/pages/BlogDetails/BlogDetails.jsx

// React
import { useParams } from 'react-router-dom';

// Dynamic Page
import DynamicPage from '../DynamicPage';

// Components
import BlogDetailsContent from './BlogDetailsContent';

export default function BlogDetails(props) {
  const { slug } = useParams();

  // Pass props to DynamicPage with children
  return (
    <DynamicPage {...props} slug={slug}>
      <BlogDetailsContent {...props} slug={slug} />
    </DynamicPage>
  );
}