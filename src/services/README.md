# 🧙‍♂️ Magical Services Repository ⚗️

> "Services are like magical familiars - they perform the mundane tasks so your components can focus on their true purpose!" - The CrankyMagician's Guide to Clean Component Architecture

## 📚 Map of Magic Services 📚

```
services/
├── AuthTokenService.js       # Authentication token management 🔐
├── LanguageService.js        # Language preference persistence 🌐
├── PreferenceService.js      # User preferences storage 💾
└── ThemeService.js           # Theme management and persistence 🎨
```

## ✨ Purpose of this Magical Chamber ✨

This folder contains ALL the service classes that handle specific functionality across your application. These services act as MAGICAL ABSTRACTIONS over complex operations, particularly those involving localStorage, sessionStorage, or other browser APIs!

Services are the UNSUNG HEROES of your app - they do the dirty work so your components and hooks can remain CLEAN and FOCUSED! ✨

## 🧪 How These Magical Services Work 🧪

### 🔐 Authentication Token Service

```javascript
// AuthTokenService.js - Your SECURITY WIZARD! 🧙‍♂️
class AuthTokenService {
    // Define storage keys
    static isAuthenticatedKey = 'isAuthenticated';
    static userKey = 'user';
    static authTokenKey = 'authToken';
    static userRolesKey = 'userRoles';
    // More keys...

    // ✨ Store authentication info in localStorage
    static setAuthInfo({ isAuthenticated, user, authToken, roles, businesses, activeBusiness }) {
        try {
            // Store basic auth info
            localStorage.setItem(this.isAuthenticatedKey, isAuthenticated);
            localStorage.setItem(this.userKey, JSON.stringify(user));
            localStorage.setItem(this.authTokenKey, authToken);
            
            // Store additional data
            localStorage.setItem(this.userRolesKey, JSON.stringify(roles || []));
            localStorage.setItem(this.userBusinessesKey, JSON.stringify(businesses || []));
            localStorage.setItem(this.activeBusinessKey, JSON.stringify(activeBusiness || null));

            // 🕰️ Decode token and store expiry
            if (authToken) {
                const decodedToken = TokenDecoder.decode(authToken);
                if (decodedToken?.exp) {
                    localStorage.setItem(this.tokenExpiryKey, decodedToken.exp.toString());
                }
            }

            console.log('Auth info stored successfully:', {
                isAuthenticated,
                userId: user?.id,
                hasToken: !!authToken,
                rolesCount: roles?.length || 0,
                businessesCount: businesses?.length || 0
            });
        } catch (error) {
            console.error('Error storing auth info:', error);
        }
    }

    // 🔍 Retrieve authentication info from localStorage
    static getAuthInfo() {
        try {
            const isAuthenticated = localStorage.getItem(this.isAuthenticatedKey) === 'true';
            const user = JSON.parse(localStorage.getItem(this.userKey) || '{}');
            const authToken = localStorage.getItem(this.authTokenKey);
            // More retrievals...

            // 🕵️‍♂️ Check if token is expired
            if (authToken) {
                const isExpired = tokenExpiry && Date.now() >= parseInt(tokenExpiry) * 1000;
                if (isExpired) {
                    console.log('Token expired, clearing auth info');
                    this.clearAuthInfo();
                    return { isAuthenticated: false };
                }
            }

            return { 
                isAuthenticated, 
                user, 
                authToken,
                roles,
                businesses,
                activeBusiness,
                tokenExpiry: tokenExpiry ? new Date(parseInt(tokenExpiry) * 1000) : null
            };
        } catch (error) {
            console.error('Error retrieving auth info:', error);
            return { isAuthenticated: false };
        }
    }

    // 🧹 Clear all authentication info
    static clearAuthInfo() {
        try {
            localStorage.removeItem(this.isAuthenticatedKey);
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.authTokenKey);
            // More removals...
            console.log('Auth info cleared successfully');
        } catch (error) {
            console.error('Error clearing auth info:', error);
        }
    }

    // 🧩 Helpful role checking utility
    static hasRole(role) {
        const { roles } = this.getAuthInfo();
        return roles.includes(role);
    }

    // 👑 Check if user is an admin
    static isAdmin() {
        return this.hasRole('admin');
    }

    // More magical authentication utilities...
}

export default AuthTokenService;
```

### 🌐 Language Service

```javascript
// LanguageService.js - Your MULTILINGUAL ASSISTANT! 🗣️
class LanguageService {
    static languageKey = 'appLanguage';

    // 💾 Store language preference
    static setLanguage(language) {
        localStorage.setItem(this.languageKey, language);
    }

    // 🔍 Get language preference with fallback
    static getLanguage() {
        return localStorage.getItem(this.languageKey) || 'en'; // Default to English
    }
}

export default LanguageService;
```

### 🎨 Theme Service

```javascript
// ThemeService.js - Your UI APPEARANCE WIZARD! ✨
class ThemeService {
    static themeKey = 'appTheme';
    static themePrefsKey = 'themePreferences';

    // Available themes - SO MANY OPTIONS! 🌈
    static availableThemes = [
        'light', 'dark', 'munchie', 'munchie_dark', 'professional',
        'startup', 'memphis', 'altTheme', 'sunset', 'mint',
        'retro_neon', 'high_contrast'
    ];

    // ✨ Set the main theme
    static setTheme(theme) {
        if (this.availableThemes.includes(theme)) {
            localStorage.setItem(this.themeKey, theme);
            console.log(`Theme set to: ${theme}`);
        } else {
            console.warn(`Invalid theme: ${theme}. Using default light theme.`);
            localStorage.setItem(this.themeKey, 'light');
        }
    }

    // 🔍 Get current theme with validation
    static getTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            return savedTheme;
        }
        return 'light'; // Default to light theme
    }

    // 🌓 Check if current theme is dark mode
    static isDarkMode() {
        const theme = this.getTheme();
        return theme === 'dark' || theme === 'munchie_dark' || theme === 'retro_neon';
    }

    // 🔄 Toggle between light and dark modes
    static toggleDarkMode() {
        const currentTheme = this.getTheme();
        let newTheme;

        // Match themes with their dark counterparts
        switch(currentTheme) {
            case 'light':
                newTheme = 'dark';
                break;
            case 'dark':
                newTheme = 'light';
                break;
            // More theme toggles...
            default:
                newTheme = this.isDarkMode() ? 'light' : 'dark';
        }

        this.setTheme(newTheme);
        return newTheme;
    }

    // 🎛️ Save additional theme preferences
    static setThemePreferences(preferences) {
        localStorage.setItem(this.themePrefsKey, JSON.stringify(preferences));
    }

    // More magical theme utilities...
}

export default ThemeService;
```

## 🧙‍♂️ Creating Your Own Magical Service 🧙‍♂️

Want to create your own magical service? Follow these ENCHANTED STEPS:

### 1. Create a New Service File

```javascript
// MyMagicalService.js
class MyMagicalService {
    // Define your storage keys as static properties
    static magicalDataKey = 'magicalData';
    static magicalSettingsKey = 'magicalSettings';
    
    // 💾 Method to save magical data
    static saveMagicalData(data) {
        try {
            localStorage.setItem(this.magicalDataKey, JSON.stringify(data));
            console.log('✨ Magical data saved successfully!', data);
            return true;
        } catch (error) {
            console.error('🔥 Failed to save magical data:', error);
            return false;
        }
    }
    
    // 🔍 Method to retrieve magical data
    static getMagicalData() {
        try {
            const data = localStorage.getItem(this.magicalDataKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('🔥 Failed to retrieve magical data:', error);
            return null;
        }
    }
    
    // 🧹 Method to clear magical data
    static clearMagicalData() {
        try {
            localStorage.removeItem(this.magicalDataKey);
            console.log('🧹 Magical data cleared successfully!');
            return true;
        } catch (error) {
            console.error('🔥 Failed to clear magical data:', error);
            return false;
        }
    }
    
    // ✨ Add more magical methods as needed...
}

export default MyMagicalService;
```

### 2. Use Your Service in Components, Hooks, or Redux

```javascript
import MyMagicalService from '../services/MyMagicalService';

// In a component
const MagicalComponent = () => {
    const [magicalData, setMagicalData] = useState(null);
    
    useEffect(() => {
        // Load initial data
        const storedMagicalData = MyMagicalService.getMagicalData();
        if (storedMagicalData) {
            setMagicalData(storedMagicalData);
        }
    }, []);
    
    const handleSaveMagic = () => {
        const newMagicalData = {
            spell: 'Fireball',
            power: 9000,
            cooldown: '3s'
        };
        
        // Save to localStorage via service
        if (MyMagicalService.saveMagicalData(newMagicalData)) {
            setMagicalData(newMagicalData);
        }
    };
    
    return (
        <div>
            {magicalData ? (
                <div>
                    <h2>✨ Current Magical Data ✨</h2>
                    <p>Spell: {magicalData.spell}</p>
                    <p>Power: {magicalData.power}</p>
                    <p>Cooldown: {magicalData.cooldown}</p>
                </div>
            ) : (
                <p>No magical data found!</p>
            )}
            
            <button onClick={handleSaveMagic}>
                Save New Magical Data! 💾
            </button>
        </div>
    );
};
```

## 🧙‍♂️ The CrankyMagician's Service Tips 🧙‍♂️

1. **ALWAYS USE STATIC METHODS!** Services should be stateless and easy to use from anywhere!

2. **ERROR HANDLING IS MANDATORY!** LocalStorage can fail (private browsing, storage limits) - always use try/catch!

3. **LOG EVERYTHING!** But make the logs COLORFUL and INFORMATIVE so you can easily find them!

4. **USE CONSISTENT NAMING!** Your service methods should follow patterns:
    - `get...` for retrieving data
    - `set...` for saving data
    - `clear...` for removing data
    - `is...` or `has...` for boolean checks

5. **ADD DEFAULT VALUES!** When retrieving data, always have sensible defaults if the data doesn't exist!

```javascript
// Example of proper default handling
static getMagicalPreferences() {
    try {
        const prefs = localStorage.getItem(this.prefsKey);
        return prefs ? JSON.parse(prefs) : {
            wizardLevel: 1,
            magicSchool: 'evocation',
            favoriteSpell: 'magic missile',
            darkMode: false
        };
    } catch (error) {
        console.error('Failed to get magical preferences:', error);
        return {
            wizardLevel: 1,
            magicSchool: 'evocation',
            favoriteSpell: 'magic missile',
            darkMode: false
        };
    }
}
```

---

*"Services are the loyal familiars of your application - they handle the repetitive tasks so your components can focus on their true purpose: making your users say WOW!"* - The CrankyMagician

*P.S. If you find yourself copying and pasting localStorage code in multiple components, you're doing it WRONG! Create a service and centralize that logic! Your future self will thank you with magical cookies! 🍪*