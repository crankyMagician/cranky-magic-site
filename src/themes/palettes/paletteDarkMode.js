import {baseColors} from "../colors";

export const paletteDarkMode = {
    mode: 'dark',
    primary: {
        main: baseColors.blue.base,
        light: baseColors.blue.base,
        dark: baseColors.blue.base,
        contrastText: baseColors.white,
    },
    secondary: {
        main: baseColors.green.base,
        light: baseColors.green.base,
        dark: baseColors.green.base,
    },
    error: {
        main: baseColors.red.base,
    },
    warning: {
        main: baseColors.orange.base,
        light: baseColors.orange.base,
        dark: baseColors.orange.base,
    },
    info: {
        main: baseColors.grey.base,
        light: baseColors.grey.base,
        dark: baseColors.grey.base,
    },
    success: {
        main: baseColors.green.base,
    },
    background: {
        default: baseColors.black,
        paper: baseColors.black,
    },
    text: {
        primary: baseColors.white,
        secondary: baseColors.grey.base,
    },
    tertiary: {
        main: baseColors.yellow,
    },
    action: {
        active: baseColors.grey.base, // Adjusted to be more visible against dark backgrounds
        hover: baseColors.grey.dark,
        hoverOpacity: 0.08, // Keeping standard opacity
        selected: baseColors.grey.light,
        selectedOpacity: 0.14, // Consistent with light mode for selected state
        disabled: baseColors.grey.dark,
        disabledBackground: baseColors.grey.base,
        disabledOpacity: 0.38, // Ensuring disabled state is clearly indicated
        focus: baseColors.grey.light,
        focusOpacity: 0.12, // Focus should be clearly distinguishable
        activatedOpacity: 0.12, // Keeping consistency with focus state
    },


};