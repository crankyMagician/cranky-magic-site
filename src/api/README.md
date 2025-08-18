# 🧙‍♂️ Magical RTK Query Incantations 🔮

> "Why use regular API calls when you can summon data with RTK Query's magical powers?" - The CrankyMagician's Book of Modern Frontend Sorcery

## 📚 Arcane Repository Map 📚

```
api/
├── apiSlice.js           # The master spell that exports all magical hooks
├── authApi.js            # Authentication spells & incantations 🔑
├── baseApi.js            # The foundation of all magical API connections 🧱
├── businessApi.js        # Business magic incantations 💼
└── config/               # Environment configuration wizardry 🌍
    └── index.js          # The scroll that determines which realm we summon from
```

## ✨ Purpose of this Magical Chamber ✨

This folder contains ALL the mystical incantations needed to communicate with your backend servers! It's where the REAL MAGIC happens between your frontend spellbook and the server's ancient wisdom.

We use **RTK Query** - the most POWERFUL magical API library ever created by mortal developers! It combines caching, request deduplication, and automatic loading states in one MAGNIFICENT package!

## 🪄 How These Magical Scrolls Work Together 🪄

1. **baseApi.js** - The foundation of our magical API system. Creates an RTK Query API with advanced error handling and token validation.

```javascript
// This creates the BASE MAGICAL CIRCLE for all API communications!
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: enhancedBaseQuery, // WITH TOKEN VALIDATION MAGIC! ✨
  tagTypes: [ 'Auth', 'User', 'Business', /* more magical tags */ ],
  endpoints: () => ({}),
});
```

2. **authApi.js** - Powerful authentication spells that manage user login, registration, token handling and more!

```javascript
// AUTHENTICATION MAGIC! 🧙‍♂️
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
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
        url: '/business/active',
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

5. **config/index.js** - The mystical configuration that adjusts our spells based on the current realm (environment)!

```javascript
// ENVIRONMENT DETECTION MAGIC! ✨
const config = {
  env: process.env.REACT_APP_ENV || 'development',
  api: {
    // Magical API configuration that adapts to different realms!
  },
  getAuthApiUrl: () => {
    // MYSTICAL URL CALCULATION BASED ON ENVIRONMENT! ✨
  }
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
        url: `/data/${dataId}`,
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
import baseApi from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: '/products',
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
// Use the config module to get the right API URL for your current environment
import config from '../config';

const apiUrl = config.getAuthApiUrl();
console.log(`Casting API spells to: ${apiUrl}`);

// Is this the development realm?
if (config.isDevelopment()) {
  console.log('Developer mode activated! Extra debugging magic enabled!');
}
```

---

*"Why settle for ordinary API calls when you can wield the arcane power of RTK Query?"* - The CrankyMagician

*P.S. If your API suddenly starts returning 500 errors, it's not your fault! The backend wizards probably incanted something wrong. Blame THEM, not your perfect frontend spells! 👉👨‍💻*