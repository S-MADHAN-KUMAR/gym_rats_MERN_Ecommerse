import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, theme = 'dark', type = 'success') => {
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  };

  const toastOptions = {
    theme,
  };

  const toastFunction = toastTypes[type] || toast.success;
  toastFunction(message, toastOptions);
};
