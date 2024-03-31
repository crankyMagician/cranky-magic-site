import React from 'react';
import {Box} from "@mui/material";

const ResponsiveVideoEmbed = ({ url }) => (
    <Box sx={{ position: 'relative', paddingBottom: '56.25%' /* 16:9 Aspect Ratio */, paddingTop: '25px', height: 0 }}>
        <iframe
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }}
            src={url}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </Box>
);

export default ResponsiveVideoEmbed;
