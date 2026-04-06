// client/src/components/profile/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../utils/authUtils';
import { useUser } from '../../context/UserContext';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onLogout = () => {
    handleLogout(navigate, setUser);
  };

  return (
    <button
      onClick={onLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
