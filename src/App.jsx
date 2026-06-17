// dus-frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Blogs from './pages/Blogs/Blogs';
import ContactUs from './pages/ContactUs/ContactUs';
import ProjectsAndPrograms from './pages/ProjectsAndPrograms/ProjectsAndPrograms';
import BlogDetails from './pages/BlogDetails/BlogDetails';
import ProjectsAndProgramsDetails from './pages/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails';
import AboutDetails from './pages/AboutDetails/AboutDetails';

// Note: You'll need to create these pages or adjust imports
// import Jobs from './pages/Jobs/Jobs';
// import FAQ from './pages/FAQ/FAQ';

function App() {
  // In a real app, you'd fetch this data from an API
  // For now, we'll use placeholder data
  const pageProps = {
    topbarData: {},
    navbarData: {},
    footerData: {},
    storageUrl: import.meta.env.VITE_STORAGE_URL || '',
    sectionConfig: { sections: [] },
  };

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home {...pageProps} />} />
          <Route path="/about" element={<About {...pageProps} />} />
          <Route path="/about/:slug" element={<AboutDetails {...pageProps} />} />
          <Route path="/blogs" element={<Blogs {...pageProps} />} />
          <Route path="/blog/:slug" element={<BlogDetails {...pageProps} />} />
          <Route path="/contact" element={<ContactUs {...pageProps} />} />
          <Route path="/programs" element={<ProjectsAndPrograms {...pageProps} />} />
          <Route path="/programs/:slug" element={<ProjectsAndProgramsDetails {...pageProps} />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;