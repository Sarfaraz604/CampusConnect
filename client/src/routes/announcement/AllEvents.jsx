import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin } from 'lucide-react';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useSidebarLayout(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/announcements`);
        console.log("API Response:", response.data);
        
        // Filter ONLY events
        const eventAnnouncements = response.data.filter(item => item.type === 'event');
        console.log("All Events:", eventAnnouncements);
        
        setEvents(eventAnnouncements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error fetching events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse font-medium text-blue-600">Loading events...</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button - Fixed to go to announcements page */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">All Events</h1>
          <p className="text-gray-600 mb-4">Browse all our upcoming and past events.</p>
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {events.length === 0 ? (
            <div className="col-span-3 bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              No events available at the moment.
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
                {event.imageUrl && (
                  <div className="h-52 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      Event
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 font-normal leading-relaxed mb-4">{event.description}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={16} className="mr-2" />
                    <span>29 Nov, 03:30pm</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin size={16} className="mr-2" />
                    <span>{event.name || "Campus Location"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllEvents;
