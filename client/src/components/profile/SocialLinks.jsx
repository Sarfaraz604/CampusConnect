/* eslint-disable react/prop-types */
import React from 'react';
import { FaLinkedin, FaInstagram, FaGithub, FaTwitter } from 'react-icons/fa';

const SocialLinks = ({ socialLinks }) => {
  if (!socialLinks) return null;

  const socialIcons = [
    { key: 'linkedin', icon: <FaLinkedin className="text-blue-600" />, url: socialLinks.linkedin },
    { key: 'github', icon: <FaGithub className="text-gray-800" />, url: socialLinks.github },
    { key: 'instagram', icon: <FaInstagram className="text-pink-600" />, url: socialLinks.instagram },
    { key: 'x', icon: <FaTwitter className="text-blue-400" />, url: socialLinks.x || socialLinks.twitter }
  ].filter(item => item.url && item.url.trim() !== '');

  if (socialIcons.length === 0) return null;

  return (
    <div className="flex space-x-4 mt-4">
      {socialIcons.map(({ key, icon, url }) => (
        <a 
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:opacity-80 transition"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
