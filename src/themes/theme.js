import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { getPaletteByMode } from './themeMappings';
import {getTypographyByMode} from "./fontMappings";
import lightTypography from './typography/lightTypography'; // Default lightTypography settings
import componentsOverrides from './muicomponents/muiComponentsOverrides'; // Custom overrides for MUI components
import breakpoints from './breakpoints/breakpoints';
// Function to create and return a theme based on the mode and optional direction
export const getTheme = (mode, direction = 'ltr') => {
    const palette = getPaletteByMode(mode);
    const typography = getTypographyByMode(mode); // Fetch typography settings based on the mode

    let theme = createTheme({
        palette,
        typography,
        components: componentsOverrides,
        breakpoints,
        direction,
    });

    theme = responsiveFontSizes(theme);

    return theme;
};
