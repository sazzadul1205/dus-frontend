// dus-frontend/src/pages/ContactUs/ContactUs.jsx

/**
 * ============================================
 * CONTACT US PAGE
 * ============================================
 * 
 * PURPOSE:
 * - Entry point for the contact page
 * - Passes all props to DynamicPage
 * 
 * WHAT THIS PAGE SHOWS:
 * - Contact form
 * - Office addresses
 * - Phone numbers and email
 * - Map location
 * - Social media links
 * 
 * DATA FLOW:
 * 1. PageInfo from App.jsx → passed as props
 * 2. All props forwarded to DynamicPage
 * 3. DynamicPage fetches and renders sections
 *    - ContactReachSection (contact form)
 *    - ContactOfficeSection (office addresses)
 *    - AddressSection (map location)
 * 
 * PAGE SLUG: 'contact'
 * ROUTE: '/contact'
 * ============================================
 */

// Components
import DynamicPage from '../DynamicPage';

/**
 * Contact Us Page Component
 * 
 * @param {Object} props - Props from App.jsx (pageInfo, etc.)
 * @returns {JSX.Element} Rendered contact page via DynamicPage
 */
export default function ContactUs(props) {
  // Pass all props to DynamicPage
  // DynamicPage handles: data fetching, section rendering, layout
  return <DynamicPage {...props} />;
}