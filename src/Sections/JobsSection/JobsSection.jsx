// dus-frontend/src/Sections/JobsSection/JobsSection.jsx

/**
 * ============================================
 * JOBS SECTION - Job Listings with Filter & Search
 * ============================================
 * 
 * PURPOSE:
 * - Displays job listings with filtering and search
 * - Shows job type, department, location, title, description
 * - Filter dropdown for job types
 * - Search input for job titles and descriptions
 * - Auto-sorted by view count (most viewed first)
 * - "Apply Now" CTA for each job
 * 
 * DATA STRUCTURE:
 * {
 *   section: { title, description },
 *   filter: {
 *     options: [
 *       { value: "all", label: "Browse By" },
 *       { value: "full-time", label: "Full Time" },
 *       ...
 *     ]
 *   },
 *   jobs: [
 *     {
 *       id,
 *       type: "Full Time",
 *       department: "Program Department",
 *       location: "Dhaka",
 *       title: "Program Officer",
 *       description: "Job description text...",
 *       link: "/apply",
 *       views: 150
 *     }
 *   ]
 * }
 * 
 * FEATURES:
 * - Search input for job title/description
 * - Filter dropdown with job types
 * - Auto-sort by view count (most viewed first)
 * - Job cards with meta info (type, dept, location)
 * - "Apply Now" button with arrow icon
 * - "No jobs found" message when filtered
 * 
 * ============================================
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuBriefcaseBusiness, LuClock4 } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import ArrowIcon from '../../Shared/ArrowIcon';

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
 * JobsSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Jobs data with section, filter, jobs
 * @param {string} props.bgColor - Background color (default: 'bg-[#F5F5F5]')
 * @param {string} props.paddingY - Vertical padding
 * @param {string} props.paddingX - Horizontal padding
 * @param {string} props.sectionClassName - Additional CSS classes
 * @param {string} props.sectionId - Section ID (default: 'jobs')
 * 
 * @returns {JSX.Element} Rendered jobs section
 */
const JobsSection = ({
  data,
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-12 sm:py-16 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-75',
  sectionClassName = '',
  sectionId = 'jobs',
}) => {
  // ============================================
  // STATE - Filter and Search
  // ============================================
  const [selectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ============================================
  // DESTRUCTURE DATA (BEFORE EARLY RETURN)
  // ============================================
  const { section = {}, filter = {}, jobs = [] } = data || {};

  // ============================================
  // FILTER & SEARCH LOGIC (BEFORE EARLY RETURN)
  // ============================================
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter and search jobs - MOVED BEFORE EARLY RETURN
  const processedJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by type
    if (selectedFilter !== "" && selectedFilter !== "all") {
      result = result.filter(job =>
        job.type?.toLowerCase().trim().replace(/\s+/g, "-") === selectedFilter
      );
    }

    // Search by title or description
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(job =>
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query)
      );
    }

    // Sort by view count (most viewed first)
    result.sort((a, b) => (b.views || 0) - (a.views || 0));

    return result;
  }, [jobs, selectedFilter, searchQuery]);

  // ============================================
  // EARLY RETURN - No data (AFTER HOOKS)
  // ============================================
  if (!hasValue(data)) return null;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasTitle = hasValue(section.title);
  const hasDescription = hasValue(section.description);
  const hasFilterOptions = hasValue(filter.options);
  const hasJobs = hasValue(jobs);

  const hasAnyContent = hasTitle || hasDescription || hasFilterOptions || hasJobs;

  if (!hasAnyContent) return null;

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* ============================================
          HEADER - Title, Description, Filter & Search
          ============================================ */}
      {(hasTitle || hasDescription || hasFilterOptions) && (
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 sm:pb-10 lg:pb-15 flex-wrap gap-5'>

          {/* Left - Title and Description */}
          {(hasTitle || hasDescription) && (
            <div>
              {hasTitle && (
                <h1 className='text-[#080C14] font-800 text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] mb-3 sm:mb-4 lg:mb-5'>
                  {section.title}
                </h1>
              )}
              {hasDescription && (
                <p className='text-[#515151] font-400 text-[16px] sm:text-[18px] lg:text-[20px]'>
                  {section.description}
                </p>
              )}
            </div>
          )}

          {/* Right - Search & Filter */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto'>
            {/* Search Input */}
            <div className="relative w-full sm:min-w-64 lg:min-w-72">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full border border-[#A3A3A3] rounded-[14px] bg-[#F5F5F5] px-5 py-3 sm:py-4 pl-11 text-[14px] sm:text-[16px] font-400 text-[#515151] outline-none focus:border-[#009BE2] focus:ring-1 focus:ring-[#009BE2] transition-all duration-300"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797] text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          JOBS LIST
          ============================================ */}
      {hasJobs && (
        <div className='space-y-4 sm:space-y-5 lg:space-y-6'>
          {processedJobs.map((job) => (
            <div key={job.id} className='bg-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl hover:shadow-lg transition-all duration-300'>
              <div className='flex flex-col md:flex-row items-start justify-between gap-5'>
                {/* Job Details */}
                <div className='flex-1 w-full'>

                  {/* Job Meta Info (Type, Department, Location) */}
                  {(hasValue(job.type) || hasValue(job.department) || hasValue(job.location)) && (
                    <div className='flex items-center gap-2 sm:gap-3 text-[#524B48] text-[12px] sm:text-[14px] font-400 uppercase mb-3 flex-wrap'>

                      {/* Job Type */}
                      {hasValue(job.type) && (
                        <>
                          <p className='flex items-center gap-1 sm:gap-1.5'>
                            <LuClock4 className="text-[12px] sm:text-[14px]" />
                            {job.type}
                          </p>
                          {(hasValue(job.department) || hasValue(job.location)) && (
                            <span className='w-1 h-px bg-[#524B48] block'></span>
                          )}
                        </>
                      )}

                      {/* Department */}
                      {hasValue(job.department) && (
                        <>
                          <p className='flex items-center gap-1 sm:gap-1.5'>
                            <LuBriefcaseBusiness className="text-[12px] sm:text-[14px]" />
                            {job.department}
                          </p>
                          {hasValue(job.location) && (
                            <span className='w-1 h-px bg-[#524B48] block'></span>
                          )}
                        </>
                      )}

                      {/* Location */}
                      {hasValue(job.location) && (
                        <p className='flex items-center gap-1 sm:gap-1.5'>
                          <HiOutlineLocationMarker className="text-[12px] sm:text-[14px]" />
                          {job.location}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Job Title */}
                  {hasValue(job.title) && (
                    <h3 className='text-[#080C14] text-[22px] sm:text-[26px] md:text-[28px] lg:text-[32px] font-600 mb-2 sm:mb-3 leading-tight'>
                      {job.title}
                    </h3>
                  )}

                  {/* Job Description */}
                  {hasValue(job.description) && (
                    <p className='text-[#524B48] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-400 leading-relaxed'>
                      {job.description}
                    </p>
                  )}
                </div>

                {/* Apply Button */}
                <div className='w-full md:w-auto mt-4 md:mt-0'>
                  <Link
                    to={job.link || '#'}
                    className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-3.5 lg:py-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center justify-center gap-2 sm:gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap w-full md:w-auto"
                  >
                    Apply Now
                    <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* No Jobs Message */}
          {processedJobs.length === 0 && (
            <div className='bg-white p-8 sm:p-10 lg:p-12 rounded-2xl text-center'>
              <p className='text-[#515151] text-[16px] sm:text-[17px] lg:text-[18px] font-400'>
                {searchQuery || selectedFilter ? 'No jobs found matching your criteria.' : 'No jobs available at this time.'}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default JobsSection;