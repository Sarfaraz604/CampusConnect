import { toast } from '../components/Toast';

export const showSuccessToast = (message) => {
  toast(message, { type: 'success' });
};

export const showErrorToast = (message) => {
  toast(message, { type: 'error' });
};

export const showInfoToast = (message) => {
  toast(message, { type: 'info' });
};