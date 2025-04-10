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

### Palette Template 

```js
// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const corporateMemphisPalette = {
    // Standard MUI properties
    mode: 'light', // or 'dark'
    primary: {
        main: '#0D47A1', // A confident, deep blue for primary actions
        light: '#5472D3', // Brighter for a touch of Memphis vibrancy
        dark: '#002171', // Solid and dependable for corporate trust
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#FF8F00', // Warm and inviting, yet vibrant for secondary accents
        light: '#FFB74D', // Cheerful for a lighter, engaging feel
        dark: '#C25E00', // Depth and warmth for emphasis
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#D32F2F', // Bold and alerting, in line with Memphis intensity
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#FFB300', // Bright and cautionary, with a playful edge
        light: '#FFD54F', // A softer approach to warnings
        dark: '#FFA000', // A deeper shade for serious alerts
        contrastText: '#000000',
    },
    info: {
        main: '#546E7A', // Trustworthy yet subdued for information
        light: '#819CA9', // A lighter shade for informational contrast
        dark: '#29434E', // Ensures key info stands out in a corporate setting
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#43A047', // A lively, optimistic green for success
        light: '#66BB6A',
        dark: '#2E7D32',
        contrastText: '#FFFFFF',
    },
    background: {
        default: '#FFFFFF', // A clean, neutral backdrop for clarity and focus
        paper: '#FAFAFA', // Soft and subtle for differentiation without distraction
    },
    text: {
        primary: '#212121', // Strong and legible, anchoring the design in professionalism
        secondary: '#424242', // A soft contrast for less dominant text, adds depth
        disabled: '#757575',
    },
    action: {
        active: '#5472D3', // Clear and engaging for interactive elements
        hover: '#E0E0E0', // Understated for hover, allowing color to signal action
        hoverOpacity: 0.08, // Subtle interaction cue, keeping with Memphis's playful spirit
        selected: '#BDBDBD', // Neutral yet distinct for selected states
        selectedOpacity: 0.14, // Visibility without overwhelming the vibrant Memphis style
        disabled: '#E0E0E0', // Blends into the corporate aesthetic while indicating non-interactivity
        disabledBackground: '#BDBDBD', // Consistent, subdued for disabled states
        disabledOpacity: 0.38, // Clearly marked, maintaining usability
        focus: '#0D47A1', // Focused elements stand out with deep blue for accessibility
        focusOpacity: 0.12, // Ensures focus is noticeable without dominating the design
        activatedOpacity: 0.12, // Consistent with focus for an integrated interactive experience
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(13, 71, 161, 0.3) 0%, rgba(13, 71, 161, 0) 100%)',
        glowEffect: '0 0 10px rgba(13, 71, 161, 0.5), 0 0 20px rgba(13, 71, 161, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(13, 71, 161, 0.15) 0%, rgba(84, 114, 211, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(245, 245, 245, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background
        codeBackground: 'rgba(247, 247, 247, 0.95)', // Background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(13, 71, 161, 0.2)', // Grid line color
        digitalPulse: 'rgba(13, 71, 161, 0.7)', // Pulsing effect color
        matrixRain: 'rgba(13, 71, 161, 0.3)', // Digital rain effect
        scanline: 'rgba(13, 71, 161, 0.05)', // Scanline effect for Matrix theme

        // Helper getters for component overrides
        getAlphaColor: (color, alpha) => {
            // Helper to convert hex to rgba with alpha
            if (!color) return null;

            // Check if already rgba
            if (color.startsWith('rgba')) return color;

            // Convert hex to rgba
            let hex = color.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    },

    // Function to properly get a color with alpha (fallback for components that don't use the theme function)
    getAlphaColor: function(color, alpha) {
        if (!color) return null;
        return this.custom.getAlphaColor(color, alpha);
    },

    // Add tertiary color just like spatial themes use
    tertiary: {
        main: '#B71C1C', // An assertive, dynamic color for standout elements
        light: '#E57373',
        dark: '#7F0000',
        contrastText: '#FFFFFF',
    },
};
```

### 🅰️ Typography Template

```js
// example/themes/typography/typographyTemplate.js

/**
 * Typography Template
 * Use this as a starting point to define a custom typography system
 * compatible with your component library or design system.
 */

const typographyTemplate = {
  // Global font family
  fontFamily: 'YourDefaultFont, sans-serif',

  h1: {
    fontFamily: 'YourHeadingFont, sans-serif',
    fontWeight: 700,
    fontSize: '3rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  h2: {
    fontFamily: 'YourHeadingFont, sans-serif',
    fontWeight: 700,
    fontSize: '2.5rem',
    letterSpacing: '0.04em',
  },
  h3: {
    fontFamily: 'YourSubheadingFont, sans-serif',
    fontWeight: 600,
    fontSize: '2rem',
    letterSpacing: '0.03em',
  },
  h4: {
    fontFamily: 'YourSubheadingFont, sans-serif',
    fontWeight: 600,
    fontSize: '1.75rem',
    letterSpacing: '0.02em',
  },
  h5: {
    fontFamily: 'YourDefaultFont, sans-serif',
    fontWeight: 500,
    fontSize: '1.5rem',
  },
  h6: {
    fontFamily: 'YourDefaultFont, sans-serif',
    fontWeight: 500,
    fontSize: '1.25rem',
  },
  body1: {
    fontFamily: 'YourDefaultFont, sans-serif',
    fontWeight: 400,
    fontSize: '1rem',
    letterSpacing: '0.01em',
  },
  body2: {
    fontFamily: 'YourDefaultFont, sans-serif',
    fontWeight: 400,
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
  },
  button: {
    fontFamily: 'YourActionFont, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  caption: {
    fontFamily: 'YourDefaultFont, sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
  },
  overline: {
    fontFamily: 'YourDefaultFont, sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  // Additional styles for special elements
  code: {
    fontFamily: 'YourMonoFont, monospace',
    fontWeight: 500,
    fontSize: '0.9rem',
    letterSpacing: '0.03em',
  },
  dataLabel: {
    fontFamily: 'YourTechFont, sans-serif',
    fontWeight: 500,
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  digitDisplay: {
    fontFamily: 'YourTechFont, sans-serif',
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '0.15em',
  },
};

export default typographyTemplate;

```

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