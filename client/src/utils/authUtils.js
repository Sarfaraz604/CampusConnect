// client/src/utils/authUtils.js
import axios from 'axios';

export const handleLogout = async (navigate, setUser) => {
  try {
    // Clear cached user data in localStorage and update context
    localStorage.removeItem('cachedUserProfile');
    if (setUser) setUser(null);
    
    // Perform server logout
    await axios.post(`${import.meta.env.VITE_backend_URL}/auth/logout`, {}, { 
      withCredentials: true 
    });
    
    // Navigate with fresh_login parameter
    navigate('/login?fresh_login=true');
  } catch (error) {
    console.error('Logout failed:', error);
    // Even if server logout fails, clear user data and redirect
    if (setUser) setUser(null);
    navigate('/login?fresh_login=true');
  }
};
