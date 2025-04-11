# 🧙‍♂️ CrankyMagicReact ✨

[![Enchantment Level](https://img.shields.io/badge/enchantment-MAXIMUM-purple.svg)](https://github.com/crankyMagician/crankyMagicReact)
[![Made with React](https://img.shields.io/badge/made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Powered by Coffee](https://img.shields.io/badge/powered%20by-Coffee%20☕-brown.svg)](https://coffee.org)
[![License](https://img.shields.io/badge/license-MAGICAL-orange.svg)](LICENSE)

## 🪄 "Any sufficiently advanced technology is indistinguishable from magic."  
— Arthur C. Clarke

[Dev Tasks](https://www.notion.so/1cba97b3508c8116b3f5f3326e407b66?pvs=21) | [Documentation](https://www.notion.so/Documentation-1cba97b3508c802fa23ed50189ff90e4?pvs=21) | [Templates](https://www.notion.so/Templates-1d1a97b3508c8028aea3ec6c0ec6ff87?pvs=21)

## ✨ The Magical React Framework That Will Make You Say "WOW!" ✨

Welcome to **CrankyMagicReact** - where React components meet magical enchantments! This isn't your ordinary React framework... it's been infused with the CrankyMagician's special blend of code sorcery to make your development experience *MAGICAL*! 💫

## 🪄 Features That Will BLOW YOUR MIND! 🪄
## 🪄 Features That Will BLOW YOUR MIND! 🪄

### 🌈 Theme Switching Sorcery
Switch between themes faster than the CrankyMagician can say "ABRACADABRA"!
```javascript
// Want dark mode? BOOM! DONE!
useTheme('dark');

// Feeling fancy? Try our special "retro_neon" theme!
useTheme('retro_neon');
```

We've got TONS of themes:
- 🌞 `light` - For those who fear the darkness
- 🌚 `dark` - For coding at 3 AM like a PROPER developer
- 🍔 `munchie` - Food-inspired theme (don't code hungry!)
- 🧁 `munchie_dark` - For midnight snack coding sessions
- 👔 `professional` - For when your boss is watching
- 🚀 `startup` - Looks like every tech startup's website ever
- 📊 `memphis` - Corporate Memphis style for the corporate wizards
- 🎨 `altTheme` - Because you're "not like other developers"
- 🌅 `sunset` - For the aesthetically pleasing sunset vibes
- 🍃 `mint` - Fresh and clean like your code SHOULD be
- 💾 `retro_neon` - Bringing back the 80s because modern UI is too BORING
- 👓 `high_contrast` - For accessibility or for when you're coding without your glasses

### 🗣️ Magical Translation Spells
Make your app speak ANY language with our i18n enchantments!

```javascript
// Want to greet users in Korean? POOF! DONE!
translate('greeting', { language: 'ko' });
```

Supported languages:
- 🇺🇸 English (for boring developers)
- 🇪🇸 Spanish (¡Olé!)
- 🇰🇷 Korean (안녕하세요!)
- 🇫🇷 French (Oui oui baguette!)
- 🇮🇹 Italian (Mamma mia!)
- 🇩🇪 German (Sehr effizient!)
- 🇷🇺 Russian (Привет!)
- 🇯🇵 Japanese (こんにちは!)
- 🇸🇦 Arabic (مرحبا!)
- 🇮🇱 Hebrew (שלום!)

### 🔐 Authentication Wizardry
User authentication so secure, not even the CrankyMagician himself can break in (and he's TRIED)!

```javascript
// Login spell
const { isAuthenticated, token } = await useAuth().login({
  username: 'merlin',
  password: 'itsMagicTime123'
});

// Logout counterspell
useAuth().logout();
```

Features:
- 🔑 JWT token-based authentication
- 👤 User profiles with roles and permissions
- 🔄 Refresh token magic
- 🧠 Token decoding and validation
- 🛡️ Protected routes with AuthRouteWrapper
- 📱 Multi-factor authentication (because ONE factor is for AMATEURS)

### 💼 Business Magic for Business Wizards
Connect your magical business with these INCREDIBLE business features:

```javascript
// Create a magical business portal!
const { businessId } = await useBusiness().businessSignup({
  name: "Wizard's Wand Shop",
  type: "retail",
  taxId: "WAND-123456"
});
```

Business features:
- 🏢 Multi-business support
- 👥 Team member management
- 👑 Role-based permissions (Owner, Admin, Staff, Guest)
- 📨 User invitations
- 🔄 Business switching

### 🔮 Magical Analytics Tracking 🧙‍♂️
Track user spells (actions) with mystical precision!

```javascript
// Import the magical hook
import useAnalytics from './analytics/hooks/useAnalytics';

const YourMagicalComponent = () => {
  // Summon the analytics powers
  const analytics = useAnalytics();
  
  const castButtonSpell = () => {
    // Track this AMAZING click event!
    analytics.trackButtonClick('super_magical_button', {
      spell_power: 'EXTREME',
      mana_cost: 42
    });
    
    // Do your magical stuff here...
  };
  
  return <button onClick={castButtonSpell}>✨ CLICK FOR MAGIC ✨</button>;
};
```

Tracking features:
- 🔍 Page views and time spent tracking
- 🖱️ Button and element click tracking
- 📊 Scroll depth measurement
- 📝 Form interaction tracking
- ⏱️ Performance monitoring
- 💥 Error tracking
- 🛫 Exit intent detection
- 📱 Device and browser data collection
- 🔄 Session tracking
- 🗺️ User journey mapping

### 🎨 Magical UI Components
Components so beautiful, they'll bring a tear to your eye!

```javascript
// Need a responsive video? ALAKAZAM!
<ResponsiveVideoEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

// Want a fancy card with magical hover effects? SHAZAM!
<Card sx={theme.mixins.futuristicCard}>
  <CardContent>✨ Magical Content ✨</CardContent>
</Card>
```

Component features:
- 🌟 Glassmorphism effects
- 🌌 Matrix-inspired UI elements
- 📱 Mobile responsive EVERYTHING
- 🖼️ Image handling utilities
- 📝 Form components with validation
- 📅 Calendar components
- 📊 Data displays with magical animations
- 🧠 Dynamic navigation systems (Sidebar, Navbar, MegaMenu, Hoverbar, Dashboard)

### 🔧 Developer Utilities
Tools to make your development experience LESS CRANKY!

```javascript
// Need to sanitize a hex color? PRESTO!
const rgbaColor = hexToRgba('#FF0000', 0.5);

// Log with STYLE
logInfo('This is an important message!', 'blue');
```

Utility features:
- 🎨 Color manipulation utilities
- 📝 Advanced logging with colors
- 🔧 Form validation
- 🔄 API helper functions
- 📊 Data formatting tools
- 🛠️ Error handling utilities
- 🌐 URL and path utilities

### 🚨 Error Handling Magic
Catch errors before they ruin your magical application!

```javascript
// Wrap your components in this magical shield!
<ErrorBoundary 
  fallback={<p>🧙‍♂️ Oops! The CrankyMagician sneezed during this spell!</p>}
>
  <YourComponent />
</ErrorBoundary>
```

## 🧪 Getting Started (SUPER EASY!) 🧪

### 1️⃣ Clone the Enchanted Repository
```bash
git clone https://github.com/crankyMagician/crankyMagicReact.git
cd crankyMagicReact
```

### 2️⃣ Install the Magic Dependencies
```bash
npm install
# Or if you're a yarn wizard:
yarn
```

### 3️⃣ Configure Environment Variables
Add the following environment variables:

```
# PostHog configuration (https://posthog.com)
REACT_APP_POSTHOG_API_KEY=your_posthog_api_key
REACT_APP_POSTHOG_HOST=https://app.posthog.com

# Sentry configuration (https://sentry.io)
REACT_APP_SENTRY_DSN=your_sentry_dsn

# Other analytics config
REACT_APP_ENABLE_DEV_ERROR_TRACKING=false
REACT_APP_ANALYTICS_SAMPLE_RATE=0.1
```

### 4️⃣ Cast the Development Spell
```bash
npm start
# Or with yarn:
yarn start
```

### 5️⃣ Build for Production (WHEN YOU'RE READY TO SHARE YOUR MAGIC)
```bash
npm run build
# Or with yarn:
yarn build
```

## 🧙‍♂️ Project Structure (FOR THOSE WHO CARE ABOUT ORGANIZATION) 🧙‍♂️

```
src/
├── analytics/             # 📊 Magical tracking system
├── api/                   # 🌐 API integration
├── components/            # 🧩 UI components galore!
├── hooks/                 # 🪝 Custom hooks (SO MANY HOOKS!)
├── reducers/              # 📉 State management
├── services/              # 🔧 Service integrations
├── state/                 # 🧠 Global state management
├── themes/                # 🎨 All those AMAZING themes
├── translations/          # 🗣️ Language magic
└── utilities/             # 🛠️ Helper functions
```

## 🧙‍♂️ The CrankyMagician's Tips 🧙‍♂️

1. **DON'T MESS WITH THE CORE SPELLS!** Unless you REALLY know what you're doing.

2. **USE THE HOOKS!** They're there for a reason, and they're MAGICAL!

3. **CHECK THE CONSOLE!** The CrankyMagician leaves helpful messages, usually in BRIGHT COLORS!

4. **RTFM!** (Read The Fantastic Manual) This README is your spellbook - study it!

## 🧪 API Integration 🧪

The application includes a comprehensive API system that magically connects to your backend:

```javascript
// Make API calls with the magic of axios!
import axiosServices from './utilities/axios';

// Cast a GET spell
const fetchData = async () => {
  const response = await axiosServices.get('/api/magical-data');
  return response.data;
};

// Cast a POST spell
const createMagicalItem = async (item) => {
  const response = await axiosServices.post('/api/items', item);
  return response.data;
};
```

### Adding New API Endpoints

Adding new endpoints is as easy as waving your wand!

1. Define your endpoint in `apiConstants.js`
2. Use the `axiosServices` instance for automatic token handling
3. Wrap with try/catch for proper error handling
4. Analytics will AUTOMATICALLY track your API calls!

## 🔮 Troubleshooting 🔮

- **Problem**: The app isn't starting?  
  **Solution**: Did you forget to `npm install`? The magic needs ingredients!

- **Problem**: Themes not changing?  
  **Solution**: Make sure you're using the `useTheme` hook, NOT manually changing classes like a MUGGLE!

- **Problem**: Authentication not working?  
  **Solution**: Check your JWT token! It might be EXPIRED or CURSED!

- **Problem**: Confused about how components work?  
  **Solution**: Look at the examples folder! The CrankyMagician left you PLENTY of examples!

## 📜 License 📜

This project is licensed under the MAGICAL License - which means you can use it, but if it breaks, you get to keep BOTH pieces! 🧙‍♂️

## 🧙‍♂️ About the CrankyMagician 🧙‍♂️

The CrankyMagician (aka that developer who's had WAY too much coffee) has been casting JavaScript spells for over a decade. Legend has it, they once fixed a production bug using only TELEPATHY and INTERPRETIVE DANCE.

For more magical creations, visit [The CrankyMagician's Chamber of Secrets](https://github.com/crankyMagician).

---

*"Why write boring code when you can write MAGICAL code?"* - The CrankyMagician

*P.S. If you find bugs in this framework, they're not bugs, they're *undocumented features*. The CrankyMagician doesn't make mistakes... only happy little accidents! 🎨*
