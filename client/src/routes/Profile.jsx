import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';
import ProfileHeader from '../components/profile/ProfileHeader';
import SocialLinks from '../components/profile/SocialLinks';
import ProfileSections from '../components/profile/ProfileSections';
import ActivitySection from '../components/profile/ActivitySection';
import { Mail, MapPin, Calendar, Phone, User, Clock } from 'lucide-react';
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backend_URL}/auth/profile`, { 
        withCredentials: true 
      });
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError('Failed to load profile');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useSidebarLayout(true);

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/profile/update`,
        updatedData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setProfile(prevProfile => ({
          ...prevProfile,
          ...response.data.data
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="space-y-6 text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-blue-600" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full backdrop-blur-sm bg-white/90">
            <div className="text-red-500 mb-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Error Loading Profile</h3>
            <p className="text-gray-600 text-center mb-8">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Return to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="relative h-35 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)]" style={{ backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="relative px-8 py-10 -mt-27">
              <div className="relative z-10">
                <ProfileHeader 
                  profile={profile} 
                  onProfileUpdate={handleProfileUpdate}
                />
                
                {/* Contact Information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {profile.email && (
                    <div className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  {/* New Personal Email Section */}
                  {profile.personalEmail && (
  <div className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <Mail className="w-5 h-5 text-blue-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500">Personal Email</p>
      <p 
        className="text-sm font-semibold text-gray-900 truncate"
        title={profile.personalEmail} // Added tooltip
      >
        {profile.personalEmail}
      </p>
    </div>
  </div>
)}
                  
                  {profile.location && (
                    <div className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{profile.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.phone && (
                    <div className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm font-semibold text-gray-900">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.joinDate && (
                    <div className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Joined</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(profile.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rest of the components remain the same */}
                <div className="mt-8">
                  {profile.socialLinks && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span>Social Profiles</span>
                      </h3>
                      <SocialLinks socialLinks={profile.socialLinks} />
                    </div>
                  )}
                </div>

                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
                  <ProfileSections profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;