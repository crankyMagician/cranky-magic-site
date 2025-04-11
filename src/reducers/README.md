# 🪝 Magical React Hooks Repository 🪄

> "Hooks are like magical spells - small incantations of code that, when properly invoked, give incredible powers to your components!" - The CrankyMagician's Guide to Modern Enchantments

## 📚 Mystical Map of Hooks 📚

```
hooks/
├── useAppInitialization.js      # Initialization magic when app starts 🌟
├── useAuth.js                   # Authentication spells 🔐
├── useAuthNavigation.js         # Navigation after auth state changes 🧭
├── useAuthentication.js         # Another auth hook (because ONE is never enough!) 🔑
├── useBusiness.js               # Business data management enchantments 💼
├── useCustomTranslation.js      # Language translation magic 🌐
├── useLogout.js                 # The "Get me out of here!" spell 🚪
├── useMatrixText.js             # Matrix-style text scrambling effects 💻
├── useSpatialTheme.js           # Spatial theme magical effects ✨
├── useStoredPreferences.js      # User preference persistence enchantments 💾
├── useStoredTheme.js            # Theme persistence spells 🎨
└── useSyncLanguage.js           # Language synchronization magic 🔄
```

## ✨ Purpose of this Magical Arsenal ✨

This folder contains ALL the custom React hooks that make our app MAGICAL! These hooks are reusable pieces of logic that components can use to gain special powers without duplicating code. Think of them as magical potions that components can drink to gain specific abilities!

## 🧙‍♂️ How These Magical Hooks Work 🧙‍♂️

### 🔐 Authentication Magic

```javascript
// useAuth.js - The MOST POWERFUL authentication spell!
export const useAuth = () => {
    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [logoutApi] = useLogoutMutation();
    
    // ✨ Authentication state from Redux ✨
    const token = useSelector(selectCurrentToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // 🔮 Login spell that calls the API and updates Redux state
    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials).unwrap();
            if (response.token) {
                dispatch(setCredentials({
                    user: response.user,
                    token: response.token
                }));
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setError(error.data?.message || 'Login failed'));
            return false;
        }
    };

    // 🧹 Logout cleanup spell
    const handleLogout = async () => {
        try {
            if (token) {
                await logoutApi({ token });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(logout());
        }
    };

    return {
        isAuthenticated,
        token,
        login: handleLogin,
        logout: handleLogout,
        // Other magical powers...
    };
};
```

### 🌐 Translation Enchantments

```javascript
// useCustomTranslation.js - Making your app speak ANY language!
const useCustomTranslation = () => {
    const { t, i18n } = useTranslation();

    // 📚 Translate with magical logging powers
    const translate = (key, options) => {
        logInfo(`Translating key: "${key}"`, 'purple');
        return t(key, options);
    };

    // 🔄 Change language with error handling spells
    const changeLanguage = (lang) => {
        logInfo(`Attempting to change language to "${lang}"`, 'blue');
        return i18n.changeLanguage(lang).then(() => {
            logInfo(`Successfully changed language to "${lang}"`, 'blue');
        }).catch(error => {
            logError(`Failed to change language to "${lang}": ${error}`, 'red');
            throw error;
        });
    };

    return { 
        translate, 
        changeLanguage, 
        currentLanguage: i18n.language 
    };
};
```

### 🎨 Theme Management Sorcery

```javascript
// useSpatialTheme.js - For MATRIX-LEVEL UI effects!
export const useSpatialTheme = () => {
    const themeMode = useSelector(state => state.theme.mode);
    const [themePrefs, setThemePrefs] = useState(ThemeService.getThemePreferences());
    
    // 🌓 Light/dark detection
    const isDark = themeMode === 'dark';
    const isSpatialTheme = themeMode === 'light' || themeMode === 'dark';

    // 🔮 Get glass morphism effect (SUPER COOL!)
    const getGlassMorphismStyle = (opacity = 0.7) => ({
        background: isDark
            ? `rgba(30, 30, 30, ${opacity})`
            : `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: isDark
            ? '1px solid rgba(214, 90, 49, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    });

    // Many more magical styling functions...

    return {
        themeMode,
        themePrefs,
        isDark,
        isSpatialTheme,
        updatePreference,
        getGlassMorphismStyle,
        getGlowEffect,
        getDataDisplayStyle,
        getTerminalStyle,
        getFuturisticCardStyle,
        getAnimationDuration,
    };
};
```

### 💻 Matrix Text Scrambling Magic

```javascript
// useMatrixText.js - For when BORING text just won't do!
export const useMatrixText = (finalText, options = {}) => {
    const {
        speed = 30,
        scrambleChars = '01010100100101110ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]><;:/?.,"\'',
        onComplete = null,
        autoStart = true,
        iterations = 2,
    } = options;

    // State for the magical scrambling effect
    const [displayText, setDisplayText] = useState('');
    const [isActive, setIsActive] = useState(autoStart);
    const [isFinalizing, setIsFinalizing] = useState(false);
    
    // More Matrix text scrambling magic...

    return {
        text: displayText || (isActive ? '' : finalText),
        startScramble,
        stopScramble,
        resetScramble,
        isActive,
    };
};
```

## 🧙‍♂️ Creating Your Own Magical Hooks 🧙‍♂️

Want to create your own magical hook? Follow these MYSTICAL STEPS:

### 1. Name Your Hook with the "use" Prefix

```javascript
// ALWAYS start with "use" or the React gods will be ANGRY!
export const useYourMagicalHook = () => {
    // Magic goes here...
};
```

### 2. Use Other Hooks Inside Your Hook

```javascript
export const useYourMagicalHook = () => {
    // Summon React's built-in magical powers
    const [state, setState] = useState(initialValue);
    
    // Use Redux magical powers
    const dispatch = useDispatch();
    const someValue = useSelector(selectSomething);
    
    // Use our own magical powers
    const { isDark } = useSpatialTheme();
    
    // More magic...
};
```

### 3. Return the Magical Values and Functions

```javascript
export const useYourMagicalHook = () => {
    // ... magic happening ...
    
    // Return your magical powers for components to use
    return {
        magicalValue,
        castSpell1,
        castSpell2,
    };
};
```

### 4. Use Your Hook in Components

```javascript
const YourMagicalComponent = () => {
    // Invoke your magical hook
    const { magicalValue, castSpell1 } = useYourMagicalHook();
    
    return (
        <div>
            <p>Magic value: {magicalValue}</p>
            <button onClick={castSpell1}>Cast Spell</button>
        </div>
    );
};
```

## 🧙‍♂️ The CrankyMagician's Hooks Tips 🧙‍♂️

1. **DON'T CALL HOOKS CONDITIONALLY!** They must be called at the top level of your component or you'll ANGER THE REACT GODS!

2. **CUSTOM HOOKS SHOULD DO ONE THING WELL!** Just like a specific spell for a specific purpose!

3. **REUSE EXISTING HOOKS WHEN POSSIBLE!** No need to reinvent the magical wheel!

4. **ADD COLORFUL LOGGING** to your hooks for easier debugging. The console should look like a RAINBOW when your app runs!

5. **USE MEMOIZATION** for expensive calculations. React.useMemo and useCallback are your PERFORMANCE MAGIC friends!

```javascript
// Example of proper memoization in a hook
export const useMagicalCalculation = (input) => {
    // This calculation only runs when input changes!
    const result = useMemo(() => {
        console.log('✨ Performing expensive magical calculation! ✨');
        return performExpensiveCalculation(input);
    }, [input]);
    
    return result;
};
```

---

*"Hooks are like magical spells - tiny pieces of code that do incredible things. The more you master, the more powerful your React wizardry becomes!"* - The CrankyMagician

*P.S. If your hooks are causing infinite loops, you're probably forgetting dependency arrays. ALWAYS check your dependency arrays or you'll be stuck in a TIME LOOP FOREVER! ⏰*