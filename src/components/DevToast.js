import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const DevToast = ({ message, open, setOpen }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Do nothing on clickaway
        }
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            onClose={handleClose}
            message={message}
            action={
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
            autoHideDuration={6000} // Adjust auto-hide duration as needed
        />
    );
};

// Prop validation using PropTypes
DevToast.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

// Use this custom hook to trigger the toast from anywhere in your app
export const useDevToast = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    // Removed useEffect with toast.configure as it's not necessary

    const triggerToast = (newMessage) => {
        setMessage(newMessage);
        setOpen(true); // Directly open the Snackbar here
    };

    return { open, setOpen, triggerToast };
};

export default DevToast;
