// dus-frontend/src/Layout/PublicLayout.jsx

// Components
import Navbar from '../Shared/Navbar';
import TopBar from '../Shared/TopBar';
import Footer from '../Shared/Footer';

const PublicLayout = ({ children, topBarData, navbarData, footerData, storageUrl }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TopBar */}
      <TopBar topBarData={topBarData} storageUrl={storageUrl} />

      {/* Navbar */}
      <Navbar navbarData={navbarData} />

      {/* Main Content */}
      <main className="grow">
        {children}
      </main>

      {/* Footer - storageUrl not needed by Footer, remove it */}
      <Footer footerData={footerData} />
    </div>
  );
};

export default PublicLayout;