// src/components/Footer.jsx
import React from 'react';

const Footer = () => (
  <footer className="bg-gray-700">
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">IIIT Agartala</h3>
          <p className="text-gray-300">Student Networking Platform</p>
          <p className="text-gray-300">Website: www.iiitagartala.ac.in</p>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Campus</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://www.iiitagartala.ac.in/" className="text-gray-300 hover:text-white" target="_blank" rel="noreferrer">Official Website</a>
            </li>
            <li>
              <a href="https://www.iiitagartala.ac.in/recruitment.html" className="text-gray-300 hover:text-white" target="_blank" rel="noreferrer">Institute Notices</a>
            </li>
            <li>
              <a href="/login" className="text-gray-300 hover:text-white">Portal Sign In</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Address</h3>
          <p className="text-gray-300">IIIT Agartala, NIT Agartala Campus,</p>
          <p className="text-gray-300">Barjala, Jirania, Tripura (W) 799046</p>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-8">
        <p className="text-center text-gray-400">&copy; 2024 AlumConnect for IIIT Agartala. All rights reserved.</p>
      </div>
    </div>
    {/* Global styles to override default link styling */}
    {/* <style jsx global>{`
      footer a {
        color: inherit;
        text-decoration: none;
      }
      footer a:visited {
        color: inherit;
      }
    `}</style> */}
    <style jsx global>{`
      footer a {
        color: white;
        text-decoration: none;
      }
      footer a:visited {
        color: white;
      }
    `}</style>
  </footer>
);

export default Footer;
