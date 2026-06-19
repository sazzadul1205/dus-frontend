// dus-frontend/src/Sections/FAQSection/FAQSection.jsx

/**
 * ============================================
 * FAQ SECTION - Accordion FAQ Component
 * ============================================
 * 
 * PURPOSE:
 * - Displays frequently asked questions in an accordion format
 * - Users can click to expand/collapse answers
 * - One answer open at a time (accordion behavior)
 * 
 * DATA STRUCTURE:
 * {
 *   section: { title, subtitle },
 *   faqs: [
 *     { id, question, answer }
 *   ]
 * }
 * 
 * FEATURES:
 * - Accordion with smooth expand/collapse animation
 * - + / - toggle icons
 * - Color change on open (brand color)
 * - Responsive padding and sizing
 * - First FAQ open by default
 * 
 * ============================================
 */

import { useState } from 'react';

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
 * FAQSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - FAQ data with section and faqs
 * @param {string} props.bgColor - Background color (default: 'bg-[#F5F5F5]')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'faq')
 * @param {number} props.defaultOpenId - ID of FAQ to open by default (default: 1)
 * 
 * @returns {JSX.Element} Rendered FAQ section
 */
const FAQSection = ({
  data,
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-10 sm:py-15 md:py-20 lg:py-37.5',
  paddingX = 'px-4 sm:px-6 md:px-10 lg:px-20 xl:px-50',
  sectionClassName = '',
  sectionId = 'faq',
  defaultOpenId = 1,
}) => {
  // ============================================
  // STATE - Track which FAQ is open
  // ============================================
  const [openId, setOpenId] = useState(defaultOpenId);

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(data)) {
    return null;
  }

  // ============================================
  // DESTRUCTURE DATA
  // ============================================
  const { section = {}, faqs = [] } = data;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasTitle = hasValue(section?.title);
  const hasSubtitle = hasValue(section?.subtitle);
  const hasFaqs = hasValue(faqs);

  const hasAnyContent = hasTitle || hasSubtitle || hasFaqs;

  if (!hasAnyContent) {
    return null;
  }

  // ============================================
  // HANDLERS
  // ============================================
  /**
   * Toggle FAQ open/closed
   * If clicking the same FAQ, close it
   * If clicking a different FAQ, open it and close the others
   */
  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* ============================================
          HEADER - Title and Subtitle
          ============================================ */}
      <div className='max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center'>
        {/* Title */}
        {hasTitle && (
          <h1 className='font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight mb-3 sm:mb-4 bricolage-grotesque'>
            {section.title}
          </h1>
        )}

        {/* Subtitle */}
        {hasSubtitle && (
          <p className='text-[#333333] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed bricolage-grotesque px-2 sm:px-4'>
            {section.subtitle}
          </p>
        )}
      </div>

      {/* ============================================
          FAQ LIST - Accordion
          ============================================ */}
      {hasFaqs && (
        <div className='mt-8 sm:mt-10 md:mt-12 lg:mt-15 space-y-2 sm:space-y-2.5 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto'>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const hasQuestion = hasValue(faq.question);
            const hasAnswer = hasValue(faq.answer);

            // Skip rendering if FAQ has no question or answer
            if (!hasQuestion && !hasAnswer) return null;

            return (
              <div key={faq.id} className='bg-white w-full rounded-lg overflow-hidden shadow-sm transition-all duration-300'>
                {/* FAQ Question - Clickable header */}
                {hasQuestion && (
                  <div
                    className='py-4 sm:py-5 md:py-6 lg:py-7.5 px-4 sm:px-5 md:px-6 lg:px-7.5 cursor-pointer'
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className='flex items-start sm:items-center justify-between gap-3 sm:gap-4'>
                      <h3 className={`font-600 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[20px] leading-tight flex-1 transition-colors duration-300 ${isOpen ? 'text-[#009BE2]' : 'text-[#080C14]'
                        }`}>
                        {faq.question}
                      </h3>
                      {/* Toggle Icon - + when closed, - when open */}
                      <span className={`font-600 text-[20px] sm:text-[22px] md:text-[24px] lg:text-[24px] leading-tight shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-0 text-[#009BE2]' : 'rotate-0 text-[#080C14]'
                        }`}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                )}

                {/* FAQ Answer - With smooth expand/collapse animation */}
                {hasAnswer && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className='px-4 sm:px-5 md:px-6 lg:px-7.5 pb-4 sm:pb-5 md:pb-6 lg:pb-7.5'>
                      <p className='text-[#333333] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-relaxed bricolage-grotesque'>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FAQSection;