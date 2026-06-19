// dus-frontend/src/Shared/TopBar.jsx

// Icons - Import all needed icons
import { FiSearch } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaUser } from "react-icons/fa6";

// React
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Image Component with Fallback
import ImageWithFallback from './ImageWithFallback';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// Map icon names to components
const iconMap = {
  FaFacebook: FaFacebook,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
  FaXTwitter: FaXTwitter
};

const TopBar = ({ topBarData, storageUrl = '', auth }) => {
  const user = auth?.user;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const langRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  const getInitialLanguage = () => {
    if (!hasValue(topBarData)) {
      return {
        code: 'us',
        name: 'English',
        flag: `${storageUrl}/images/Flags/united-states.png`
      };
    }

    const { languages = [] } = topBarData;
    const languagesToShow = languages.filter(lang =>
      lang.code === 'us' || lang.code === 'bd'
    );

    try {
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang) {
        const parsedLang = JSON.parse(savedLang);
        const existsInData = languagesToShow.find(lang => lang.code === parsedLang.code);
        if (existsInData) return parsedLang;
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
    }

    const englishLang = languagesToShow.find(lang => lang.code === 'us');
    return englishLang || languagesToShow[0] || {
      code: 'us',
      name: 'English',
      flag: `${storageUrl}/images/Flags/united-states.png`
    };
  };

  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  if (!hasValue(topBarData)) return null;

  const {
    contactInfo = {},
    languages = [],
    socialLinks = [],
    userMenu = {}
  } = topBarData;

  const defaultUserMenu = {
    guest: [
      { label: 'Login', route: '/login', type: 'link' },
      { label: 'Register', route: '/register', type: 'link' }
    ],
    authenticated: [
      { divider: true },
      { label: 'Dashboard', route: '/dashboard', type: 'link' },
      { label: 'Logout', type: 'button', action: 'logout' }
    ]
  };

  const finalUserMenu = hasValue(userMenu) ? userMenu : defaultUserMenu;
  const languagesToShow = languages.filter(lang =>
    lang.code === 'us' || lang.code === 'bd'
  );

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
    setIsLangDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  const hasContactInfo = hasValue(contactInfo.email?.text) ||
    hasValue(contactInfo.phone?.text) ||
    hasValue(contactInfo.hours?.text);

  const hasSocialLinks = hasValue(socialLinks);
  const hasLanguages = hasValue(languagesToShow);

  if (!hasContactInfo && !hasSocialLinks && !hasLanguages) return null;

  return (
    <>
      {/* Desktop Top Bar */}
      <div className='hidden lg:flex justify-between items-center px-10 py-3 bg-[#080C14] relative z-50'>
        {hasContactInfo && (
          <div className='flex items-center space-x-6'>
            {hasValue(contactInfo.email?.text) && (
              <div className='flex items-center space-x-2'>
                {hasValue(contactInfo.email?.icon) && (
                  <ImageWithFallback
                    src={getImageSrc(contactInfo.email.icon)}
                    alt={contactInfo.email.alt || 'Email'}
                    fallbackType="default"
                    className="w-4 h-4"
                  />
                )}
                <a href={`mailto:${contactInfo.email.text}`} className='text-white text-sm hover:text-[#009BE2] transition-colors'>
                  {contactInfo.email.text}
                </a>
              </div>
            )}

            {hasValue(contactInfo.phone?.text) && (
              <div className='flex items-center space-x-2'>
                {hasValue(contactInfo.phone?.icon) && (
                  <ImageWithFallback
                    src={getImageSrc(contactInfo.phone.icon)}
                    alt={contactInfo.phone.alt || 'Phone'}
                    fallbackType="default"
                    className="w-4 h-4"
                  />
                )}
                <a href={`tel:${contactInfo.phone.text.replace(/\s/g, '')}`} className='text-white text-sm hover:text-[#009BE2] transition-colors'>
                  {contactInfo.phone.text}
                </a>
              </div>
            )}

            {hasValue(contactInfo.hours?.text) && (
              <div className='flex items-center space-x-2'>
                {hasValue(contactInfo.hours?.icon) && (
                  <ImageWithFallback
                    src={getImageSrc(contactInfo.hours.icon)}
                    alt={contactInfo.hours.alt || 'Hours'}
                    fallbackType="default"
                    className="w-4 h-4"
                  />
                )}
                <p className='text-white text-sm'>{contactInfo.hours.text}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 space-x-4">
          {hasLanguages && (
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsUserDropdownOpen(false);
                }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Select language"
              >
                {hasValue(selectedLanguage?.flag) && (
                  <ImageWithFallback
                    src={getImageSrc(selectedLanguage.flag)}
                    alt={selectedLanguage.name}
                    fallbackType="flag"
                    className="w-5 h-5"
                  />
                )}
                <span className="text-white text-sm hidden md:inline">{selectedLanguage.name}</span>
                {isLangDropdownOpen ? <FaAngleUp className="text-white transition-transform duration-200" /> : <FaAngleDown className="text-white transition-transform duration-200" />}
              </button>

              <div
                className={`absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg py-2 w-40 z-50 transition-all duration-300 origin-top-right
                  ${isLangDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
              >
                {languagesToShow.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors duration-150 ${selectedLanguage.code === lang.code ? 'bg-blue-50' : ''
                      }`}
                  >
                    <ImageWithFallback
                      src={getImageSrc(lang.flag)}
                      alt={lang.name}
                      fallbackType="flag"
                      className="w-5 h-5"
                    />
                    <span className={`text-sm ${selectedLanguage.code === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {lang.name}
                    </span>
                    {selectedLanguage.code === lang.code && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasLanguages && (hasSocialLinks || hasContactInfo) && (
            <div className="w-px h-5 bg-gray-600"></div>
          )}

          <div className="relative" ref={searchRef}>
            <div className="overflow-hidden">
              <div className={`transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-64 opacity-100' : 'w-6 opacity-100'}`}>
                {isSearchExpanded ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center animate-slideIn">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ..."
                      className="px-3 py-1 rounded-l-md text-sm focus:outline-none text-white focus:ring-1 focus:ring-[#009BE2] w-full bg-gray-700"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-[#009BE2] px-3 py-1 rounded-r-md hover:bg-[#009BE2]/80 transition-colors duration-200"
                    >
                      <FiSearch className="text-white text-sm" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="flex items-center hover:opacity-80 transition-opacity duration-200"
                    aria-label="Search"
                  >
                    <FiSearch className="text-xl text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-gray-600"></div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsLangDropdownOpen(false);
              }}
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
              aria-label="User menu"
            >
              <FaUser className="text-xl text-white" />
            </button>

            <div
              className={`absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg py-2 w-48 z-50 transition-all duration-300 origin-top-right
                ${isUserDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            >
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {finalUserMenu.authenticated?.map((item, index) => (
                    item.divider ? (
                      <div key={index} className="border-t border-gray-200 my-1"></div>
                    ) : item.type === 'link' ? (
                      <Link
                        key={index}
                        to={item.route}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : item.type === 'button' && item.action === 'logout' ? (
                      <button
                        key={index}
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                      >
                        {item.label}
                      </button>
                    ) : null
                  ))}
                </>
              ) : (
                finalUserMenu.guest?.map((item) => (
                  <Link
                    key={item.label}
                    to={item.route}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))
              )}
            </div>
          </div>

          {hasSocialLinks && <div className="w-px h-5 bg-gray-600"></div>}

          {hasSocialLinks && socialLinks.map((social) => {
            const IconComponent = iconMap[social.iconName];
            if (!IconComponent) return null;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xl text-white ${social.hoverColor || ''} transition-all duration-200 hover:scale-110`}
                aria-label={social.name}
              >
                <IconComponent />
              </a>
            );
          })}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className='lg:hidden bg-[#080C14] px-4 py-2 relative z-50'>
        <div className='flex justify-between items-center'>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-150 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className="space-y-4 pb-4">
            {hasContactInfo && (
              <div className="space-y-3">
                {hasValue(contactInfo.email?.text) && (
                  <a href={`mailto:${contactInfo.email.text}`} className="flex items-center gap-2 text-white text-sm hover:text-[#009BE2] transition-colors">
                    {hasValue(contactInfo.email?.icon) && (
                      <ImageWithFallback
                        src={getImageSrc(contactInfo.email.icon)}
                        alt={contactInfo.email.alt || 'Email'}
                        fallbackType="default"
                        className="w-4 h-4"
                      />
                    )}
                    <span>{contactInfo.email.text}</span>
                  </a>
                )}

                {hasValue(contactInfo.phone?.text) && (
                  <a href={`tel:${contactInfo.phone.text.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white text-sm hover:text-[#009BE2] transition-colors">
                    {hasValue(contactInfo.phone?.icon) && (
                      <ImageWithFallback
                        src={getImageSrc(contactInfo.phone.icon)}
                        alt={contactInfo.phone.alt || 'Phone'}
                        fallbackType="default"
                        className="w-4 h-4"
                      />
                    )}
                    <span>{contactInfo.phone.text}</span>
                  </a>
                )}

                {hasValue(contactInfo.hours?.text) && (
                  <div className="flex items-center gap-2 text-white text-sm">
                    {hasValue(contactInfo.hours?.icon) && (
                      <ImageWithFallback
                        src={getImageSrc(contactInfo.hours.icon)}
                        alt={contactInfo.hours.alt || 'Hours'}
                        fallbackType="default"
                        className="w-4 h-4"
                      />
                    )}
                    <span>{contactInfo.hours.text}</span>
                  </div>
                )}
              </div>
            )}

            {hasContactInfo && <div className="border-t border-gray-700"></div>}

            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-2 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-[#009BE2] bg-white"
              />
              <button
                type="submit"
                className="bg-[#009BE2] px-3 py-2 rounded-r-md hover:bg-[#009BE2]/80 transition-colors duration-200"
              >
                <FiSearch className="text-white text-sm" />
              </button>
            </form>

            <div className="border-t border-gray-700"></div>

            {hasLanguages && (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Language</span>
                    <button
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      className="flex items-center gap-2"
                    >
                      <ImageWithFallback
                        src={getImageSrc(selectedLanguage.flag)}
                        alt={selectedLanguage.name}
                        fallbackType="flag"
                        className="w-5 h-5"
                      />
                      <span className="text-white text-sm">{selectedLanguage.name}</span>
                      {isLangDropdownOpen ? <FaAngleUp className="text-white" /> : <FaAngleDown className="text-white" />}
                    </button>
                  </div>

                  {isLangDropdownOpen && (
                    <div className="mt-2 bg-white rounded-md shadow-lg py-2">
                      {languagesToShow.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang)}
                          className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors duration-150 ${selectedLanguage.code === lang.code ? 'bg-blue-50' : ''
                            }`}
                        >
                          <ImageWithFallback
                            src={getImageSrc(lang.flag)}
                            alt={lang.name}
                            fallbackType="flag"
                            className="w-5 h-5"
                          />
                          <span className={`text-sm ${selectedLanguage.code === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                            {lang.name}
                          </span>
                          {selectedLanguage.code === lang.code && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700"></div>
              </>
            )}

            <div>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 text-white text-sm w-full"
              >
                <FaUser className="text-white" />
                <span>Account</span>
                {isUserDropdownOpen ? <FaAngleUp className="text-white ml-auto" /> : <FaAngleDown className="text-white ml-auto" />}
              </button>

              {isUserDropdownOpen && (
                <div className="mt-2 bg-white rounded-md shadow-lg py-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {finalUserMenu.authenticated?.map((item, index) => (
                        item.divider ? (
                          <div key={index} className="border-t border-gray-200 my-1"></div>
                        ) : item.type === 'link' ? (
                          <Link
                            key={index}
                            to={item.route}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {item.label}
                          </Link>
                        ) : item.type === 'button' && item.action === 'logout' ? (
                          <button
                            key={index}
                            onClick={() => {
                              handleLogout();
                              setIsUserDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            {item.label}
                          </button>
                        ) : null
                      ))}
                    </>
                  ) : (
                    finalUserMenu.guest?.map((item) => (
                      <Link
                        key={item.label}
                        to={item.route}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {hasSocialLinks && <div className="border-t border-gray-700"></div>}

            {hasSocialLinks && (
              <div className="flex justify-center gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.iconName];
                  if (!IconComponent) return null;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white text-xl ${social.hoverColor || ''} transition-all duration-200`}
                      aria-label={social.name}
                    >
                      <IconComponent />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default TopBar;