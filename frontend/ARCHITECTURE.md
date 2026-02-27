# Mock API Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      REACT COMPONENTS                        │
│  (Dashboard, Analytics, Campaigns, Creators, etc.)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ useApi() / useMutation()
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    CUSTOM HOOKS                              │
│                   (hooks/useApi.ts)                          │
│  • Handles loading states                                    │
│  • Catches errors                                            │
│  • Manages data fetching                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Call API functions
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   API SERVICE LAYER                          │
│                   (services/api.ts)                          │
│  • analyticsApi                                              │
│  • dashboardApi                                              │
│  • campaignsApi                                              │
│  • creatorsApi                                               │
│  • paymentsApi                                               │
│  • assetsApi                                                 │
└────────────┬────────────────────────┬───────────────────────┘
             │                        │
   ┌─────────▼──────────┐   ┌────────▼─────────────┐
   │   MOCK DATA        │   │   REAL API           │
   │ (mockData.ts)      │   │ (When ready)         │
   │ USE_MOCK_API=true  │   │ USE_MOCK_API=false   │
   └────────────────────┘   └──────────────────────┘
```

## File Structure

```
src/
├── types/
│   └── index.ts                    # TypeScript interfaces
│
├── services/
│   ├── mockData.ts                 # Sample data
│   └── api.ts                      # API service layer
│
├── hooks/
│   └── useApi.ts                   # React hooks
│
├── pages/
│   ├── Dashboard.tsx               # ✅ Uses dashboardApi
│   ├── Analytics.tsx               # ✅ Uses analyticsApi
│   ├── Campaigns.tsx               # ✅ Uses campaignsApi
│   ├── Creators.tsx                # ✅ Uses creatorsApi
│   ├── Payments.tsx                # ✅ Uses paymentsApi
│   └── Assets.tsx                  # ✅ Uses assetsApi
│
└── examples/
    └── ApiUsageExamples.tsx        # Usage examples
```

## How It Works

### Step 1: Component Makes Request
```typescript
const { data, loading } = useApi(() => campaignsApi.getCampaigns());
```

### Step 2: Hook Manages State
```typescript
// Inside useApi hook:
- Set loading to true
- Call the API function
- Handle success → set data
- Handle error → set error
- Set loading to false
```

### Step 3: API Service Returns Data
```typescript
// If USE_MOCK_API = true:
return mockCampaigns;

// If USE_MOCK_API = false:
const response = await fetch('/api/campaigns');
return response.json();
```

### Step 4: Component Receives Data
```typescript
// Component automatically re-renders with:
- data: The fetched data
- loading: false
- error: null (if successful)
```

## Switching from Mock to Real API

### Before (Development)
```
Component → useApi → campaignsApi → mockData ✓
```

### After (Production)
```
Component → useApi → campaignsApi → Real API Server ✓
```

**The Component Code Doesn't Change!** 🎉

## Benefits of This Architecture

1. **Separation of Concerns**
   - Components focus on UI
   - Hooks handle loading/error states
   - API layer handles data fetching
   - Mock data is isolated

2. **Easy Testing**
   - Test components with mock data
   - Test API layer independently
   - No backend dependency

3. **Type Safety**
   - TypeScript interfaces ensure consistency
   - Catch type errors at compile time
   - Autocomplete in IDE

4. **Maintainability**
   - Single place to update API calls
   - Easy to find and modify
   - Clear data flow

5. **Flexibility**
   - Switch between mock and real with one flag
   - Mix and match (some mock, some real)
   - Easy to add new endpoints

## Example: Adding a New Endpoint

```
1. Define Type (types/index.ts)
   ↓
2. Create Mock Data (services/mockData.ts)
   ↓
3. Add API Function (services/api.ts)
   ↓
4. Use in Component (with useApi hook)
   ↓
5. Later: Replace with real API call
```

## Real-World Workflow

### Development Phase (Now)
```
Developer → Write Component → Use Mock API → See Results
                                    ↓
                              [Fast Development]
                              [No Backend Wait]
                              [Easy Testing]
```

### Production Phase (Later)
```
Backend Ready → Update api.ts → Switch Flag → Deploy
                      ↓
                [Minimal Changes]
                [Same Components]
                [Same Hooks]
```

---

This architecture gives you maximum flexibility and minimal refactoring when moving from mock to real data! 🚀
