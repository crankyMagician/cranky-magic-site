import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Container, Box, Typography, Button, useTheme } from '@mui/material';
import useCustomTranslation from "../../hooks/useCustomTranslation";

const IntroductionPanel = ({
                               photoUrl,
                               overlayOpacity = 0.5, // Default overlay opacity
                               children, // Accept children to render custom content
                               ...props // Spread other props for further customization
                           }) => {

    const theme = useTheme();
    const { translate } = useCustomTranslation();

    return (
        <Container
            component="main"
            maxWidth="md" // Changed maxWidth to "md"
            disableGutters
            sx={{
                my: 4, // Adjusted vertical margins to match the example
                backgroundImage: `url(${photoUrl})`,
                backgroundSize: 'cover', // Ensures the image covers the area without being oversized
                backgroundPosition: 'center',
                [theme.breakpoints.down('sm')]: {
                    paddingTop: theme.spacing(8),
                    paddingBottom: theme.spacing(8),
                }
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    color: theme.palette.common.white,
                    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`, // Use overlayOpacity prop
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center', // Center align the items
                    height: '100%',
                    [theme.breakpoints.down('sm')]: {
                        py: 4,
                    }
                }}
            >
                {/* Render children or default content */}
                {children || (
                    <>
                        <Typography component="h1" variant="h3" gutterBottom>
                            {translate('Welcome to Our Website')}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {translate('Discover Our Solutions & Services')}
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                            {translate('Learn More')}
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
};

IntroductionPanel.propTypes = {
    photoUrl: PropTypes.string.isRequired,
    overlayOpacity: PropTypes.number, // Added overlayOpacity prop type
    children: PropTypes.node // Added children prop type to allow for custom content
};

IntroductionPanel.defaultProps = {
    overlayOpacity: 0.5 // Default overlay opacity
};

export default IntroductionPanel;
