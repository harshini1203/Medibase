import { toast } from "react-toastify";

// Common Configurations
const commonConfig = {
  position: "top-right",
  autoClose: 2000, // Auto close after 3 seconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    ...commonConfig,
    className: "toast-success", // Optional CSS class
  });
};

// Error Toast
export const showErrorToast = (message) => {
  toast.error(message, {
    ...commonConfig,
    className: "toast-error", // Optional CSS class
  });
};

// Warning Toast
export const showWarningToast = (message) => {
  toast.warn(message, {
    ...commonConfig,
    className: "toast-warning", // Optional CSS class
  });
};

// Info Toast
export const showInfoToast = (message) => {
  toast.info(message, {
    ...commonConfig,
    className: "toast-info", // Optional CSS class
  });
};
