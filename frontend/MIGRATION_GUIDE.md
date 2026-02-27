# 🔄 Migration Guide: From Mock to Real API

This guide will help you switch from mock data to your real API when it's ready.

## Before You Start

### Prerequisites
- ✅ Backend API is deployed and accessible
- ✅ You have API endpoint URLs
- ✅ You know the authentication method (if any)
- ✅ You've tested the API endpoints (e.g., with Postman)

### What You'll Need
- Base API URL (e.g., `https://api.creatorsTop.com`)
- API authentication token/key (if required)
- Endpoint documentation

## Migration Options

### Option 1: Quick Switch (Recommended for testing)

In `src/services/api.ts`, change one line:
```typescript
const USE_MOCK_API = false; // Changed from true
```

Then update functions to call real endpoints:
```typescript
export const campaignsApi = {
  async getCampaigns() {
    // await delay(); // Remove this line
    const response = await fetch('https://api.example.com/campaigns');
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  },
};
```

### Option 2: Environment-Based (Recommended for production)

**Step 1:** Update `src/services/api.ts`:
```typescript
// Instead of hardcoded flag:
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
```

**Step 2:** Create `.env.development`:
```bash
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
```

**Step 3:** Create `.env.production`:
```bash
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.creatorstop.com
```

**Step 4:** Use in API functions:
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const campaignsApi = {
  async getCampaigns() {
    if (USE_MOCK_API) {
      await delay();
      return mockCampaigns;
    }
    const response = await fetch(`${BASE_URL}/campaigns`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
};
```

## Step-by-Step Migration

### Step 1: Create API Configuration

Create `src/services/config.ts`:
```typescript
// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get auth token (if needed)
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Add auth header if token exists
export const getHeaders = () => {
  const token = getAuthToken();
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
```

### Step 2: Create API Client

Create `src/services/apiClient.ts`:
```typescript
import { API_CONFIG, getHeaders } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'Request failed',
      response.status,
      errorData
    );
  }

  return response.json();
}
```

### Step 3: Update API Services

Update `src/services/api.ts`:
```typescript
import { apiRequest } from './apiClient';
import { mockCampaigns, mockCreators /* ... */ } from './mockData';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper for mock delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Campaigns API
export const campaignsApi = {
  // GET /campaigns
  async getCampaigns() {
    if (USE_MOCK_API) {
      await delay();
      return mockCampaigns;
    }
    return apiRequest<Campaign[]>('/campaigns');
  },

  // GET /campaigns/:id
  async getCampaignById(id: number) {
    if (USE_MOCK_API) {
      await delay();
      return mockCampaigns.find(c => c.id === id);
    }
    return apiRequest<Campaign>(`/campaigns/${id}`);
  },

  // POST /campaigns
  async createCampaign(data: Partial<Campaign>) {
    if (USE_MOCK_API) {
      await delay();
      console.log('Creating campaign:', data);
      return { success: true, id: Date.now() };
    }
    return apiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /campaigns/:id
  async updateCampaign(id: number, data: Partial<Campaign>) {
    if (USE_MOCK_API) {
      await delay();
      console.log('Updating campaign:', id, data);
      return { success: true };
    }
    return apiRequest(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /campaigns/:id
  async deleteCampaign(id: number) {
    if (USE_MOCK_API) {
      await delay();
      console.log('Deleting campaign:', id);
      return { success: true };
    }
    return apiRequest(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// Repeat for other APIs...
```

### Step 4: Test with Real API

1. **Update environment variables**
2. **Start your development server**
3. **Test each page**:
   - Check data loads correctly
   - Verify loading states work
   - Test error handling
   - Try create/update/delete operations

### Step 5: Handle Authentication (if needed)

Update `src/services/apiClient.ts`:
```typescript
// Add interceptor for 401 errors
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(/* ... */);
    
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
      throw new ApiError('Unauthorized', 401);
    }
    
    // ... rest of code
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 0);
  }
}
```

## Common Issues & Solutions

### Issue 1: CORS Errors
**Problem:** Browser blocks requests due to CORS
**Solution:** Configure your backend to allow requests from your frontend domain

### Issue 2: Different Data Structure
**Problem:** API returns data in different format than mock
**Solution:** Add a transformer function:
```typescript
async getCampaigns() {
  const data = await apiRequest('/campaigns');
  // Transform to match expected format
  return data.map(transformCampaign);
}
```

### Issue 3: Authentication Required
**Problem:** API requires authentication
**Solution:** Add auth token to headers (see Step 5)

### Issue 4: Pagination
**Problem:** API returns paginated data
**Solution:** Update hook to handle pagination:
```typescript
const { data, loading, fetchMore } = usePaginatedApi(
  (page) => campaignsApi.getCampaigns(page)
);
```

## Gradual Migration

You can migrate one API at a time:

```typescript
const USE_MOCK_CAMPAIGNS = true;  // Still using mock
const USE_MOCK_CREATORS = false;  // Already migrated

export const campaignsApi = {
  async getCampaigns() {
    if (USE_MOCK_CAMPAIGNS) return mockCampaigns;
    return apiRequest('/campaigns');
  },
};

export const creatorsApi = {
  async getCreators() {
    if (USE_MOCK_CREATORS) return mockCreators;
    return apiRequest('/creators');  // Using real API
  },
};
```

## Verification Checklist

After migration, verify:
- [ ] All pages load data correctly
- [ ] Loading states appear and disappear
- [ ] Errors are handled gracefully
- [ ] Create operations work
- [ ] Update operations work
- [ ] Delete operations work
- [ ] Authentication works (if applicable)
- [ ] No console errors
- [ ] Data displays correctly
- [ ] Pagination works (if applicable)
- [ ] Search/filtering works (if applicable)

## Rollback Plan

If something goes wrong:

1. **Immediate:** Set `USE_MOCK_API=true` in environment
2. **Emergency:** Revert the commit
3. **Debug:** Check browser console and network tab
4. **Fix:** Update API functions or data transformers
5. **Test:** Try again with fixed code

## Performance Tips

1. **Add caching:**
```typescript
const cache = new Map();
export const campaignsApi = {
  async getCampaigns() {
    if (cache.has('campaigns')) return cache.get('campaigns');
    const data = await apiRequest('/campaigns');
    cache.set('campaigns', data);
    return data;
  },
};
```

2. **Add request debouncing** for search
3. **Implement optimistic updates** for better UX
4. **Use React Query** or SWR for advanced caching

## Final Steps

1. **Remove mock data files** (optional, after full migration):
   - Keep `mockData.ts` commented out for reference
   - Or delete if you're confident

2. **Update documentation**:
   - Update README with real API info
   - Document actual endpoints

3. **Deploy**:
   - Build: `npm run build`
   - Deploy to production
   - Monitor for errors

## Need Help?

- Check backend API documentation
- Test endpoints with Postman/curl
- Look at network tab in browser DevTools
- Check the console for error messages

---

**Remember:** The component code doesn't change! Only the API service layer needs updating. This is the power of proper architecture! 🎉
