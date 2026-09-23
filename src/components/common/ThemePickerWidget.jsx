import React, { useState, useMemo } from 'react';
import {
  IconButton,
  Drawer,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  useTheme,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setComponentOverride, setTypography, setAnimation, setAnimationSpeed } from '../../reducers/themeSlice';
import ThemeService from '../../services/ThemeService';
import { getAllThemes } from '../../themes/themeRegistry';
import { getAvailableComponentOverrideIds } from '../../themes/muicomponents';
import { getAvailableTypographyIds } from '../../themes/typography';
import { getAvailableAnimationIds } from '../../themes/animations';
import { buildThemeExport } from '../../themes/exportTheme';
import { downloadJson } from '../../utilities/downloadFile';

const ThemePickerWidget = React.memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFeel, setShowFeel] = useState(false);

  const currentTheme = useSelector(state => state.theme.mode);
  const currentComponentOverride = useSelector(state => state.theme.componentOverride);
  const currentTypography = useSelector(state => state.theme.typography);
  const currentAnimation = useSelector(state => state.theme.animation);
  const currentAnimationSpeed = useSelector(state => state.theme.animationSpeed);
  const currentReducedMotion = useSelector(state => state.theme.reducedMotion);

  const themes = useMemo(() => getAllThemes(), []);
  const componentOverrides = useMemo(() => getAvailableComponentOverrideIds(), []);
  const typographies = useMemo(() => getAvailableTypographyIds(), []);
  const animations = useMemo(() => getAvailableAnimationIds(), []);

  const handleThemeSelect = (themeId) => {
    dispatch(setTheme(themeId));
    ThemeService.setTheme(themeId);
  };

  const handleComponentOverrideChange = (overrideId) => {
    dispatch(setComponentOverride(overrideId));
    ThemeService.setComponentOverride(overrideId);
  };

  const handleTypographyChange = (typographyId) => {
    dispatch(setTypography(typographyId));
    ThemeService.setTypography(typographyId);
  };

  const handleAnimationChange = (animationId) => {
    dispatch(setAnimation(animationId));
  };

  const handleAnimationSpeedChange = (speed) => {
    dispatch(setAnimationSpeed(speed));
  };

  const handleExport = () => {
    const exportData = buildThemeExport({
      themeId: currentTheme,
      componentOverride: currentComponentOverride,
      typography: currentTypography,
      animation: currentAnimation,
      animationSpeed: currentAnimationSpeed,
      reducedMotion: currentReducedMotion,
    });

    const timestamp = new Date().toISOString().split('T')[0];
    downloadJson(`portfolio-theme-${currentTheme}-${timestamp}.json`, exportData);
  };

  return (
    <>
      <Tooltip title="Theme picker">
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            boxShadow: 3,
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 420,
            p: 2,
            overflowY: 'auto',
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Theme Customizer
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Choose a Theme
        </Typography>
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {themes.map((themeItem) => (
            <Grid item xs={6} key={themeItem.id}>
              <Paper
                onClick={() => handleThemeSelect(themeItem.id)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  border: currentTheme === themeItem.id ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                  backgroundColor: currentTheme === themeItem.id ? theme.palette.action.selected : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 0.5,
                    height: 24,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: themeItem.palette.primary.main,
                      borderRadius: '4px 0 0 4px',
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: themeItem.palette.secondary.main,
                      borderRadius: '0 4px 4px 0',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                  {themeItem.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant={showFeel ? 'contained' : 'outlined'}
          onClick={() => setShowFeel(!showFeel)}
          sx={{ mb: 2 }}
        >
          {showFeel ? 'Hide' : 'Show'} Feel Settings
        </Button>

        {showFeel && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }}>Component Style</FormLabel>
              <Select value={currentComponentOverride} onChange={(e) => handleComponentOverrideChange(e.target.value)}>
                {componentOverrides.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }}>Typography</FormLabel>
              <Select value={currentTypography} onChange={(e) => handleTypographyChange(e.target.value)}>
                {typographies.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }}>Animation Pack</FormLabel>
              <Select value={currentAnimation} onChange={(e) => handleAnimationChange(e.target.value)}>
                {animations.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }}>Animation Speed</FormLabel>
              <Select value={currentAnimationSpeed} onChange={(e) => handleAnimationSpeedChange(e.target.value)}>
                <MenuItem value={0.5}>Slow</MenuItem>
                <MenuItem value={1}>Normal</MenuItem>
                <MenuItem value={1.5}>Fast</MenuItem>
                <MenuItem value={2}>Very Fast</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Button fullWidth variant="contained" color="primary" onClick={handleExport}>
          Export as JSON
        </Button>
      </Drawer>
    </>
  );
});

ThemePickerWidget.displayName = 'ThemePickerWidget';

export default ThemePickerWidget;
