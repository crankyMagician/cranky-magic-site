// ./components/SuccessToast.js
import { toast } from 'react-toastify';

export const SuccessToast = (message) => {
    toast.success(message, {
        position: "top-center",
        autoClose: 6000,
    });
};
