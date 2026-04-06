import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const CreateAchievement = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useSidebarLayout(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );
        console.log('Fetched user profile:', response.data);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('🟢 Selected File:', file);
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('type', 'achievement');
      formData.append('title', title);
      formData.append('description', description);
      formData.append('name', user?.name || 'Anonymous'); // Logged-in user's name

      if (image) {
        formData.append('image', image);
      }

      console.log('🟢 Form Data Before Sending:', Object.fromEntries(formData.entries()));

      // ✅ Changed URL from "/add" to "/achievement"
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/announcements/achievement`,
        formData,
        { withCredentials: true }
      );

      console.log('✅ Achievement Created Successfully:', response.data);
      navigate('/announcements');
    } catch (err) {
      console.error('❌ Error creating achievement:', err.response?.data || err.message);
      setError('Failed to create achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create a New Achievement</h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Achievement Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Write your achievement description..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Creating...' : 'Create Achievement'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAchievement;
