// src/components/common/OverrideStyleToggle.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setComponentOverride,
    selectCurrentComponentOverride,
    selectAvailableComponentOverrides
} from '../../reducers/themeSlice';
import {
    FormControl,
    FormLabel,
    ToggleButtonGroup,
    ToggleButton,
    Box,
    Tooltip,
    Typography,
    Fade,
    Zoom,
    alpha,
    keyframes,
    styled
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GridOnIcon from '@mui/icons-material/GridOn';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import SpaIcon from '@mui/icons-material/Spa';
import CodeIcon from '@mui/icons-material/Code';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import { useTheme } from '@mui/material/styles';

// Magical sparkle animation
const sparkleAnimation = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

// Lightning pulse animation
const lightningPulse = keyframes`
  0% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
  100% {
    box-shadow: 0 0 5px currentColor;
  }
`;

// Styled toggle button with animations
const AnimatedToggleButton = styled(ToggleButton)(({ theme, selected }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        height: '100%',
        transform: 'translate(-50%, -50%) scale(0)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
        transition: 'transform 0.6s ease-out',
    },

    '&:hover::before': {
        transform: 'translate(-50%, -50%) scale(2)',
    },

    '&.Mui-selected': {
        animation: selected ? `${lightningPulse} 2s ease-in-out infinite` : 'none',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,

        '& .sparkle': {
            animation: `${sparkleAnimation} 1.5s ease-in-out infinite`,
        }
    },

    '& .icon-wrapper': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        position: 'relative',
    },

    '& .sparkle': {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        fontSize: '12px',
        color: theme.palette.warning.main,
    }
}));

const OverrideStyleToggle = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const currentOverrideStyle = useSelector(selectCurrentComponentOverride);
    const availableOverrides = useSelector(selectAvailableComponentOverrides);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleChange = (event, newStyle) => {
        if (newStyle !== null && newStyle !== currentOverrideStyle) {
            setIsAnimating(true);

            // Trigger particle effect
            createParticleBurst(event.currentTarget);

            // Dispatch the change
            dispatch(setComponentOverride(newStyle));

            // Save to localStorage
            localStorage.setItem('themeComponentOverride', newStyle);

            // Reset animation flag
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    // Create particle burst effect on selection
    const createParticleBurst = (element) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const particles = 12;

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'magic-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: ${theme.palette.primary.main};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: particleBurst 0.8s ease-out forwards;
            `;
            document.body.appendChild(particle);

            // Clean up after animation
            setTimeout(() => particle.remove(), 800);
        }
    };

    // Enhanced style configurations
    const styles = [
        {
            value: 'cranky',
            label: translate('Magical') || 'Magical',
            icon: <AutoAwesomeIcon />,
            description: translate('MagicalEffects') || 'Magical effects with sparkles and mystical animations',
            color: theme.palette.primary.main,
            sparkle: true
        },
        {
            value: 'spatial',
            label: translate('Matrix') || 'Matrix',
            icon: <GridOnIcon />,
            description: translate('CyberpunkTheme') || 'Cyberpunk theme with digital effects and holographic elements',
            color: theme.palette.secondary.main,
            sparkle: false
        },
        {
            value: 'wizard',
            label: translate('Wizard') || 'Wizard',
            icon: <StarIcon />,
            description: translate('FullWizardMode') || 'Full wizard mode with lightning and advanced magic',
            color: theme.palette.warning.main,
            sparkle: true
        },
        {
            value: 'lightning',
            label: translate('Lightning') || 'Lightning',
            icon: <BoltIcon />,
            description: translate('ElectricEffects') || 'Electric effects with energy pulses',
            color: theme.palette.info.main,
            sparkle: true
        },
        {
            value: 'minimal',
            label: translate('Minimal') || 'Minimal',
            icon: <SpaIcon />,
            description: translate('CleanMinimal') || 'Clean and minimal with subtle animations',
            color: theme.palette.text.secondary,
            sparkle: false
        },
        {
            value: 'developer',
            label: translate('Developer') || 'Developer',
            icon: <CodeIcon />,
            description: translate('DeveloperFocused') || 'Developer-focused with code aesthetics',
            color: theme.palette.success.main,
            sparkle: false
        }
    ];

    // Filter available styles
    const availableStyles = styles.filter(style =>
        availableOverrides.includes(style.value)
    );

    // Add global particle animation styles
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleBurst {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(
                        ${Math.random() * 100 - 50}px,
                        ${Math.random() * 100 - 50}px
                    ) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <Box sx={{ my: 3 }}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel
                    component="legend"
                    sx={{
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}
                >
                    <Typography variant="subtitle1">
                        {translate('ComponentStyle') || 'Component Style'}
                    </Typography>
                </FormLabel>

                <ToggleButtonGroup
                    value={currentOverrideStyle}
                    exclusive
                    onChange={handleChange}
                    aria-label="component style"
                    size="medium"
                    fullWidth
                    sx={{
                        flexWrap: 'wrap',
                        gap: 1,
                        '& .MuiToggleButtonGroup-grouped': {
                            margin: theme.spacing(0.5),
                            border: 0,
                            '&.Mui-disabled': {
                                border: 0,
                            },
                            '&:not(:first-of-type)': {
                                borderRadius: theme.shape.borderRadius,
                            },
                            '&:first-of-type': {
                                borderRadius: theme.shape.borderRadius,
                            },
                        },
                    }}
                >
                    {availableStyles.map((style) => (
                        <Tooltip
                            key={style.value}
                            title={
                                <Box>
                                    <Typography variant="body2">{style.description}</Typography>
                                </Box>
                            }
                            placement="top"
                            arrow
                            TransitionComponent={Zoom}
                        >
                            <AnimatedToggleButton
                                value={style.value}
                                aria-label={style.label}
                                selected={currentOverrideStyle === style.value}
                                sx={{
                                    flex: '1 1 30%',
                                    minWidth: '120px',
                                    py: 1.5,
                                    px: 2,
                                    border: `1px solid ${alpha(style.color, 0.3)}`,
                                    '&:hover': {
                                        borderColor: style.color,
                                        background: alpha(style.color, 0.05),
                                    },
                                    '&.Mui-selected': {
                                        borderColor: style.color,
                                        color: style.color,
                                    }
                                }}
                            >
                                <Box className="icon-wrapper">
                                    {React.cloneElement(style.icon, {
                                        sx: {
                                            fontSize: 20,
                                            color: currentOverrideStyle === style.value ? style.color : 'inherit',
                                            transition: 'all 0.3s ease'
                                        }
                                    })}
                                    {style.sparkle && currentOverrideStyle === style.value && (
                                        <StarIcon className="sparkle" />
                                    )}
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        {style.label}
                                    </Typography>
                                </Box>
                            </AnimatedToggleButton>
                        </Tooltip>
                    ))}
                </ToggleButtonGroup>

                {/* Current style indicator with animation */}
                <Fade in={!isAnimating} timeout={300}>
                    <Box sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            {translate('CurrentStyle') || 'Current Style'}:
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    ml: 1,
                                    fontWeight: 'bold',
                                    color: theme.palette.primary.main
                                }}
                            >
                                {availableStyles.find(s => s.value === currentOverrideStyle)?.label || currentOverrideStyle}
                            </Typography>
                        </Typography>
                    </Box>
                </Fade>
            </FormControl>
        </Box>
    );
};

export default OverrideStyleToggle;