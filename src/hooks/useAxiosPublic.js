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
 * BASE URL: Configured via .env file (VITE_PUBLIC_API_URL)
 * Default: http://localhost:5174/data/
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
 * - Environment variables must be prefixed with VITE_ for client-side access
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
    baseURL:
      import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:5174/data/",
  });
  return axiosPublic;
};
