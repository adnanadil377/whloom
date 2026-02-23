# Mock API Setup - CreatorStop Frontend

This project uses a mock API layer that makes it easy to develop the frontend before the real API is ready. When the API is ready, you can easily switch to using real endpoints.

## 📁 File Structure

```
src/
├── types/
│   └── index.ts              # TypeScript type definitions
├── services/
│   ├── mockData.ts           # Mock data (simulates API responses)
│   └── api.ts                # API service layer
├── hooks/
│   └── useApi.ts             # Custom React hooks for data fetching
└── pages/
    ├── Dashboard.tsx         # Uses dashboardApi
    ├── Analytics.tsx         # Uses analyticsApi
    ├── Campaigns.tsx         # Uses campaignsApi
    ├── Creators.tsx          # Uses creatorsApi
    ├── Payments.tsx          # Uses paymentsApi
    └── Assets.tsx            # Uses assetsApi
```

## 🚀 How It Works

### 1. Mock Data (`mockData.ts`)
Contains all the fake data that simulates what would come from your API:
- Campaign lists
- Creator profiles
- Analytics stats
- Payment transactions
- etc.

### 2. API Service Layer (`api.ts`)
Provides functions to fetch data. Each function:
- Returns mock data during development
- Has TODO comments showing where to add real API calls
- Can be switched via the `USE_MOCK_API` flag

### 3. Custom Hooks (`useApi.ts`)
React hooks that handle:
- Loading states
- Error handling
- Data fetching
- Automatic refetching

### 4. Page Components
Use the hooks to fetch data:
```tsx
const { data, loading, error } = useApi(() => dashboardApi.getStats());
```

## 🔄 Switching from Mock to Real API

### Option 1: Quick Switch (Toggle Flag)
In [services/api.ts](services/api.ts), change:
```typescript
const USE_MOCK_API = true;  // Change to false
```

### Option 2: Replace Individual Functions
For each API function, replace the mock data with a real API call:

**Before (Mock):**
```typescript
export const campaignsApi = {
  async getCampaigns() {
    await delay();
    if (USE_MOCK_API) {
      return mockCampaigns;
    }
    return mockCampaigns;
  },
};
```

**After (Real API):**
```typescript
export const campaignsApi = {
  async getCampaigns() {
    const response = await fetch('https://api.example.com/campaigns');
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  },
};
```

## 📋 Available API Services

### Analytics API
```typescript
import { analyticsApi } from '../services/api';

// Usage in component:
const { data: stats } = useApi(() => analyticsApi.getOverviewStats());
const { data: platforms } = useApi(() => analyticsApi.getPlatformData());
const { data: content } = useApi(() => analyticsApi.getTopContent());
```

### Dashboard API
```typescript
import { dashboardApi } from '../services/api';

const { data: stats } = useApi(() => dashboardApi.getStats());
const { data: campaigns } = useApi(() => dashboardApi.getRecentCampaigns());
const { data: creators } = useApi(() => dashboardApi.getTopCreators());
```

### Campaigns API
```typescript
import { campaignsApi } from '../services/api';
import { useMutation } from '../hooks/useApi';

// GET requests
const { data: campaigns } = useApi(() => campaignsApi.getCampaigns());
const { data: campaign } = useApi(() => campaignsApi.getCampaignById(id));

// POST/PUT/DELETE requests
const { mutate, loading } = useMutation(campaignsApi.createCampaign);
await mutate({ name: 'New Campaign', ... });
```

### Creators API
```typescript
import { creatorsApi } from '../services/api';

const { data: creators } = useApi(() => creatorsApi.getCreators());
const { data: creator } = useApi(() => creatorsApi.getCreatorById(id));
```

### Payments API
```typescript
import { paymentsApi } from '../services/api';

const { data: payments } = useApi(() => paymentsApi.getPayments());
```

### Assets API
```typescript
import { assetsApi } from '../services/api';

const { data: assets } = useApi(() => assetsApi.getAssets());
```

## 🎯 Adding New API Endpoints

### Step 1: Add Type Definition
In [types/index.ts](types/index.ts):
```typescript
export interface NewDataType {
  id: number;
  name: string;
  // ... other fields
}
```

### Step 2: Add Mock Data
In [services/mockData.ts](services/mockData.ts):
```typescript
export const mockNewData: NewDataType[] = [
  { id: 1, name: 'Example 1' },
  { id: 2, name: 'Example 2' },
];
```

### Step 3: Add API Service
In [services/api.ts](services/api.ts):
```typescript
export const newApi = {
  async getData() {
    await delay();
    if (USE_MOCK_API) {
      return mockNewData;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/new-data');
    // return response.json();
    return mockNewData;
  },
};
```

### Step 4: Use in Component
```typescript
import { useApi } from '../hooks/useApi';
import { newApi } from '../services/api';

const MyComponent = () => {
  const { data, loading, error } = useApi(() => newApi.getData());
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};
```

## 🔍 Features

### Loading States
All hooks automatically provide loading states:
```typescript
const { data, loading } = useApi(() => api.getData());
if (loading) return <LoadingSpinner />;
```

### Error Handling
Errors are automatically caught and returned:
```typescript
const { data, error } = useApi(() => api.getData());
if (error) return <ErrorMessage error={error} />;
```

### Manual Refetching
You can manually refetch data:
```typescript
const { data, refetch } = useApi(() => api.getData());
<button onClick={refetch}>Refresh Data</button>
```

### Mutations (POST, PUT, DELETE)
For creating, updating, or deleting:
```typescript
const { mutate, loading } = useMutation(campaignsApi.createCampaign);

const handleCreate = async () => {
  const result = await mutate({ name: 'New Campaign' });
  if (result) {
    // Success!
  }
};
```

## 🛠️ Configuration

### Adjust API Delay
In [services/api.ts](services/api.ts), modify the delay function:
```typescript
const delay = (ms: number = 500) => // Change 500ms to your preference
```

### Environment-Based Toggle
You can use environment variables:
```typescript
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';
```

Then in your `.env` file:
```
REACT_APP_USE_MOCK_API=true
```

## 📝 Best Practices

1. **Keep mock data realistic** - Use data that closely matches what the real API will return
2. **Update types first** - Always define TypeScript types before creating mock data
3. **Document API endpoints** - Add comments showing the real endpoint URLs
4. **Test both modes** - Test with mock data AND real API to ensure compatibility
5. **Handle errors** - Always handle loading and error states in components

## 🚨 Common Issues

### Issue: Data not updating after changing mock data
**Solution:** The data is cached. Refresh the page or use the `refetch` function.

### Issue: TypeScript errors about missing properties
**Solution:** Update the type definitions in `types/index.ts` to match your data structure.

### Issue: Components show "Loading..." forever
**Solution:** Check the browser console for errors. Ensure the API service is returning data correctly.

## 📚 Example: Complete Flow

Here's a complete example of adding a new "Products" feature:

**1. Add type:**
```typescript
// types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

**2. Add mock data:**
```typescript
// services/mockData.ts
export const mockProducts: Product[] = [
  { id: 1, name: 'Widget', price: 29.99 },
  { id: 2, name: 'Gadget', price: 49.99 },
];
```

**3. Add API service:**
```typescript
// services/api.ts
export const productsApi = {
  async getProducts() {
    await delay();
    if (USE_MOCK_API) {
      return mockProducts;
    }
    // TODO: const response = await fetch('/api/products');
    // return response.json();
    return mockProducts;
  },
};
```

**4. Use in component:**
```typescript
// pages/Products.tsx
import { useApi } from '../hooks/useApi';
import { productsApi } from '../services/api';

const Products = () => {
  const { data: products, loading } = useApi(() => productsApi.getProducts());
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
};
```

---

## 🎉 Summary

This setup gives you:
- ✅ Working frontend without waiting for the API
- ✅ Easy switching between mock and real data
- ✅ Proper TypeScript types
- ✅ Loading and error handling
- ✅ Clean, maintainable code structure

When your API is ready, simply update the API service functions with real fetch calls!
