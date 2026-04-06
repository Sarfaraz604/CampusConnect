// // client/src/context/UserContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_backend_URL}/auth/profile`, {
//           withCredentials: true
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
// client/src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      // Only attempt to fetch user if there's a session
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/auth/check`, 
        { withCredentials: true }
      );

      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setError(null);
        
        // Optional: Cache user data
        localStorage.setItem('cachedUserProfile', JSON.stringify(response.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('cachedUserProfile');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setError(error.response?.data?.error || 'Failed to check authentication');
      setUser(null);
      localStorage.removeItem('cachedUserProfile');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/auth/check`,
        { withCredentials: true }
      );
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        localStorage.setItem('cachedUserProfile', JSON.stringify(response.data.user));
        setError(null);
      }
    } catch (error) {
      console.error('Failed to get user profile:', error);
      setError(error.response?.data?.error || 'Failed to authenticate with Google');
      setUser(null);
      localStorage.removeItem('cachedUserProfile');
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_backend_URL}/auth/logout`,
        {}, 
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem('cachedUserProfile');
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.response?.data?.error || 'Failed to logout');
    }
  };

  useEffect(() => {
    // Conditional authentication check
    const checkAuthentication = async () => {
      // Check if there's a cached profile
      const cachedProfile = localStorage.getItem('cachedUserProfile');
      
      if (cachedProfile) {
        try {
          // Validate cached profile
          const parsedProfile = JSON.parse(cachedProfile);
          
          // Optional: You can add additional validation here
          if (parsedProfile && parsedProfile.id) {
            setUser(parsedProfile);
          }
        } catch (parseError) {
          console.error('Failed to parse cached profile', parseError);
          localStorage.removeItem('cachedUserProfile');
        }
      }

      // Always attempt to verify authentication
      await fetchUser();
    };

    checkAuthentication();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    handleGoogleLogin,
    logout,
    refreshUser: fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};