# 🎨 Theme System Documentation

This document explains the theme system architecture and how to extend it with new themes or make it fully dynamic.

## 📁 File Structure

```
src/
└── themes/
    ├── theme.js                 # Main theme creation logic
    ├── themeMappings.js         # Maps theme names to palette objects
    ├── fontMappings.js          # Maps theme names to typography objects
    ├── breakpoints/
    │   └── breakpoints.js       # Responsive breakpoint definitions
    ├── palettes/
    │   ├── spatialModsLight.js  # Light theme palette
    │   ├── spatialModsDark.js   # Dark theme palette
    │   ├── retroNeonPalette.js  # Retro neon palette
    │   └── ... (other palettes)
    ├── typography/
    │   ├── spatialTypograhpy.js # Matrix-inspired typography
    │   ├── darkTypography.js    # Dark theme typography
    │   └── ... (other typography)
    └── muicomponents/
        ├── spatialComponentsOverrides.js # Spatial theme component styles
        └── muiComponentsOverrides.js     # Default component styles
```

## 🧩 How It Works

1. **Theme Selection**:
    - Redux state manages the current theme through `themeSlice.js`
    - `ThemeService.js` handles theme persistence in localStorage

2. **Theme Application**:
    - `theme.js` creates a complete MUI theme object using:
        - Palette from `themeMappings.js`
        - Typography from `fontMappings.js`
        - Component overrides based on theme type
        - Special effects for spatial themes

3. **Theme Components**:
    - Each theme has a palette (colors) and typography (fonts)
    - Some themes have special component styling overrides
    - Spatial themes add Matrix-inspired visual effects

4. **Theme Switching**:
    - `ThemeToggle.js` provides UI for theme selection
    - Theme preferences (animations, contrast) saved in `ThemeService`

## 🔄 Theme Flow

```
User selects theme → ThemeToggle dispatches action → Redux updates state → 
ThemeService saves preference → App wraps with ThemeProvider → 
getTheme() creates theme object → MUI applies theme
```

## 🚀 Extending the Theme System

### Adding a New Theme

1. **Create palette file**:
    - Add a new file in `palettes/` folder (e.g., `myNewPalette.js`)
    - Export palette object with colors (see existing palettes for reference)

2. **Create typography file**:
    - Add a new file in `typography/` folder (e.g., `myNewTypography.js`)
    - Define font settings for different text elements

3. **Update mappings**:
    - Add import in `themeMappings.js` and add to `themeModeMappings` object
    - Add import in `fontMappings.js` and add to `typographyModeMappings` object

4. **Add to theme list**:
    - Update `themes` array in `themeSlice.js`
    - Add to `availableThemes` array in `ThemeService.js`
    - Add display name in `getThemeDisplayName` function
    - Add to theme list in `ThemeToggle.js` with an appropriate icon

### Building Dynamic Themes

#### Phase 1: Theme Builder UI 🛠️

- [ ] Create ThemeBuilder component with color pickers
- [ ] Add typography and component preview sections
- [ ] Build theme saving and loading functionality

#### Phase 2: Theme Generation Engine 🔧

- [ ] Create algorithms to generate complete palettes from base colors
- [ ] Build typography scaling functions
- [ ] Implement theme validation and error checking

#### Phase 3: Storage and Management 💾

- [ ] Design database schema for custom themes
- [ ] Build APIs for theme CRUD operations
- [ ] Create theme sharing and export functionality

#### Phase 4: Theme Composition 🧪

- [ ] Refactor theme creation to be more modular
- [ ] Implement theme inheritance and overrides
- [ ] Add theme version control

## 🔍 Key Concepts

- **Theme Mode**: Identifier for a specific theme (e.g., 'light', 'dark', 'retro_neon')
- **Palette**: Object containing all colors for a theme
- **Typography**: Font settings for different text elements
- **Component Overrides**: Custom styling for MUI components
- **Theme Preferences**: User-specific settings like animations and contrast

## 🚦 Tips for Theme Development

- Test themes on both light and dark backgrounds
- Ensure sufficient contrast for accessibility
- Check responsiveness across different screen sizes
- Consider adding a theme preview feature
- Keep component overrides consistent across themes