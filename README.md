# 🧙‍♂️ Magical RTK Query Incantations 🔮

> "Why use regular API calls when you can summon data with RTK Query's magical powers?" - The CrankyMagician's Book of Modern Frontend Sorcery

## 📚 Arcane Repository Map 📚

```
api/
├── apiSlice.js           # The master spell that exports all magical hooks
├── authApi.js            # Authentication spells & incantations 🔑
├── baseApi.js            # The foundation of all magical API connections 🧱
├── businessApi.js        # Business magic incantations 💼
├── campaignApi.js        # Campaign summoning powers 📣
├── commoApi.js           # Communication portal spells 📨
├── invitationApi.js      # Invitation transmission magic 📩
├── mediaApi.js           # Media artifact conjuring 🖼️
└── staticwebapp.config.json # The Azure portal configuration scroll 🌌
```

## ✨ Purpose of this Magical Chamber ✨

This folder contains ALL the mystical incantations needed to communicate with your backend servers! It's where the REAL MAGIC happens between your frontend spellbook and the server's ancient wisdom.

We use **RTK Query** - the most POWERFUL magical API library ever created by mortal developers! It combines caching, request deduplication, and automatic loading states in one MAGNIFICENT package!

## 🪄 How These Magical Scrolls Work Together 🪄

1. **baseApi.js** - The foundation of our magical API system. Creates an RTK Query API with advanced error handling, token validation, and now with DIMENSION-CROSSING PROXY POWERS!

```javascript
// This creates the BASE MAGICAL CIRCLE for all API communications!
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: enhancedBaseQuery, // WITH TOKEN VALIDATION MAGIC! ✨
  tagTypes: [ 'Auth', 'User', 'Business', /* more magical tags */ ],
  endpoints: () => ({}),
});

// NEW PORTAL MAGIC! 🌌
const getApiUrl = (endpoint, apiType) => {
  // Select the appropriate dimensional gateway
  const basePath = apiType === 'auth'
    ? process.env.REACT_APP_AUTH_API_URL || '/auth-api'
    : process.env.REACT_APP_MAIN_API_URL || '/main-api';
  
  // Remove any leading slashes to avoid opening the wrong portal
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // Return the complete incantation path
  return `${basePath}/${cleanEndpoint}`;
};
```

2. **authApi.js** - Powerful authentication spells that manage user login, registration, token handling and more!

```javascript
// AUTHENTICATION MAGIC! 🧙‍♂️
export const authApiExtended = authApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: getApiUrl('login', 'auth'), // NEW DIMENSIONAL GATEWAY MAGIC! 🌌
        method: 'POST',
        body: credentials,
      }),
      // MAGICAL TOKEN HANDLING! ✨
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        // Save tokens in the magical storage vault!
      },
    }),
    // More auth spells...
  }),
});
```

3. **businessApi.js** - Business-related enchantments for managing companies, users, and roles!

```javascript
// BUSINESS SORCERY! 💼
export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBusiness: builder.query({
      query: () => ({
        url: getApiUrl('business/active', 'main'), // CROSS-DIMENSIONAL GATEWAY! 🌌
        method: 'GET',
      }),
      providesTags: ['Business'], // CACHE INVALIDATION MAGIC! ✨
    }),
    // More business spells...
  }),
});
```

4. **apiSlice.js** - The GRAND UNIFIED THEORY of our API magic - combines all endpoints and exports hooks!

```javascript
// THE MASTER SPELL that exports ALL magical hooks!
export {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  // MANY MORE MAGICAL HOOKS!
} from './authApi';

export {
  // Business hooks
  useGetActiveBusinessQuery,
  useUpdateBusinessMutation,
  // MORE BUSINESS MAGIC!
} from './businessApi';
```

5. **NEW! staticwebapp.config.json** - The ancient scroll that configures our Azure dimensional portals!

```json
{
  "routes": [
    {
      "route": "/auth-api/*",  // 🌌 AUTH DIMENSION GATEWAY
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allowedRoles": ["anonymous", "authenticated"],
      "rewrite": "https://dev.auth.spatialmods.com/auth/{0}" // TARGET DIMENSION
    },
    {
      "route": "/main-api/*",  // 🌌 MAIN API DIMENSION GATEWAY
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allowedRoles": ["authenticated"],
      "rewrite": "https://dev.net-api.spatialmods.com/{0}" // TARGET DIMENSION
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"  // FALLBACK PORTAL DESTINATION
  }
}
```

## 🌌 NEW! The Azure Static Web App Portal Magic 🌌

We've enhanced our API sorcery with the power of Azure Static Web Apps! This creates magical portals between domains, bypassing the dreaded CORS barriers!

### How the Portal Magic Works:

1. **Dimensional Gateway Configuration**: The `staticwebapp.config.json` scroll defines magical paths that redirect API calls through interdimensional portals!

2. **Portal Paths**: When you call `/auth-api/login`, Azure's magic redirects your spell to `https://dev.auth.spatialmods.com/auth/login` - without any CORS curses!

3. **Environment Variables**: The magical paths are defined by environment variables:
   ```
   REACT_APP_AUTH_API_URL=/auth-api
   REACT_APP_MAIN_API_URL=/main-api
   ```

4. **Cross-Domain Sorcery**: Our portal magic lets you communicate with multiple backend realms without the dreaded CORS counter-spells!

Example of the portal in action:
```javascript
// Component using the magical portal:
const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values) => {
    try {
      // This spell travels through the Azure portal to another dimension!
      const result = await login(values).unwrap();
      console.log('🌌 Portal traversed successfully!', result);
    } catch (err) {
      console.error('🌋 Portal collapsed!', err);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

## 🔮 How to Cast New API Spells 🔮

### 1. Adding a New Endpoint to Existing API File

```javascript
// In authApi.js or businessApi.js
export const myApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoints...
    
    // ADD YOUR NEW MAGICAL ENDPOINT! ✨
    getMagicalData: builder.query({
      query: (dataId) => ({
        url: getApiUrl(`data/${dataId}`, 'main'), // USE THE PORTAL MAGIC! 🌌
        method: 'GET',
      }),
      providesTags: (result, error, dataId) => [
        { type: 'MagicalData', id: dataId }
      ],
    }),
  }),
});

// Export your new magical hook!
export const { useGetMagicalDataQuery } = myApi;
```

### 2. Creating a Whole New API File for New Domains

```javascript
// 1. Create a new API file (e.g., productApi.js)
import baseApi, { getApiUrl } from './baseApi'; // IMPORT THE PORTAL CREATION SPELL! 🌌

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: getApiUrl('products', 'main'), // USE THE PORTAL MAGIC! 🌌
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    // More product endpoints...
  }),
});

export const {
  useGetAllProductsQuery,
  // More hooks...
} = productApi;

// 2. Add your exported hooks to apiSlice.js
// In apiSlice.js, add:
export {
  useGetAllProductsQuery,
  // More hooks...
} from './productApi';
```

## 🧙‍♂️ The CrankyMagician's Advanced API Tips 🧙‍♂️

1. **USE THE CACHE INVALIDATION TAGS!** This is what separates the apprentices from the REAL API wizards!

```javascript
// Providing tags - tells RTK Query when to KEEP this data in cache
providesTags: ['Products', { type: 'Product', id: 'LIST' }]

// Invalidating tags - tells RTK Query when to THROW AWAY cached data
invalidatesTags: ['Products', { type: 'Product', id: 'LIST' }]
```

2. **TRANSFORM API RESPONSES** when your backend returns data in a weird format. Don't make your components deal with the server's mystical madness!

```javascript
// The transformResponse spell changes the shape of API responses BEFORE they reach your components!
transformResponse: (response) => {
  // ALAKAZAM! The data is now in a format your component understands!
  return response.data.map(item => ({
    id: item.product_id,
    name: item.product_name,
    price: parseFloat(item.price_string)
  }));
}
```

3. **USE OPTIMISTIC UPDATES** to make your UI feel LIGHTNING FAST!

```javascript
// Create a magical optimistic update to make the UI respond INSTANTLY, even before the server does!
async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
  // ✨ POOF! Optimistically update the UI immediately!
  const patchResult = dispatch(
    api.util.updateQueryData('getProduct', id, (draft) => {
      Object.assign(draft, patch)
    })
  )
  
  try {
    // Let's see if the server agrees with our optimistic update...
    await queryFulfilled
  } catch {
    // OOPS! The server disagreed. Undo our optimistic update.
    patchResult.undo()
  }
}
```

4. **HANDLE ERRORS PROPERLY** because every spell can backfire!

```javascript
// In your component:
const { data, error, isLoading } = useGetMagicalDataQuery(id);

if (isLoading) return <MagicalLoadingSpinner />;
if (error) return <SpellbackfireMessage error={error} />;

// THE SPELL WORKED! Display your magical data:
return <MagicalDataDisplay data={data} />;
```

5. **USE ENVIRONMENT CONFIGURATION** to adjust your API's behavior in different realms!

```javascript
// Check which portal configuration to use based on the current realm
const authApiPath = process.env.REACT_APP_AUTH_API_URL || '/auth-api';
const mainApiPath = process.env.REACT_APP_MAIN_API_URL || '/main-api';

console.log(`Auth portal configured at: ${authApiPath}`);
console.log(`Main API portal configured at: ${mainApiPath}`);

// Is this the development realm?
if (process.env.REACT_APP_ENV === 'development') {
  console.log('Developer portal activated! Extra debugging magic enabled!');
}
```

6. **NEW! CHECK YOUR PORTALS ARE WORKING** with browser dev tools or Postman!

```javascript
// Test your portal connectivity:
fetch('/auth-api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'wizard@magic.com', password: 'abracadabra' })
})
.then(res => {
  console.log('Portal status:', res.status);
  return res.json();
})
.then(data => console.log('Message from the other dimension:', data))
.catch(err => console.error('Portal collapsed!', err));
```

---

*"Why settle for ordinary API calls when you can wield the arcane power of RTK Query and Azure dimensional portals?"* - The CrankyMagician

*P.S. If you get a 404 or 405 error, check your staticwebapp.config.json scroll! The difference between a working portal and a collapsed one is often just a missing slash or incorrect path pattern! 🔍*