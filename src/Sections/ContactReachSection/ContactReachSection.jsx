// dus-frontend/src/Sections/ContactReachSection/ContactReachSection.jsx

/**
 * ============================================
 * CONTACT REACH SECTION - Contact Form with Image
 * ============================================
 * 
 * PURPOSE:
 * - Displays a contact form with a background image
 * - Left: Full-height image with gradient overlay
 * - Right: Contact form with name, email, phone, subject, message
 * - Used on the Contact Us page
 * 
 * DATA STRUCTURE:
 * {
 *   image: "image-path.jpg",
 *   title: "Reach out to us today!",
 *   buttonText: "Submit Message"
 * }
 * 
 * FEATURES:
 * - Two-column responsive layout
 * - Full-height image with gradient overlay
 * - Form with input fields and textarea
 * - Submit button with arrow icon
 * 
 * ============================================
 */

import ArrowIcon from '../../Shared/ArrowIcon';
import ImageWithFallback from '../../Shared/ImageWithFallback';

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
 * ContactReachSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Section data
 * @param {string} props.bgColor - Background color (default: 'bg-[#F5F5F5]')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'contact-reach')
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered contact reach section
 */
const ContactReachSection = ({
  data,
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-10 sm:py-20 lg:py-37.5',
  paddingX = 'px-6 sm:px-10 md:px-16 lg:px-20 xl:px-50',
  sectionClassName = '',
  sectionId = 'contact-reach',
  storageUrl = '',
}) => {
  // ============================================
  // DESTRUCTURE DATA
  // ============================================
  const {
    image,
    title = "Reach out to us today!",
    buttonText = "Submit Message",
  } = data || {};

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Input field styling - consistent across all form fields
   */
  const inputClassName =
    'mt-2 w-full rounded-xl border border-[#D6DCEF] bg-white px-5 py-4 text-[16px] text-[#080C14] outline-none transition-colors placeholder:text-[#A6B0D1] focus:border-[#009BE2]';

  /**
   * Build image URL with storage path
   */
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  if (!hasValue(image)) {
    console.warn('ContactReachSection: No image provided');
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`flex flex-col lg:flex-row justify-center items-stretch ${bgColor} ${sectionClassName}`}
    >
      {/* ============================================
          LEFT SECTION - Image with Gradient Overlay
          ============================================ */}
      <div className='w-full lg:w-1/2 relative'>
        {hasValue(image) && (
          <>
            <ImageWithFallback
              src={getImageSrc(image)}
              alt="Contact Reach"
              fallbackType="default"
              className="w-full h-full object-cover lg:max-h-none max-h-100"
            />
            {/* Gradient overlay for text readability */}
            <div className='absolute inset-0 bg-linear-to-b from-[#1500FF] via-[#6F07E5] to-[#F10A0A] opacity-50' />
          </>
        )}
      </div>

      {/* ============================================
          RIGHT SECTION - Contact Form
          ============================================ */}
      <div className={`w-full lg:w-1/2 ${paddingX} ${paddingY}`}>

        {/* Form Title */}
        {hasValue(title) && (
          <h3 className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-center lg:text-left'>
            {title}
          </h3>
        )}

        {/* Contact Form */}
        <form className="space-y-6 pt-6">
          {/* Name Fields - First & Last */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">First Name</span>
              <input type="text" name="first_name" placeholder="First Name" className={inputClassName} />
            </label>

            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Last Name</span>
              <input type="text" name="last_name" placeholder="Last Name" className={inputClassName} />
            </label>
          </div>

          {/* Contact Fields - Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Work Email</span>
              <input type="email" name="email" placeholder="name@company.com" className={inputClassName} />
            </label>

            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Phone Number</span>
              <input type="tel" name="phone" placeholder="+ (country code) number" className={inputClassName} />
            </label>
          </div>

          {/* Subject */}
          <label className="block">
            <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Subject</span>
            <input type="text" name="subject" placeholder="Subject" className={inputClassName} />
          </label>

          {/* Message */}
          <label className="block">
            <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Your Message</span>
            <textarea
              name="message"
              placeholder="Enter Your Message"
              rows={8}
              className={`${inputClassName} min-h-50 sm:min-h-52.5 resize-none`}
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#0999DC] px-6 py-4 sm:py-5 text-[16px] sm:text-[18px] font-semibold text-white transition-colors hover:bg-[#0789C6] flex items-center justify-center gap-2"
          >
            <span>{buttonText}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactReachSection;