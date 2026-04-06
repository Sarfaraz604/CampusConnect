import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AllAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // LocalStorage se user fetch karo
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  // console.log("Logged in user:", user); // Debug: Dekho user ka data aur role

  useSidebarLayout(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/announcements`);
        console.log("API Response:", response.data);
        
        // Filter ONLY achievements
        const achievementItems = response.data.filter(item => item.type === 'achievement');
        console.log("All Achievements:", achievementItems);
        
        setAchievements(achievementItems);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Error fetching achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse font-medium text-blue-600">Loading achievements...</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition"
          >
            ← Back
          </button>
        </div>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">All Achievements</h1>
            <p className="text-gray-600 mb-4">Celebrate the accomplishments of our community members.</p>
          </div>
          {/* Create Achievement button sirf alumni ke liye */}
          {user && user.role.toLowerCase() === 'alumni' && (
            <Link to="/create-achievement" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md">
              Add Achievement
            </Link>
          )}
        </div>
        
        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {achievements.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              No achievements to display.
            </div>
          ) : (
            achievements.map((achievement) => (
              <div key={achievement._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-50">
                <div className="flex items-center gap-5">
                  {achievement.imageUrl ? (
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-bold text-2xl">
                      {achievement.name?.charAt(0) || "A"}
                    </div>
                  )}
                  <div>
                    <div className="mb-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                        Achievement
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.name}</h3>
                    <p className="text-gray-600 font-normal leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllAchievements;
