// dus-frontend/src/Sections/ContactOfficeSection/ContactOfficeSection.jsx

/**
 * ============================================
 * CONTACT OFFICE SECTION - Office Contact Cards
 * ============================================
 * 
 * PURPOSE:
 * - Displays office contact information in card format
 * - Shows address, phone numbers, and emails
 * - Used on the Contact Us page
 * 
 * DATA STRUCTURE:
 * {
 *   title: "Our Offices",
 *   orgName: "Dwip Unnayan Songstha (DUS)",
 *   offices: [
 *     {
 *       title: "Head Office",
 *       icon: "image-url.png",
 *       address: "123 Main St, Dhaka",
 *       phones: "+880 1234 567890",
 *       emails: ["info@dus.org.bd", "admin@dus.org.bd"]
 *     }
 *   ]
 * }
 * - OR -
 * [ { title, address, phones, emails }, ... ]
 * 
 * FEATURES:
 * - Grid layout (1, 2, or 3 columns)
 * - Office icons (custom or default graduation cap)
 * - Hover animations (lift + shadow)
 * - Email links (mailto:)
 * 
 * ============================================
 */

import { FaGraduationCap } from 'react-icons/fa';

// ============================================
// UTILITY: Check if value exists
// ============================================
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * ContactOfficeSection Component
 * 
 * @param {Object} props
 * @param {Object|Array} props.data - Office data (object with offices OR direct array)
 * @param {string} props.bgColor - Background color (default: 'bg-white')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'contact-offices')
 * 
 * @returns {JSX.Element} Rendered contact offices section
 */
const ContactOfficeSection = ({
  data,
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-14 lg:py-37.5',
  paddingX = 'px-4 sm:px-6 lg:px-50',
  sectionClassName = '',
  sectionId = 'contact-offices',
}) => {
  // ============================================
  // NORMALIZE DATA - Handle both formats
  // ============================================
  let offices = [];
  let title = "Our Offices";
  let orgName = "Dwip Unnayan Songstha (DUS)";

  if (Array.isArray(data)) {
    offices = data;
  } else if (data && typeof data === 'object') {
    offices = data.offices || [];
    title = data.title || title;
    orgName = data.orgName || orgName;
  }

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(offices) || offices.length === 0) {
    return null;
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Get image URL with fallback for office icons
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/60x60/009BE2/FFFFFF?text=Office';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`${bgColor} ${sectionClassName}`}
    >
      <div className={`mx-auto ${paddingX} ${paddingY}`}>
        {/* Section Title */}
        {hasValue(title) && (
          <h2 className="text-[#1D2566] font-bold text-[28px] sm:text-[32px] lg:text-[36px] leading-tight pb-6 sm:pb-8 lg:pb-12.5 text-center sm:text-left">
            {title}
          </h2>
        )}

        {/* Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {offices.map((office, index) => (
            <div
              key={office.title || index}
              className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 md:p-10 lg:p-12.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Office Icon */}
              {office.icon ? (
                <img
                  src={getImageUrl(office.icon)}
                  alt={office.title || "Office icon"}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <FaGraduationCap className="text-4xl text-[#009BE2]" />
              )}

              {/* Office Title */}
              {hasValue(office.title) && (
                <h3 className="text-[22px] sm:text-[24px] font-bold text-[#080C14] pt-5">
                  {office.title}
                </h3>
              )}

              {/* Office Details */}
              <div className="space-y-2 text-[14px] sm:text-[15px] leading-relaxed text-[#444] mt-3">
                {/* Organization Name */}
                {hasValue(orgName) && (
                  <p className="font-semibold text-[#333333]">{orgName}</p>
                )}

                {/* Address */}
                {hasValue(office.address) && (
                  <p className="flex gap-2">
                    <span className="font-semibold text-[#333333] shrink-0">Address:</span>
                    <span>{office.address}</span>
                  </p>
                )}

                {/* Phone Numbers */}
                {hasValue(office.phones) && (
                  <p className="flex gap-2 flex-wrap">
                    <span className="font-semibold text-[#333333] shrink-0">Phone:</span>
                    <span>{office.phones}</span>
                  </p>
                )}

                {/* Emails - Clickable mailto links */}
                {hasValue(office.emails) && office.emails.length > 0 && (
                  <p className="flex gap-2 flex-wrap">
                    <span className="font-semibold text-[#333333] shrink-0">E-mail:</span>
                    <span>
                      {office.emails.map((email, idx) => (
                        <span key={idx}>
                          {idx > 0 && <span>, </span>}
                          <a
                            href={`mailto:${email}`}
                            className="text-[#444] hover:text-[#009BE2] transition-colors"
                          >
                            {email}
                          </a>
                        </span>
                      ))}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOfficeSection;