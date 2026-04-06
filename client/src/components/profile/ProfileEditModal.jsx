/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProfileEditModal = ({ isOpen, onClose, profile, onSubmit }) => {
  const [formData, setFormData] = useState({
    location: '',
    currentCompany: '',
    currentCompanyRole: '',
    personalEmail: '',
    socialLinks: {
      linkedin: '',
      github: '',
      instagram: '',
      x: ''
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        location: profile.location || '',
        currentCompany: profile.currentCompany || '',
        currentCompanyRole: profile.currentCompanyRole || '',
        personalEmail: profile.personalEmail || '',
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          instagram: profile.socialLinks?.instagram || '',
          x: profile.socialLinks?.x || profile.socialLinks?.twitter || ''
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [profile, isOpen]);

  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState('general');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialNetwork = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if (formData.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Please enter a valid email address';
    }

    if (tab === 'password') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = 'Password must be at least 8 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      location: formData.location,
      currentCompany: formData.currentCompany || null,
      currentCompanyRole: formData.currentCompanyRole || null,
      personalEmail: formData.personalEmail || null,
      socialLinks: formData.socialLinks
    };

    if (tab === 'password' && formData.newPassword) {
      submitData.currentPassword = formData.currentPassword;
      submitData.newPassword = formData.newPassword;
    }

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${tab === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('password')}
          >
            Change Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'general' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                   <label className="block text-sm font-medium text-gray-700">Personal Email</label>
                    <input
                     type="email"
                     name="personalEmail"
                     value={formData.personalEmail}
                     onChange={handleInputChange}
                     placeholder="your@personal-email.com"
                     className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                   />
                   {errors.personalEmail && (
                     <p className="text-red-500 text-sm mt-1">{errors.personalEmail}</p>
                   )}
                   <p className="text-sm text-gray-500 mt-1">
                     This email will be displayed on your profile alongside your primary email
                   </p>
                 </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="currentCompanyRole"
                  value={formData.currentCompanyRole}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Social Links</h3>
                {Object.entries({
                  linkedin: 'LinkedIn',
                  github: 'GitHub',
                  instagram: 'Instagram',
                  x: 'X (Twitter)'
                }).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="text"
                      name={`social.${key}`}
                      value={formData.socialLinks[key]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
