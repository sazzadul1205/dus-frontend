// dus-frontend/src/pages/BlogDetails/BlogDetails.jsx

import DynamicPage from '../DynamicPage';
import BlogDetailsContent from './BlogDetailsContent';

export default function BlogDetails(props) {
  return (
    <DynamicPage {...props}>
      <BlogDetailsContent {...props} />
    </DynamicPage>
  );
}