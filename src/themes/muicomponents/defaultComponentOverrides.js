// src/themes/muicomponents/defaultComponentOverrides.js
import { alpha } from '@mui/material/styles';

const defaultComponentOverrides = {
    // Default MUI Button styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 500,
                transition: theme.transitions.create(
                    ['background-color', 'box-shadow', 'border-color', 'color'],
                    {
                        duration: theme.transitions.duration.short,
                    }
                ),
                '&:hover': {
                    boxShadow: theme.shadows[2],
                },
                '&:active': {
                    boxShadow: theme.shadows[1],
                },
            }),
            contained: ({ theme }) => ({
                boxShadow: theme.shadows[2],
                '&:hover': {
                    boxShadow: theme.shadows[4],
                },
                '&:active': {
                    boxShadow: theme.shadows[1],
                },
            }),
            outlined: ({ theme }) => ({
                borderColor: alpha(theme.palette.primary.main, 0.5),
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
            }),
            text: ({ theme }) => ({
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
            }),
        },
    },

    // Default MUI Card styling
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: theme.shadows[1],
                transition: theme.transitions.create(['box-shadow'], {
                    duration: theme.transitions.duration.short,
                }),
                '&:hover': {
                    boxShadow: theme.shadows[4],
                },
            }),
        },
    },

    // Default MUI Paper styling
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundImage: 'none',
            }),
            rounded: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius * 2,
            }),
            elevation1: ({ theme }) => ({
                boxShadow: theme.shadows[1],
            }),
            elevation2: ({ theme }) => ({
                boxShadow: theme.shadows[2],
            }),
            elevation3: ({ theme }) => ({
                boxShadow: theme.shadows[3],
            }),
        },
    },

    // Default MUI TextField styling
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: theme.palette.divider,
                        transition: theme.transitions.create(['border-color'], {
                            duration: theme.transitions.duration.short,
                        }),
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.text.primary,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                    },
                },
            }),
        },
    },

    // Default MUI Switch styling
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 42,
                height: 26,
                padding: 0,
                '& .MuiSwitch-switchBase': {
                    padding: 0,
                    margin: 2,
                    transitionDuration: '300ms',
                    '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: 0,
                        },
                        '&.Mui-disabled + .MuiSwitch-track': {
                            opacity: 0.5,
                        },
                    },
                    '&.Mui-focusVisible .MuiSwitch-thumb': {
                        color: '#33cf4d',
                        border: '6px solid #fff',
                    },
                    '&.Mui-disabled .MuiSwitch-thumb': {
                        color: 'grey',
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 0.3,
                    },
                },
                '& .MuiSwitch-thumb': {
                    boxSizing: 'border-box',
                    width: 22,
                    height: 22,
                },
            },
            switchBase: ({ theme }) => ({
                padding: 0,
                margin: 2,
                transitionDuration: '300ms',
                '&.Mui-checked': {
                    transform: 'translateX(16px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                        opacity: 1,
                        border: 0,
                    },
                },
            }),
            thumb: ({ theme }) => ({
                boxSizing: 'border-box',
                width: 22,
                height: 22,
                backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#fff',
            }),
            track: ({ theme }) => ({
                borderRadius: 13,
                backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
                opacity: 1,
                transition: theme.transitions.create(['background-color'], {
                    duration: 500,
                }),
            }),
        },
    },

    // Default MUI Chip styling
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                fontWeight: 500,
            }),
            filled: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
            }),
            outlined: ({ theme }) => ({
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
            }),
        },
    },

    // Default MUI Tab styling
    MuiTabs: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
            }),
            indicator: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                height: 3,
            }),
        },
    },

    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'none',
                fontWeight: theme.typography.fontWeightRegular,
                fontSize: theme.typography.pxToRem(15),
                marginRight: theme.spacing(1),
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: theme.typography.fontWeightMedium,
                },
                '&.Mui-focusVisible': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
            }),
        },
    },

    // Default MUI Dialog styling
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: theme.shadows[5],
            }),
        },
    },

    // Default MUI DialogTitle styling
    MuiDialogTitle: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(2),
                fontSize: theme.typography.h6.fontSize,
                fontWeight: theme.typography.fontWeightMedium,
            }),
        },
    },

    // Default MUI DialogContent styling
    MuiDialogContent: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(2),
            }),
        },
    },

    // Default MUI DialogActions styling
    MuiDialogActions: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1, 2, 2),
            }),
        },
    },

    // Default MUI Accordion styling
    MuiAccordion: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[1],
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: '16px 0',
                },
            }),
        },
    },

    // Default MUI Table styling
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
            }),
            head: ({ theme }) => ({
                backgroundColor: theme.palette.grey[50],
                fontWeight: theme.typography.fontWeightMedium,
            }),
        },
    },

    // Default MUI TableRow styling
    MuiTableRow: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&:nth-of-type(odd)': {
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                },
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
            }),
        },
    },

    // Default MUI Alert styling
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
            }),
            standardSuccess: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.success.main, 0.12),
                color: theme.palette.success.dark,
                '& .MuiAlert-icon': {
                    color: theme.palette.success.main,
                },
            }),
            standardError: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.error.main, 0.12),
                color: theme.palette.error.dark,
                '& .MuiAlert-icon': {
                    color: theme.palette.error.main,
                },
            }),
            standardWarning: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.warning.main, 0.12),
                color: theme.palette.warning.dark,
                '& .MuiAlert-icon': {
                    color: theme.palette.warning.main,
                },
            }),
            standardInfo: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.info.main, 0.12),
                color: theme.palette.info.dark,
                '& .MuiAlert-icon': {
                    color: theme.palette.info.main,
                },
            }),
        },
    },

    // Default MUI Snackbar styling
    MuiSnackbar: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiSnackbarContent-root': {
                    borderRadius: theme.shape.borderRadius,
                },
            }),
        },
    },

    // Default MUI Tooltip styling
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.grey[900], 0.9),
                borderRadius: theme.shape.borderRadius,
                fontSize: theme.typography.pxToRem(12),
                padding: theme.spacing(0.75, 1.5),
            }),
            arrow: ({ theme }) => ({
                color: alpha(theme.palette.grey[900], 0.9),
            }),
        },
    },

    // Default MUI ListItem styling
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                },
            }),
        },
    },

    // Default MUI ListItemButton styling
    MuiListItemButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.08),
                },
                '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                },
            }),
        },
    },

    // Default MUI Drawer styling
    MuiDrawer: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[8],
            }),
        },
    },

    // Default MUI AppBar styling
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: theme.shadows[4],
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }),
        },
    },

    // Default MUI Toolbar styling
    MuiToolbar: {
        styleOverrides: {
            root: ({ theme }) => ({
                '@media (min-width: 600px)': {
                    minHeight: 64,
                },
            }),
        },
    },

    // Default MUI LinearProgress styling
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
            }),
            bar: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
            }),
        },
    },

    // Default MUI CircularProgress styling
    MuiCircularProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.primary.main,
            }),
        },
    },

    // Default MUI Skeleton styling
    MuiSkeleton: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.action.disabled, 0.11),
            }),
        },
    },

    // Default MUI Backdrop styling
    MuiBackdrop: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.common.black, 0.5),
            }),
        },
    },

    // Default MUI Select styling
    MuiSelect: {
        styleOverrides: {
            select: ({ theme }) => ({
                '&:focus': {
                    backgroundColor: 'transparent',
                },
            }),
        },
    },

    // Default MUI Menu styling
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[8],
            }),
        },
    },

    // Default MUI MenuItem styling
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.08),
                },
                '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                },
            }),
        },
    },

    // Default MUI Divider styling
    MuiDivider: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderColor: theme.palette.divider,
            }),
        },
    },

    // Default MUI Avatar styling
    MuiAvatar: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
            }),
        },
    },

    // Default MUI Badge styling
    MuiBadge: {
        styleOverrides: {
            badge: ({ theme }) => ({
                fontSize: theme.typography.pxToRem(12),
                height: 20,
                minWidth: 20,
                borderRadius: 10,
            }),
        },
    },

    // Default MUI Breadcrumbs styling
    MuiBreadcrumbs: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiBreadcrumbs-separator': {
                    marginLeft: theme.spacing(1),
                    marginRight: theme.spacing(1),
                },
            }),
        },
    },

    // Default MUI Pagination styling
    MuiPagination: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiPaginationItem-root': {
                    borderRadius: theme.shape.borderRadius,
                },
            }),
        },
    },

    // Default MUI PaginationItem styling
    MuiPaginationItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                },
            }),
        },
    },

    // Default MUI Rating styling
    MuiRating: {
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.warning.main,
            }),
        },
    },

    // Default MUI Slider styling
    MuiSlider: {
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.primary.main,
            }),
            thumb: ({ theme }) => ({
                '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                },
                '&.Mui-active': {
                    boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.primary.main, 0.16)}`,
                },
            }),
        },
    },

    // Default MUI ToggleButton styling
    MuiToggleButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                },
            }),
        },
    },

    // Default MUI IconButton styling
    MuiIconButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.08),
                },
            }),
        },
    },

    // Default MUI Fab styling
    MuiFab: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: theme.shadows[6],
                '&:hover': {
                    boxShadow: theme.shadows[8],
                },
            }),
        },
    },

    // Default MUI SpeedDial styling
    MuiSpeedDial: {
        styleOverrides: {
            fab: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                },
            }),
        },
    },

    // Default MUI Stepper styling
    MuiStepLabel: {
        styleOverrides: {
            label: ({ theme }) => ({
                '&.Mui-active': {
                    color: theme.palette.primary.main,
                },
                '&.Mui-completed': {
                    color: theme.palette.primary.main,
                },
            }),
        },
    },

    // Default MUI StepIcon styling
    MuiStepIcon: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-active': {
                    color: theme.palette.primary.main,
                },
                '&.Mui-completed': {
                    color: theme.palette.primary.main,
                },
            }),
        },
    },
};

export default defaultComponentOverrides;