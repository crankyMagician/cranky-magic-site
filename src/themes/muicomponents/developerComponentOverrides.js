// src/themes/muicomponents/developerComponentOverrides.js
import { alpha, keyframes } from '@mui/material/styles';

// Terminal cursor blink animation
const terminalCursor = keyframes`
    0%, 49% {
        opacity: 1;
    }
    50%, 100% {
        opacity: 0;
    }
`;

// Code syntax highlight animation
const codeHighlight = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

// Matrix rain effect
const matrixRain = keyframes`
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(100vh);
        opacity: 0;
    }
`;

const developerComponentOverrides = {
    // Developer-themed button styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: '"Fira Code", "Consolas", monospace',
                textTransform: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                '&::before': {
                    content: '">"',
                    position: 'absolute',
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    color: theme.palette.primary.main,
                    transition: 'left 0.3s ease',
                },

                '&:hover::before': {
                    left: '8px',
                },

                '&:hover': {
                    paddingLeft: '28px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
                },
            }),

            contained: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#24292e',
                color: '#58a6ff',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,

                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#2c3137',
                    borderColor: '#58a6ff',
                },
            }),

            outlined: ({ theme }) => ({
                borderColor: theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de',
                color: theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da',

                '&:hover': {
                    borderColor: '#58a6ff',
                    backgroundColor: alpha('#58a6ff', 0.05),
                },
            }),
        },
    },

    // Terminal-style card
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: '"Fira Code", "Consolas", monospace',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '28px',
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)'
                        : 'linear-gradient(180deg, #f6f8fa 0%, #ffffff 100%)',
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,
                },

                '&::after': {
                    content: '"● ● ●"',
                    position: 'absolute',
                    top: '6px',
                    left: '12px',
                    fontSize: '8px',
                    letterSpacing: '4px',
                    color: theme.palette.mode === 'dark' ? '#f85149' : '#cf222e',
                },
            }),
        },
    },

    // Code editor style text field
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '14px',
                    backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',

                    '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de',
                        borderRadius: '6px',
                    },

                    '&:hover fieldset': {
                        borderColor: '#58a6ff',
                    },

                    '&.Mui-focused fieldset': {
                        borderColor: '#58a6ff',
                        boxShadow: `0 0 0 3px ${alpha('#58a6ff', 0.1)}`,
                    },

                    '& input': {
                        color: theme.palette.mode === 'dark' ? '#c9d1d9' : '#24292e',

                        '&::placeholder': {
                            color: theme.palette.mode === 'dark' ? '#8b949e' : '#6e7781',
                            fontStyle: 'italic',
                        },
                    },
                },

                '& .MuiInputLabel-root': {
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    color: theme.palette.mode === 'dark' ? '#8b949e' : '#6e7781',
                },
            }),
        },
    },

    // Git-style switch
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 58,
                height: 32,
                padding: 0,
            },

            switchBase: ({ theme }) => ({
                padding: 4,

                '&.Mui-checked': {
                    transform: 'translateX(26px)',
                    color: '#fff',

                    '& + .MuiSwitch-track': {
                        backgroundColor: '#238636',
                        opacity: 1,
                        border: 0,

                        '&::before': {
                            content: '"1"',
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '12px',
                            fontFamily: '"Fira Code", monospace',
                            color: '#fff',
                        },
                    },
                },
            }),

            thumb: ({ theme }) => ({
                width: 24,
                height: 24,
                backgroundColor: theme.palette.mode === 'dark' ? '#c9d1d9' : '#24292e',
            }),

            track: ({ theme }) => ({
                borderRadius: 16,
                backgroundColor: theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de',
                opacity: 1,
                position: 'relative',

                '&::before': {
                    content: '"0"',
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                    fontFamily: '"Fira Code", monospace',
                    color: theme.palette.mode === 'dark' ? '#8b949e' : '#6e7781',
                },
            }),
        },
    },

    // Code-style chip
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: '"Fira Code", "Consolas", monospace',
                fontSize: '12px',
                borderRadius: '4px',
                backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,

                '&.MuiChip-filled': {
                    backgroundColor: alpha('#58a6ff', 0.1),
                    color: '#58a6ff',
                    border: `1px solid ${alpha('#58a6ff', 0.3)}`,
                },

                '& .MuiChip-label': {
                    padding: '0 8px',

                    '&::before': {
                        content: '"#"',
                        marginRight: '2px',
                        opacity: 0.5,
                    },
                },
            }),
        },
    },

    // Terminal-style paper
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#ffffff',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,
                borderRadius: '6px',
                fontFamily: '"Fira Code", "Consolas", monospace',
            }),
        },
    },

    // Code editor tabs
    MuiTabs: {
        styleOverrides: {
            root: ({ theme }) => ({
                minHeight: 36,
                backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
                borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,
            }),

            indicator: ({ theme }) => ({
                height: 3,
                backgroundColor: '#f78166',
                borderRadius: '3px 3px 0 0',
            }),
        },
    },

    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: '"Fira Code", "Consolas", monospace',
                fontSize: '13px',
                textTransform: 'none',
                minHeight: 36,
                padding: '6px 16px',
                color: theme.palette.mode === 'dark' ? '#8b949e' : '#6e7781',

                '&.Mui-selected': {
                    color: theme.palette.mode === 'dark' ? '#c9d1d9' : '#24292e',
                },

                '&::before': {
                    content: '"📄"',
                    marginRight: '6px',
                    fontSize: '12px',
                },
            }),
        },
    },

    // Terminal-style dialog
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#ffffff',
                border: `2px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            }),
        },
    },

    // Code-style table
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: '"Fira Code", "Consolas", monospace',
                fontSize: '13px',
                borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#30363d' : '#d0d7de'}`,
                padding: '8px 16px',
            }),

            head: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#f0f6fc' : '#24292e',
            }),
        },
    },

    // Terminal-style alert
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: '"Fira Code", "Consolas", monospace',
                borderRadius: '6px',
                border: '1px solid',

                '&.MuiAlert-standardSuccess': {
                    backgroundColor: alpha('#238636', 0.1),
                    borderColor: '#238636',
                    color: '#3fb950',

                    '& .MuiAlert-icon': {
                        color: '#238636',
                    },
                },

                '&.MuiAlert-standardError': {
                    backgroundColor: alpha('#da3633', 0.1),
                    borderColor: '#da3633',
                    color: '#f85149',

                    '& .MuiAlert-icon': {
                        color: '#da3633',
                    },
                },

                '&.MuiAlert-standardWarning': {
                    backgroundColor: alpha('#d29922', 0.1),
                    borderColor: '#d29922',
                    color: '#e3b341',

                    '& .MuiAlert-icon': {
                        color: '#d29922',
                    },
                },

                '&.MuiAlert-standardInfo': {
                    backgroundColor: alpha('#58a6ff', 0.1),
                    borderColor: '#58a6ff',
                    color: '#79c0ff',

                    '& .MuiAlert-icon': {
                        color: '#58a6ff',
                    },
                },
            }),
        },
    },
};

export default developerComponentOverrides;