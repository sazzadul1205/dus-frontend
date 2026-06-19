// src/hooks/useAxiosPublic.js

/**
 * ============================================
 * useAxiosPublic - Public API Client Hook
 * ============================================
 *
 * PURPOSE:
 * - Creates and returns an Axios instance for public API calls
 * - Configured with the base URL for public data
 * - No authentication required (public endpoints)
 *
 * USAGE:
 * const axiosPublic = useAxiosPublic();
 * const response = await axiosPublic.get('pages.json');
 *
 * BASE URL: http://localhost:5174/public/data/
 *
 * DATA FILES AVAILABLE:
 * - pages.json - Page configurations
 * - section_configs.json - Section configurations
 * - shared_data.json - TopBar, Navbar, Footer data
 * - custom_section_data.json - Section-specific data
 * - programs.json - Programs data
 * - blogs.json - Blog posts data
 * - about_content.json - About content data
 *
 * TECHNICAL NOTES:
 * - This is a simple wrapper around axios.create()
 * - No interceptors or authentication logic needed
 * - For authenticated API calls, use useAxiosSecure instead
 *
 * ============================================
 */

// Axios
import axios from "axios";

/**
 * Creates an Axios instance with public API base URL
 *
 * @returns {AxiosInstance} Configured Axios instance
 */
export default () => {
  const axiosPublic = axios.create({
    baseURL: "http://localhost:5174/public/data/",
  });
  return axiosPublic;
};
