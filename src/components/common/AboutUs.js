import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Link,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Check as CheckIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import useScrollTracking from '../../analytics/hooks/useScrollTracking';
import { EVENTS } from '../../analytics/constants/events';
import ResponsiveVideoEmbed from "../../utilities/ResponsiveVideoEmbed";


const AboutUs = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Use analytics hooks
    const analytics = useAnalytics();

    // Track scrolling on this page
    const scrollData = useScrollTracking({
        // Report every 5% scroll depth instead of default 10%
        reportingThreshold: 5
    });

    // Track page view and feature view on component mount
    useEffect(() => {
        // Track that the user viewed this feature
        analytics.trackFeatureView('about_us_page');

        // Return cleanup function for component unmount
        return () => {
            // Track maximum scroll depth reached when user leaves the page
            if (scrollData.maxScrollDepth > 0) {
                analytics.trackEvent(EVENTS.SCROLL.FINAL_DEPTH, {
                    path: '/about-us',
                    scroll_depth_pct: scrollData.maxScrollDepth,
                    component: 'AboutUs'
                });
            }
        };
    }, [analytics]);

    // Example of tracking a button click
    const handleContactClick = () => {
        analytics.trackButtonClick('contact_us_button', {
            location: 'about_us_page',
            section: 'header',
            context: 'primary_cta'
        });

        // Navigate to contact page
        navigate('/contact-us');
    };

    // Example of tracking a link click
    const handleLearnMoreClick = (topicName) => {
        analytics.trackLinkClick(
            `Learn more about ${topicName}`,
            `/topics/${topicName}`,
            {
                topic: topicName,
                section: 'content',
                context: 'learn_more'
            }
        );

        // Navigate to the topic page - in a real app, this might be a different route
        // Here we'll just navigate to the same page for demonstration
        navigate(`/about-us?topic=${topicName}`);
    };

    // Track video interaction
    const handleVideoPlay = () => {
        analytics.trackEvent(EVENTS.INTERACTION.VIDEO_PLAY, {
            video_id: 'about_company_video',
            video_title: 'About Our Company',
            section: 'company_intro'
        });
    };

    // Team member click handler
    const handleTeamMemberClick = (member) => {
        analytics.trackElementClick('team_member_card', member.name, {
            member_role: member.role,
            section: 'team'
        });
    };

    // Example team members data
    const teamMembers = [
        {
            name: 'Jane Smith',
            role: 'CEO & Founder',
            bio: 'Jane has over 15 years of experience in tech innovation.',
            image: 'https://via.placeholder.com/150'
        },
        {
            name: 'John Johnson',
            role: 'CTO',
            bio: 'John is an expert in cloud architecture and distributed systems.',
            image: 'https://via.placeholder.com/150'
        },
        {
            name: 'Sarah Williams',
            role: 'Head of Product',
            bio: 'Sarah leads our product strategy with a focus on user experience.',
            image: 'https://via.placeholder.com/150'
        },
        {
            name: 'Michael Brown',
            role: 'Lead Developer',
            bio: 'Michael specializes in scalable backend solutions.',
            image: 'https://via.placeholder.com/150'
        }
    ];

    // Company values
    const companyValues = [
        {
            title: 'Innovation',
            description: 'We push the boundaries of what\'s possible with technology.'
        },
        {
            title: 'Quality',
            description: 'We believe in delivering excellence in everything we do.'
        },
        {
            title: 'Integrity',
            description: 'We operate with honesty and transparency in all interactions.'
        },
        {
            title: 'Customer Focus',
            description: 'Our customers\' success is our primary measure of achievement.'
        }
    ];

    return (
        <Box sx={{ padding: { xs: 2, md: 4 } }}>
            {/* Hero Section */}
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, md: 6 },
                    mb: 6,
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/api/placeholder/1200/400')`
                        : `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url('/api/placeholder/1200/400')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                    textAlign: 'center'
                }}
            >
                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '2rem', md: '3rem' }
                    }}
                >
                    About Our Company
                </Typography>

                <Typography
                    variant="h5"
                    paragraph
                    sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: 4,
                        color: theme.palette.text.secondary
                    }}
                >
                    We're dedicated to building innovative solutions that transform the way people interact with technology.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleContactClick}
                    sx={{ px: 4, py: 1.5 }}
                >
                    Contact Us
                </Button>
            </Paper>

            {/* Our Story Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" gutterBottom>Our Story</Typography>
                        <Typography paragraph>
                            Founded in 2020, our company began with a vision to create technology that makes a real difference in people's lives. What started as a small team of passionate innovators has grown into a thriving company at the forefront of technological advancement.
                        </Typography>
                        <Typography paragraph>
                            Through years of dedicated research and development, we've built a platform that combines cutting-edge technology with intuitive design. Our commitment to excellence has driven us to continuously improve and refine our solutions.
                        </Typography>
                        <Typography paragraph>
                            Today, we serve thousands of customers across the globe, helping them achieve their goals and overcome challenges with our powerful yet accessible tools.
                        </Typography>

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleLearnMoreClick('company-history')}
                            sx={{ mt: 2 }}
                        >
                            Learn more about our history
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={4} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                            <Box sx={{ position: 'relative' }} onClick={handleVideoPlay}>
                                <ResponsiveVideoEmbed url="https://www.youtube.com/embed/dQw4w9WgXcQ" />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Our Values Section */}
            <Box
                sx={{
                    py: 8,
                    px: 2,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(0,0,0,0.2)'
                        : 'rgba(0,0,0,0.03)',
                    mb: 8
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ mb: 6 }}
                    >
                        Our Values
                    </Typography>

                    <Grid container spacing={4}>
                        {companyValues.map((value, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6
                                        }
                                    }}
                                    onClick={() => {
                                        analytics.trackElementClick('value_card', value.title, {
                                            section: 'values'
                                        });
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h5" gutterBottom>
                                            {value.title}
                                        </Typography>
                                        <Typography variant="body1">
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Team Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                    Our Team
                </Typography>

                <Grid container spacing={4}>
                    {teamMembers.map((member, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => handleTeamMemberClick(member)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={member.image}
                                    alt={member.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.bio}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Achievements Section */}
            <Box
                sx={{
                    py: 8,
                    px: 2,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(0,0,0,0.2)'
                        : 'rgba(0,0,0,0.03)',
                    mb: 8
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                        Our Achievements
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 3
                                }}
                                onClick={() => {
                                    analytics.trackElementClick('achievement', 'customers_served', {
                                        section: 'achievements'
                                    });
                                }}
                            >
                                <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                                    10,000+
                                </Typography>
                                <Typography variant="h6">Customers Served</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 3
                                }}
                                onClick={() => {
                                    analytics.trackElementClick('achievement', 'countries', {
                                        section: 'achievements'
                                    });
                                }}
                            >
                                <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                                    50+
                                </Typography>
                                <Typography variant="h6">Countries</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 3
                                }}
                                onClick={() => {
                                    analytics.trackElementClick('achievement', 'industry_awards', {
                                        section: 'achievements'
                                    });
                                }}
                            >
                                <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                                    25+
                                </Typography>
                                <Typography variant="h6">Industry Awards</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Why Choose Us Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
                    Why Choose Us
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <List>
                            {[
                                'Industry-leading technology and innovation',
                                'Dedicated customer support available 24/7',
                                'Proven track record of success',
                                'Customizable solutions for your specific needs'
                            ].map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <CheckIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={item} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Our Commitment
                            </Typography>
                            <Typography paragraph>
                                We're committed to providing the highest quality products and services to our customers. Our team works tirelessly to ensure that every interaction with our company exceeds expectations.
                            </Typography>
                            <Typography>
                                When you choose to work with us, you're not just getting a service provider – you're gaining a partner dedicated to your success.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 8,
                    px: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" gutterBottom>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="h6" paragraph sx={{ mb: 4 }}>
                        Join thousands of satisfied customers who trust us with their business needs.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={() => {
                            analytics.trackButtonClick('contact_us_button', {
                                location: 'about_us_page',
                                section: 'footer_cta'
                            });
                            navigate('/contact-us');
                        }}
                        sx={{
                            px: 4,
                            py: 1.5,
                            backgroundColor: theme.palette.common.white,
                            color: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.grey[100]
                            }
                        }}
                    >
                        Contact Us Today
                    </Button>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
                    Frequently Asked Questions
                </Typography>

                <Grid container spacing={4}>
                    {[
                        {
                            question: 'What makes your company different?',
                            answer: 'Our unique approach combines cutting-edge technology with exceptional customer service, creating solutions that truly address our customers\' needs.'
                        },
                        {
                            question: 'How quickly can you implement your solutions?',
                            answer: 'Implementation timelines vary based on the specific needs of each customer, but we work efficiently to ensure a smooth and timely deployment process.'
                        },
                        {
                            question: 'Do you offer customer support?',
                            answer: 'Yes, we provide comprehensive customer support to all our clients, with options ranging from email support to dedicated account management.'
                        },
                        {
                            question: 'Can your solutions be customized?',
                            answer: 'Absolutely! We understand that each business has unique requirements, and our products are designed to be flexible and customizable.'
                        }
                    ].map((faq, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2
                                }}
                                onClick={() => {
                                    analytics.trackElementClick('faq_item', `faq_${index+1}`, {
                                        question: faq.question,
                                        section: 'faq'
                                    });
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {faq.question}
                                </Typography>
                                <Typography variant="body1">
                                    {faq.answer}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body1" paragraph>
                        Have more questions? We're here to help.
                    </Typography>
                    <Link
                        component="button"
                        variant="body1"
                        onClick={() => {
                            analytics.trackLinkClick('View all FAQs', '/faq', {
                                section: 'faq',
                                context: 'view_all'
                            });
                            navigate('/faq');
                        }}
                        sx={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                        View all FAQs <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;