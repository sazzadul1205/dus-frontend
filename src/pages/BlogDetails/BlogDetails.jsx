// dus-frontend/src/pages/BlogDetails/BlogDetails.jsx

// React
import { useParams } from 'react-router-dom';

// Dynamic Page
import DynamicPage from '../DynamicPage';

// Components
import BlogDetailsContent from './BlogDetailsContent';

export default function BlogDetails(props) {
  const { slug } = useParams();

  // Find the blog from props
  const blogData = props.blogsData?.find(item => item.slug === slug);

  // Parse tags if they exist
  let parsedBlogData = { ...blogData };
  if (blogData?.tags && typeof blogData.tags === 'string') {
    try {
      parsedBlogData.tags = JSON.parse(blogData.tags);
    } catch (error) {
      console.error('Error parsing blog tags:', error);
      parsedBlogData.tags = [];
    }
  }

  return (
    <DynamicPage {...props} blogData={parsedBlogData} slug={slug}>
      <BlogDetailsContent {...props} blogData={parsedBlogData} />
    </DynamicPage>
  );
}