// client/src/components/network/People.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';

const People = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/alumni`);
        // If response.data is an object with a 'data' property, use that.
        const alumniData = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setAlumni(alumniData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching alumni profiles');
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  if (loading) return <div>Loading alumni profiles...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Show just a few alumni (e.g., 3)
  const previewAlumni = alumni.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect and Connect</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {previewAlumni.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} />
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate('/network/all-people')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default People;
