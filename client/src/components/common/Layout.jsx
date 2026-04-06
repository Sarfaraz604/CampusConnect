import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUser } from '../../context/UserContext';

const Layout = ({ children, hasSidebar = true }) => {
  const { user, loading } = useUser();
  
  // Check local storage for sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  
  // Listen for changes to sidebar state
  useEffect(() => {
    const handleStorageChange = () => {
      setSidebarCollapsed(localStorage.getItem('sidebar-collapsed') === 'true');
    };
    
    // Set up event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Also set up an interval to poll for changes (backup)
    const checkInterval = setInterval(() => {
      const currentState = localStorage.getItem('sidebar-collapsed') === 'true';
      if (currentState !== sidebarCollapsed) {
        setSidebarCollapsed(currentState);
      }
    }, 200);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [sidebarCollapsed]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    // Remove hardcoded 'sidebar-expanded' and use the state
    <div className={`min-h-screen bg-gray-50 ${
      hasSidebar 
        ? `has-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}` 
        : ''
    }`}>
      <Navbar userProfile={user} />
      {hasSidebar && <Sidebar />}
      <main 
        id="main-content" 
        style={{
          marginLeft: hasSidebar 
            ? (sidebarCollapsed ? '100px' : '320px') 
            : '0',
          transition: 'margin-left 0.3s ease'
        }}
        className="pt-16 p-8"
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;