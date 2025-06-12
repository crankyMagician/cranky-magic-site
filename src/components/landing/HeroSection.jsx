import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Fade,
    Slide,
    IconButton,
    Chip,
    Stack,
    Avatar,
    useTheme,
    alpha,
    keyframes
} from '@mui/material';
import {
    ArrowDownward,
    Download,
    ContactMail,
    GitHub,
    LinkedIn,
    Launch,
    AutoAwesome,
    Code,
    Palette
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import WizardAvatar from './WizardAvatar';
import ThemeToggle from './ThemeToggle';

// Magical animations inspired by cranky theme
const magicSparkle = keyframes`
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
`;

const levitate = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
`;

const typewriterAnimation = keyframes`
    from { width: 0; }
    to { width: 100%; }
`;

const blinkCursor = keyframes`
    from, to { border-color: transparent; }
    50% { border-color: currentColor; }
`;

const HeroSection = React.memo(({ onSectionView }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();

    const [isVisible, setIsVisible] = useState(false);
    const [showTypewriter, setShowTypewriter] = useState(false);
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

    // Professional skills rotation
    const skills = [
        translate('Full-Stack Developer'),
        translate('React Specialist'),
        translate('UI/UX Designer'),
        translate('Problem Solver'),
        translate('Tech Innovator')
    ];

    // Initialize animations
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        const typewriterTimer = setTimeout(() => setShowTypewriter(true), 1000);

        if (onSectionView) {
            onSectionView();
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(typewriterTimer);
        };
    }, [onSectionView]);

    // Skill rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [skills.length]);

    // Analytics handlers
    const handleResumeDownload = () => {
        analytics.trackButtonClick('download_resume', {
            section: 'hero',
            context: 'primary_cta',
            format: 'pdf'
        });
    };

    const handleContactClick = () => {
        analytics.trackButtonClick('contact_hero', {
            section: 'hero',
            context: 'secondary_cta'
        });

        // Smooth scroll to contact section
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSocialClick = (platform) => {
        analytics.trackLinkClick(`${platform}_profile`, '#', {
            section: 'hero',
            social_platform: platform,
            is_external: true
        });
    };

    const handleScrollDown = () => {
        analytics.trackElementClick('scroll_indicator', 'hero_scroll_down', {
            section: 'hero',
            interaction_type: 'scroll_prompt'
        });

        // Smooth scroll to next section
        const skillsSection = document.getElementById('skills-section');
        if (skillsSection) {
            skillsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                py: { xs: 4, md: 8 }
            }}
        >
            {/* Background magical elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    fontSize: '1.5rem',
                    color: theme.palette.primary.main,
                    animation: `${magicSparkle} 4s infinite`,
                    opacity: 0.6,
                    display: { xs: 'none', md: 'block' }
                }}
            >
                ✨
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '60%',
                    left: '5%',
                    fontSize: '1.2rem',
                    color: theme.palette.secondary.main,
                    animation: `${magicSparkle} 3s infinite 1s`,
                    opacity: 0.5,
                    display: { xs: 'none', md: 'block' }
                }}
            >
                ⭐
            </Box>

            {/* Theme Toggle in top right */}
            <Box
                sx={{
                    position: 'absolute',
                    top: { xs: 16, md: 24 },
                    right: { xs: 16, md: 24 },
                    zIndex: 10
                }}
            >
                <ThemeToggle />
            </Box>

            <Grid container spacing={4} alignItems="center">
                {/* Left Column - Text Content */}
                <Grid item xs={12} md={8} lg={7}>
                    <Fade in={isVisible} timeout={1000}>
                        <Box>
                            {/* Greeting */}
                            <Slide direction="down" in={isVisible} timeout={800}>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    sx={{
                                        color: 'text.secondary',
                                        mb: 2,
                                        fontWeight: 500,
                                        letterSpacing: 1.2
                                    }}
                                >
                                    {translate('Hello, I am')}
                                </Typography>
                            </Slide>

                            {/* Name */}
                            <Slide direction="up" in={isVisible} timeout={1000}>
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 2,
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                        lineHeight: 1.1,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: theme.palette.mode === 'dark'
                                            ? `0 0 30px ${alpha(theme.palette.primary.main, 0.3)}`
                                            : 'none'
                                    }}
                                >
                                    CrankyMagician
                                </Typography>
                            </Slide>

                            {/* Dynamic Skills with Typewriter Effect */}
                            <Box
                                sx={{
                                    mb: 4,
                                    minHeight: '4rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                        color: 'text.primary',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        borderRight: showTypewriter ? `3px solid ${theme.palette.primary.main}` : 'none',
                                        animation: showTypewriter ? `${typewriterAnimation} 2s steps(40), ${blinkCursor} 1s infinite` : 'none',
                                        animationDelay: '0.5s',
                                        animationFillMode: 'both'
                                    }}
                                >
                                    {skills[currentSkillIndex]}
                                </Typography>
                            </Box>

                            {/* Description */}
                            <Fade in={isVisible} timeout={1500}>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    sx={{
                                        color: 'text.secondary',
                                        mb: 4,
                                        maxWidth: '600px',
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1rem', md: '1.25rem' }
                                    }}
                                >
                                    {translate('Crafting magical digital experiences with React, TypeScript, and a passion for clean code. Transforming ideas into powerful, scalable applications.')}
                                </Typography>
                            </Fade>

                            {/* Skills Tags */}
                            <Fade in={isVisible} timeout={2000}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}
                                >
                                    {[
                                        { label: 'React', icon: <Code /> },
                                        { label: 'TypeScript', icon: <Code /> },
                                        { label: 'Node.js', icon: <Code /> },
                                        { label: 'UI/UX', icon: <Palette /> },
                                        { label: 'Material-UI', icon: <Palette /> }
                                    ].map((skill, index) => (
                                        <Chip
                                            key={skill.label}
                                            icon={skill.icon}
                                            label={translate(skill.label)}
                                            variant="outlined"
                                            sx={{
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                                fontWeight: 600,
                                                animation: `${levitate} 3s ease-in-out infinite`,
                                                animationDelay: `${index * 0.2}s`,
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Fade>

                            {/* CTA Buttons */}
                            <Fade in={isVisible} timeout={2500}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    sx={{ mb: 4 }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Download />}
                                        onClick={handleResumeDownload}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 6px 30px ${alpha(theme.palette.primary.main, 0.4)}`
                                            }
                                        }}
                                    >
                                        {translate('Download Resume')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<ContactMail />}
                                        onClick={handleContactClick}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        {translate('Get In Touch')}
                                    </Button>
                                </Stack>
                            </Fade>

                            {/* Social Links */}
                            <Fade in={isVisible} timeout={3000}>
                                <Stack direction="row" spacing={2}>
                                    {[
                                        { platform: 'GitHub', icon: <GitHub />, url: '#' },
                                        { platform: 'LinkedIn', icon: <LinkedIn />, url: '#' },
                                        { platform: 'Portfolio', icon: <Launch />, url: '#' }
                                    ].map((social) => (
                                        <IconButton
                                            key={social.platform}
                                            onClick={() => handleSocialClick(social.platform)}
                                            sx={{
                                                color: 'text.secondary',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    transform: 'translateY(-2px) scale(1.1)'
                                                }
                                            }}
                                            aria-label={`${social.platform} profile`}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Stack>
                            </Fade>
                        </Box>
                    </Fade>
                </Grid>

                {/* Right Column - Wizard Avatar */}
                <Grid item xs={12} md={4} lg={5}>
                    <Fade in={isVisible} timeout={1500}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: { xs: '300px', md: '500px' },
                                position: 'relative'
                            }}
                        >
                            <WizardAvatar
                                size="large"
                                animated
                                showStars
                                sx={{
                                    animation: `${levitate} 4s ease-in-out infinite`
                                }}
                            />
                        </Box>
                    </Fade>
                </Grid>
            </Grid>

            {/* Scroll Down Indicator */}
            <Fade in={isVisible} timeout={3500}>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={handleScrollDown}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            mb: 1,
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}
                    >
                        {translate('Scroll to explore')}
                    </Typography>
                    <IconButton
                        sx={{
                            color: 'primary.main',
                            animation: `${levitate} 2s ease-in-out infinite`,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                        }}
                        aria-label="Scroll down"
                    >
                        <ArrowDownward />
                    </IconButton>
                </Box>
            </Fade>
        </Container>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;