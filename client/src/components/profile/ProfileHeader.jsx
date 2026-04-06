/* eslint-disable react/prop-types */
// eslint-disable react/prop-types 
import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import LogoutButton from './LogoutButton';
import ProfileEditModal from './ProfileEditModal';
import axios from 'axios'; 

const ProfileHeader = ({ profile, onProfileUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSubmit = async (formData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/profile/update`, // ✅ Correct interpolation
        formData,
        { withCredentials: true }
      );
      

      if (response.data) {
        onProfileUpdate(response.data);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D8ABC&color=fff`}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:ml-4 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-white">{profile.email}</p>
            {profile.role && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <LogoutButton />
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default ProfileHeader;