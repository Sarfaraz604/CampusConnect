// src/components/Services.jsx
import React from 'react';
import { Bell, Users, MessageCircle, Search, Gift } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "Announcements",
      description:
        "Stay updated with live announcements on reunions, alumni success stories, upcoming workshops, guest lectures, and college events. Get notified about how alumni can participate in these occasions, fostering a strong, connected community.",
      icon: <Bell className="w-6 h-6" />,
    },
    {
      title: "Networking Hub",
      description:
        "Our platform enables alumni to connect with fellow graduates, share professional achievements, job promotions, and opportunities. Whether you're looking for referrals or seeking like-minded individuals to launch a startup, our hub has you covered.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Guidance and Mentorship",
      description:
        "Students can access personalized guidance from alumni through secure, encrypted messages. Whether it's career advice or general mentorship, alumni can help in a safe and supportive environment.",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      title: "Smart Searches",
      description:
        "Update your profile with professional details, making it easier for others to find you using smart AI-based search filters. Search by company, job title, field of expertise, or location, and connect with peers or mentors.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Community Building",
      description:
        "Join or create discussion communities based on professional fields, companies, or interests. Alumni can address common questions, offer resume reviews, and engage in productive discussions on an interactive board.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Donations",
      description:
        "Show your support your through our secure donation portal for government backed tax exemptions. You can also raise funds for startups or find investors, empowering future innovators.",
      icon: <Gift className="w-6 h-6" />,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Services</h2>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                <p className="mt-4 text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
