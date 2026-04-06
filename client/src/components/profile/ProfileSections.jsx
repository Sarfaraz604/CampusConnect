import React from 'react';
import { FaCalendarAlt, FaHome, FaMapMarkerAlt, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import InfoItem from './InfoItem';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ProfileSections = ({ profile }) => {
  const workInfo = profile.currentCompanyRole 
    ? `${profile.currentCompanyRole} at ${profile.currentCompany || ''}`
    : profile.currentCompany || null;
  
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
        <InfoItem 
          icon={<FaCalendarAlt />} 
          label="Date of Birth" 
          value={formatDate(profile.dob)} 
        />
        <InfoItem 
          icon={<FaHome />} 
          label="Hometown" 
          value={profile.homeTown} 
        />
        <InfoItem 
          icon={<FaMapMarkerAlt />} 
          label="Current Location" 
          value={profile.location} 
        />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Academic & Professional</h2>
        <InfoItem 
          icon={<FaGraduationCap />} 
          label="Branch" 
          value={profile.branch} 
        />
        <InfoItem 
          icon={<FaGraduationCap />} 
          label="Batch" 
          value={profile.batch} 
        />
        <InfoItem 
          icon={<FaBriefcase />} 
          label="Current Work" 
          value={workInfo} 
        />
      </div>
    </div>
  );
};

export default ProfileSections;
