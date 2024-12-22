import React from 'react';

const Base64ToImage = ({ base64, alt = 'Dropzone Background', style = {} }) => {
    if (!base64) return null;

    return (
        <img
            src={`data:image/png;base64,${base64}`}
            alt={alt}
            style={{
                ...style,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
            }}
        />
    );
};

export default Base64ToImage;
