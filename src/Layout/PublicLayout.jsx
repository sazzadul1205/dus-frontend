// dus-frontend/src/Layout/PublicLayout.jsx

/**
 * ============================================
 * PUBLIC LAYOUT - Main Layout Wrapper
 * ============================================
 * 
 * PURPOSE:
 * - Wraps all public-facing pages with consistent layout
 * - Renders TopBar, Navbar, and Footer around page content
 * - Provides layout data (TopBar, Navbar, Footer data) to child components
 * 
 * DATA FLOW:
 * 1. Receives topBarData, navbarData, footerData from parent (DynamicPage)
 * 2. Passes data to respective components
 * 3. Children (page content) are rendered in the <main> section
 * 
 * TECHNICAL NOTES:
 * - Uses flexbox for sticky footer (min-h-screen + flex + grow)
 * - storageUrl is passed to TopBar for image loading
 * - Footer doesn't need storageUrl (no images in current implementation)
 * 
 * LAYOUT STRUCTURE:
 * ┌─────────────────────────────┐
 * │  TopBar (Contact, Language) │
 * ├─────────────────────────────┤
 * │  Navbar (Main Navigation)   │
 * ├─────────────────────────────┤
 * │                             │
 * │  Page Content (children)    │
 * │  (grows to fill space)      │
 * │                             │
 * ├─────────────────────────────┤
 * │  Footer                     │
 * └─────────────────────────────┘
 * 
 * ============================================
 */

// Shared
import Navbar from '../Shared/Navbar';
import TopBar from '../Shared/TopBar';
import Footer from '../Shared/Footer';

/**
 * PublicLayout Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render
 * @param {Object} props.topBarData - Top bar configuration data
 * @param {Object} props.navbarData - Navigation bar data
 * @param {Object} props.footerData - Footer data
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Layout wrapper with header, content, and footer
 */
const PublicLayout = ({ children, topBarData, navbarData, footerData, storageUrl }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar - Contact info, language selector, search, user menu */}
      <TopBar topBarData={topBarData} storageUrl={storageUrl} />

      {/* Navigation Bar - Logo, nav links, CTA button */}
      <Navbar navbarData={navbarData} />

      {/* Main Content Area - Grows to fill available space */}
      {/* This ensures footer stays at bottom when content is short */}
      <main className="grow">
        {children}
      </main>

      {/* Footer - Links, social, newsletter, copyright */}
      {/* storageUrl not needed by Footer (no images in current implementation) */}
      <Footer footerData={footerData} />
    </div>
  );
};

export default PublicLayout;