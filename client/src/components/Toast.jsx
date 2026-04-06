// src/components/Toast.jsx
import React, { useState, useEffect } from 'react';
import { toast as reactToastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

// Notification types
const TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

// Create a context for toast notifications
export const ToastContext = React.createContext({
  showToast: () => {},
});

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toastState, setToastState] = useState(null);

  const showToast = (message, type = TYPES.SUCCESS, duration = 2000) => {
    setToastState({ message, type, duration });
  };

  useEffect(() => {
    if (toastState) {
      const timer = setTimeout(() => {
        setToastState(null);
      }, toastState.duration);
      
      return () => clearTimeout(timer);
    }
  }, [toastState]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastState && <Toast message={toastState.message} type={toastState.type} onClose={() => setToastState(null)} />}
    </ToastContext.Provider>
  );
};

// Hook to use the toast context
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Component that shows the notification
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger the animation after component is mounted
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Determine styling based on the type
  const getToastStyles = () => {
    switch (type) {
      case TYPES.SUCCESS:
        return {
          icon: <CheckCircle size={20} className="text-white" />,
          bgColor: 'bg-green-500',
          iconBg: 'bg-green-600'
        };
      case TYPES.ERROR:
        return {
          icon: <AlertCircle size={20} className="text-white" />,
          bgColor: 'bg-red-500',
          iconBg: 'bg-red-600'
        };
      case TYPES.INFO:
        return {
          icon: <Info size={20} className="text-white" />,
          bgColor: 'bg-blue-500',
          iconBg: 'bg-blue-600'
        };
      default:
        return {
          icon: <CheckCircle size={20} className="text-white" />,
          bgColor: 'bg-green-500',
          iconBg: 'bg-green-600'
        };
    }
  };
  
  const { icon, bgColor, iconBg } = getToastStyles();

  return (
    <div 
      className={`fixed top-4 right-4 z-50 flex items-center rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
      }`}
    >
      <div className={`flex items-center ${bgColor} p-3 pr-4 rounded-lg`}>
        <div className={`${iconBg} p-1 rounded-full mr-3`}>
          {icon}
        </div>
        <p className="text-white font-medium mr-6">{message}</p>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Remove the call to reactToastify.configure(); it's not available in this version

// Export a named export for toast so you can import it as:
// import { toast } from '../components/Toast';
export const toast = reactToastify;

// Also export the default (if needed)
export default reactToastify;
