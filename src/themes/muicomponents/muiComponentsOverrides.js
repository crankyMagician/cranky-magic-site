// muiComponentsOverrides.js

// Import baseColors if it's defined in another file
import { baseColors } from "../colors";

const componentsOverrides = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 5,
                textTransform: 'none',
                padding: '10px 20px',
            },
            containedPrimary: {
                backgroundColor: baseColors.blue.dark,
                '&:hover': {
                    backgroundColor: baseColors.blue,
                },
            }
        }
    }
    // Add more component overrides as needed
};

export default componentsOverrides;
