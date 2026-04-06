import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const CreateEvent = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form fields for creating a new event
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is actually admin on page load
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );
        if (profileRes.data.role !== 'admin') {
          alert('Access denied. Admins only.');
          return navigate('/announcements'); 
        }
        setIsAdmin(true);
      } catch (err) {
        console.error('Error checking admin role:', err);
        setError('Failed to verify admin status.');
        navigate('/announcements');
      }
    };

    checkAdminRole();
  }, [navigate]);

  // ----------------------------------
  // Create Event (POST /api/admin/announcements/event)
  // ----------------------------------
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // We'll use FormData to handle file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('venue', venue);
      formData.append('eventDateTime', eventDateTime); // date-time string
      if (image) formData.append('image', image);

      await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/admin/announcements/event`,
        formData,
        { withCredentials: true }
      );

      // Clear the form
      setTitle('');
      setDescription('');
      setVenue('');
      setEventDateTime('');
      setImage(null);

      // Show toast notification instead of alert
      showToast('Event created successfully!', 'success', 2000);
      
      // Short delay before navigation to allow the user to see the toast
      setTimeout(() => {
        navigate('/admin/announcements'); // Redirect back to announcements page
      }, 1500);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/announcements');
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse font-medium text-blue-600">Verifying admin access...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="mb-8 flex items-center">
          <button 
            onClick={handleCancel}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Create New Event</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Create Event Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="Enter venue location"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter event description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={eventDateTime}
                  onChange={e => setEventDateTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x630px</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={20} />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEvent;