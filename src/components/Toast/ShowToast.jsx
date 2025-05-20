import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ShowToast.css'

export const showErrorToast = (message) => {
  toast.error(message, {
    className: 'error-toast',
  });
  };
  
export const showSuccessToast = (message) => {
  toast.success(message, {
    className: 'success-toast',
  });
};

