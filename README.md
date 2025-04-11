# 🧙‍♂️ CrankyMagicReact ✨

[![Enchantment Level](https://img.shields.io/badge/enchantment-MAXIMUM-purple.svg)](https://github.com/crankyMagician/crankyMagicReact)
[![Made with React](https://img.shields.io/badge/made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Powered by Coffee](https://img.shields.io/badge/powered%20by-Coffee%20☕-brown.svg)](https://coffee.org)
[![License](https://img.shields.io/badge/license-MAGICAL-orange.svg)](LICENSE)

## 🪄 "Any sufficiently advanced technology is indistinguishable from magic."
— Arthur C. Clarke

Here is the documentation structure for your README:

## 📚 Documentation 📚

Explore the magical components of our codebase through these specialized documentation guides:

### 📂 src/
- [📡 API Documentation](./src/api/README.md) - Learn about our RTK Query API setup
- [🪝 Hooks Documentation](./src/hooks/README.md) - Discover our custom React hooks
- [🗃️ Reducers Documentation](./src/reducers/README.md) - Explore our Redux state management
- [🧪 Services Documentation](./src/services/README.md) - Understand our service utilities
- [🏛️ State Documentation](./src/state/README.md) - Explore our Redux store architecture
- [🎨 Theme Documentation](./src/themes/README.md) - Discover our theming infrastructure
- [🌐 Translations Documentation](./src/translations/README.md) - Learn about our i18n system
- [🔧 Utilities Documentation](./src/utilities/README.md) - Browse our helper functions

### 📂 src/analytics/
- [📊 Analytics Overview](./src/analytics/README.md) - Learn about our analytics implementation
    - 📂 **docs/**
        - [📈 API Integration](./src/analytics/docs/analyitics_apic_integration.md) - See how our analytics tracks API calls
        - [⚙️ Configuration Options](./src/analytics/docs/analytics_options.md) - Configure your analytics settings
        - [🏠 Self-Hosted Evaluation](./src/analytics/docs/self_hosted_eval.md) - Learn about self-hosting analytics
        - [💰 Cost Estimates](./src/analytics/docs/sentry_posthog_estimates.md) - Review analytics platform costs

### 📂 docs/
- [🎭 Dynamic Theme System Plan](./docs/dynamic_theme_system_plan.md) - Explore our future theming capabilities

### 📂 cors-anywhere-server/
- [🌐 CORS Proxy Server Documentation](./cors-anywhere-server/README.md) - Learn about our magical CORS proxy

## ✨ Features That Will BLOW YOUR MIND! ✨

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

### 🔮 RTK Query API Magic 🔮

The application uses the almighty **RTK Query** for API communication - because regular API calls are for MUGGLES! Our system combines the power of Redux Toolkit's Query features with the flexibility of Axios:

```javascript
// Import our magical hooks from the apiSlice
import { useLoginMutation, useGetActiveBusinessQuery } from '../api/apiSlice';

// Use them in your components with EASE and STYLE!
const MagicalLoginComponent = () => {
  // This gives you a magical login function AND loading/error states! 🪄
  const [login, { isLoading, error }] = useLoginMutation();
  
  const handleLoginClick = async () => {
    try {
      // Cast the login spell!
      const result = await login({ username: 'merlin', password: 'expelliarmus123' }).unwrap();
      console.log('Login successful!', result);
    } catch (err) {
      console.error('Login spell backfired!', err);
    }
  };
  
  return <button onClick={handleLoginClick}>✨ Login ✨</button>;
};
```

### 🧙‍♂️ The RTK Query Advantage 🧙‍♂️

Our API system provides these INCREDIBLE powers:

- 🪄 **Automatic Loading & Error States** - No more manual tracking of API status!
- 🔄 **Caching & Invalidation** - Data refreshes EXACTLY when it should!
- 🔮 **Automatic Re-fetching** - Keep your data fresh without lifting a finger!
- ⚡ **Optimistic Updates** - Update UI before the server confirms for LIGHTNING FAST experience!
- ✨ **Normalized Cache** - Data stored efficiently, no duplicates!
- 🛡️ **TypeScript Support** - Type safety that would make Dumbledore proud!

### 🔍 Analytics Tracking Magic 🧙‍♂️
Track user actions with mystical precision!

```javascript
// Import the magical hook
import useAnalytics from './useAnalytics';

const YourMagicalComponent = () => {
    // Summon the analytics powers
    const analytics = useAnalytics();

    const castButtonSpell = () => {
        // Track this AMAZING click event!
        analytics.trackButtonClick('super_magical_button', {
            spell_power: 'EXTREME',
            mana_cost: 42
        });
    };

    return <button onClick={castButtonSpell}>✨ CLICK FOR MAGIC ✨</button>;
};
```

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

## 🧠 Project Structure 🧠

```
src/
├── api/                  # API integration (RTK Query)
├── analytics/            # Analytics tracking system
├── assets/               # Static assets (images, logos)
├── components/           # React components
│   ├── Auth/             # Authentication components
│   ├── common/           # Shared/common components
│   ├── navigation/       # Navigation components
│   └── ... other component directories
├── hooks/                # Custom React hooks
├── pages/                # Full page components
├── reducers/             # Redux reducers/slices
├── services/             # Services for external interactions
├── state/                # Redux store configuration
├── themes/               # Theme configuration
├── translations/         # i18n translations
└── utilities/            # Utility functions
```

## 🧙‍♂️ The CrankyMagician's Tips 🧙‍♂️

1. **DON'T MESS WITH THE CORE SPELLS!** Unless you REALLY know what you're doing.

2. **USE THE HOOKS!** They're there for a reason, and they're MAGICAL!

3. **CHECK THE CONSOLE!** The CrankyMagician leaves helpful messages, usually in BRIGHT COLORS!

4. **RTFM!** (Read The Fantastic Manual) Our READMEs are your spellbooks - study them!

---

*"Why write boring code when you can write MAGICAL code?"* - The CrankyMagician

*P.S. If you find bugs in this framework, they're not bugs, they're *undocumented features*. The CrankyMagician doesn't make mistakes... only happy little accidents! 🎨*