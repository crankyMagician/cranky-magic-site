// ./components/ErrorToast.js
import { toast } from 'react-toastify';

export const ErrorToast = (message, options = {}) => {
    const defaultOptions = {
        position: "top-center",
        autoClose: 6000, // Default auto-close time
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: `error-${message.substring(0, 20)}`, // Use a unique part of the message as a custom ToastId
    };

    // Merge custom options passed to the function with the default options
    const toastOptions = { ...defaultOptions, ...options };

    toast.error(message, toastOptions);
};
/*

import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorToast({ open, handleClose, message }) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { ErrorToast } from './components/ErrorToast'; // Adjust the import path as necessary

function App() {
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showErrorToast = (message) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => showErrorToast('This is an error message!')}>
        Show Error Toast
      </Button>
      <ErrorToast open={isToastOpen} handleClose={handleClose} message={toastMessage} />
    </div>
  );
}

export default App;

 */
