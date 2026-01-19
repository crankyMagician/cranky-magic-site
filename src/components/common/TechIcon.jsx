import React from 'react';
import { Box, Tooltip, useTheme, alpha } from '@mui/material';
import { getTechIcon, hasTechIcon } from '../../utils/techIconMapping';

/**
 * TechIcon Component
 * Renders a technology icon with optional tooltip and background
 *
 * @param {Object} props
 * @param {string} props.tech - Technology name to display icon for
 * @param {number} props.size - Icon size in pixels (default: 20)
 * @param {boolean} props.showTooltip - Whether to show tooltip on hover (default: true)
 * @param {boolean} props.showBackground - Whether to show background circle (default: false)
 * @param {boolean} props.useOriginalColor - Use original brand color vs theme color (default: true)
 * @param {string} props.fallbackColor - Color to use if no brand color (default: theme primary)
 * @param {Object} props.sx - Additional MUI sx styling
 */
const TechIcon = ({
    tech,
    size = 20,
    showTooltip = true,
    showBackground = false,
    useOriginalColor = true,
    fallbackColor,
    sx = {},
    ...props
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    // Get the icon data
    const { icon: IconComponent, color: brandColor, label } = getTechIcon(tech);

    // Determine the icon color
    let iconColor = useOriginalColor ? brandColor : (fallbackColor || theme.palette.primary.main);

    // Handle dark icons on dark backgrounds
    const darkColors = ['#000000', '#000', '#171717', '#231F20', '#172B4D', '#092E20', '#2D3748', '#17202C'];
    const isVeryDarkColor = darkColors.some(c =>
        brandColor?.toLowerCase() === c.toLowerCase()
    );

    // If using original color and it's very dark in dark mode, use white
    if (useOriginalColor && isDarkMode && isVeryDarkColor) {
        iconColor = '#FFFFFF';
    }

    // Check if we have a known icon
    const hasKnownIcon = hasTechIcon(tech);

    const iconElement = (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                lineHeight: 0,
                ...(showBackground && {
                    width: size * 1.8,
                    height: size * 1.8,
                    borderRadius: '50%',
                    backgroundColor: alpha(iconColor, 0.1),
                    border: `1px solid ${alpha(iconColor, 0.2)}`,
                }),
                ...sx,
            }}
            {...props}
        >
            <IconComponent
                size={size}
                style={{
                    color: iconColor,
                    flexShrink: 0,
                }}
            />
        </Box>
    );

    if (showTooltip && hasKnownIcon) {
        return (
            <Tooltip title={label} arrow placement="top">
                {iconElement}
            </Tooltip>
        );
    }

    return iconElement;
};

/**
 * TechIconWithLabel Component
 * Renders a technology icon with a text label
 */
export const TechIconWithLabel = ({
    tech,
    size = 16,
    useOriginalColor = true,
    showTooltip = false,
    spacing = 0.5,
    labelProps = {},
    sx = {},
    ...props
}) => {
    const theme = useTheme();

    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing,
                ...sx,
            }}
            {...props}
        >
            <TechIcon
                tech={tech}
                size={size}
                useOriginalColor={useOriginalColor}
                showTooltip={showTooltip}
            />
            <Box
                component="span"
                sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    ...labelProps,
                }}
            >
                {tech}
            </Box>
        </Box>
    );
};

export default TechIcon;
