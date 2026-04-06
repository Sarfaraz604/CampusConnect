import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/common/Layout';
import ProfileCard from '../../components/network/ProfileCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../components/common/Pagination';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AllAlumni = () => {
  // Search state
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);

  // Filter states (original filters: batch, branch, currentCompany, location)
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [location, setLocation] = useState('');

  // Pagination & alumni data state
  const [alumni, setAlumni] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const limit = 10; // Profiles per page

  useSidebarLayout(true);

  // Fetch alumni whenever page changes
  useEffect(() => {
    fetchAlumni();
  }, [page]);

  // Debounced suggestion fetch as user types in the name search box
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (name.trim() !== '') {
        axios
          .get(`${import.meta.env.VITE_backend_URL}/api/alumni/suggestions?name=${name}`)
          .then((res) => setSuggestions(res.data))
          .catch((err) => console.error('Error fetching suggestions', err));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [name]);

  const fetchAlumni = async (pageNum = 1, extraFilters = {}) => {
    try {
      const filters = {
        name,
        batch,
        branch,
        currentCompany,
        location,
        ...extraFilters,
      };
      const queryParams = new URLSearchParams({
        page: pageNum,
        limit,
        ...filters,
      }).toString();

      const res = await axios.get(`${import.meta.env.VITE_backend_URL}/api/alumni?${queryParams}`);
      setAlumni(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    }
  };

  // Execute search: clear suggestions, blur input, and fetch results
  const executeSearch = (extraFilters = {}) => {
    setSuggestions([]);
    if (searchInputRef.current) searchInputRef.current.blur();
    fetchAlumni(1, extraFilters);
  };

  // When a suggestion is clicked, clear suggestions immediately and execute search
  const handleSuggestionClick = (suggestedName) => {
    setSuggestions([]); // Clear suggestions immediately
    setName(suggestedName);
    executeSearch({ name: suggestedName });
  };

  // Handle filter form submission (applies older filters)
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  // Listen for Enter key for search bar
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  // Clear the search bar (cross button) and show unfiltered results (retaining other filters)
  const handleClearSearch = () => {
    setName('');
    setSuggestions([]);
    executeSearch({ name: '' });
  };

  // Clear all other filters (older filters)
  const handleClearFilters = () => {
    setBatch('');
    setBranch('');
    setCurrentCompany('');
    setLocation('');
    executeSearch({ batch: '', branch: '', currentCompany: '', location: '' });
  };

  // onBlur handler to clear suggestions after a short delay (allows click events on suggestions)
  const handleBlur = () => {
    setTimeout(() => {
      setSuggestions([]);
    }, 200);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => navigate('/network')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded shadow hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">All Alumni</h1>
          <p className="text-gray-600 mb-4">Explore all our distinguished alumni profiles.</p>
          
          {/* Name Search Bar with live suggestions and clear cross button - auto */}
          <div className="relative mb-4 w-64">
            <label className="block text-gray-700 text-sm">Search by Name:</label>
            <div className="relative">
              <input 
                type="text"
                ref={searchInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder="Enter name"
                className="border border-gray-300 px-2 py-1 rounded w-full text-sm pr-10"
              />
              {name && (
                <button 
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 text-lg px-2 py-0"
                >
                  ×
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-1 rounded shadow z-10">
                {suggestions.map((suggestion) => (
                  <li 
                    key={suggestion._id}
                    onMouseDown={() => handleSuggestionClick(suggestion.name)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Original Filters for Batch, Branch, Current Company, and Location */}
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 mb-6">
            <div className="w-40">
              <label className="block text-gray-700 text-sm">Batch Year:</label>
              <input 
                type="text" 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)} 
                placeholder="e.g. 2022"
                className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
              />
            </div>
            <div className="w-40">
              <label className="block text-gray-700 text-sm">Branch:</label>
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
              >
                <option value="">All</option>
                <option value="CSE">CSE</option>
                <option value="CSD">CSD</option>
                <option value="CSH">CSH</option>
                <option value="CSA">CSA</option>
                <option value="ECE">ECE</option>
                <option value="ECI">ECI</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block text-gray-700 text-sm">Current Company:</label>
              <input 
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="Company name"
                className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
              />
            </div>
            <div className="w-40">
              <label className="block text-gray-700 text-sm">Location:</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
              />
            </div>
            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition text-sm"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition text-sm"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>
        
        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni && alumni.map((alum) => (
            <ProfileCard key={alum._id} profile={alum} />
          ))}
        </div>
        
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </Layout>
  );
};

export default AllAlumni;
