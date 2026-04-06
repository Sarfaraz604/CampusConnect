// client/src/routes/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import axios from 'axios';
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const AdminProfile = () => {
  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useSidebarLayout(true);
  // Fetch all users from /api/users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_backend_URL}/api/users`, {
        withCredentials: true,
      });
      const users = res.data;

      // Separate into alumni vs. students
      setAlumni(users.filter((u) => u.role === 'alumni'));
      setStudents(users.filter((u) => u.role === 'student'));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler: update a student's role to alumni
  const handleMarkAsAlumni = async (userId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/users/${userId}/role`,
        { role: 'alumni' },
        { withCredentials: true }
      );
      // Refresh after update
      fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading profiles...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* Alumni Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Alumni Profiles
          </h2>
          {alumni.length === 0 ? (
            <p className="text-gray-600">No alumni profiles found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full table-auto border-collapse text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Batch</th>
                    <th className="px-6 py-3 font-medium">Branch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {alumni.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.batch || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.branch || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Students Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Student Profiles
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-600">No student profiles found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full table-auto border-collapse text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Batch</th>
                    <th className="px-6 py-3 font-medium">Branch</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {students.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.batch || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.branch || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleMarkAsAlumni(user._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-xs font-medium"
                        >
                          Mark as Alumni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default AdminProfile;
