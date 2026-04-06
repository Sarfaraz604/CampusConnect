// client/src/components/network/ProfileCard.jsx
import React from 'react';
import { FaCommentDots } from 'react-icons/fa';
import SocialLinks from '../profile/SocialLinks';

const ProfileCard = ({ profile }) => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Top Section: Avatar + Basic Info */}
        <div className="flex p-4 items-center">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D8ABC&color=fff`}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.name}
            </h2>
            <p className="text-gray-500">
              {profile.branch} • Batch {profile.batch}
            </p>
          </div>
        </div>
  
        {/* Bottom Section: Location, Work, Socials, and "Message" Button */}
        <div className="px-4 pb-4">
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Location:</span> {profile.location}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Current Work:</span>{' '}
            {profile.currentCompanyRole
              ? `${profile.currentCompanyRole} at ${profile.currentCompany}`
              : profile.currentCompany}
          </p>
          <div className="mt-2">
            <SocialLinks socialLinks={profile.socialLinks} />
          </div>
          <button
            className="mt-4 inline-flex items-center text-blue-600 hover:underline"
            // onClick={() => { /* messaging functionality here */ }}
          >
            <FaCommentDots className="mr-1" />
            Message
          </button>
        </div>
      </div>
    );
  };
  
  export default ProfileCard;

