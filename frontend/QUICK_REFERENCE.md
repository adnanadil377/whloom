# Quick Reference: Mock API Usage

## 📋 Common Patterns

### Fetch Data (GET)
```typescript
import { useApi } from '../hooks/useApi';
import { campaignsApi } from '../services/api';

const { data, loading, error, refetch } = useApi(() => campaignsApi.getCampaigns());
```

### Create Data (POST)
```typescript
import { useMutation } from '../hooks/useApi';
import { campaignsApi } from '../services/api';

const { mutate, loading, error } = useMutation(campaignsApi.createCampaign);
await mutate({ name: 'New Campaign', ...data });
```

### Update Data (PUT)
```typescript
const { mutate, loading } = useMutation(
  (data) => campaignsApi.updateCampaign(id, data)
);
await mutate({ status: 'Active' });
```

### Delete Data (DELETE)
```typescript
const { mutate, loading } = useMutation(() => campaignsApi.deleteCampaign(id));
await mutate();
```

## 🎯 Available APIs

| Import | Methods |
|--------|---------|
| `analyticsApi` | getOverviewStats(), getPlatformData(), getTopContent() |
| `dashboardApi` | getStats(), getRecentCampaigns(), getTopCreators() |
| `campaignsApi` | getCampaigns(), getCampaignById(id), createCampaign(data), updateCampaign(id, data), deleteCampaign(id) |
| `creatorsApi` | getCreators(), getCreatorById(id), inviteCreator(email) |
| `paymentsApi` | getPayments(), processPayment(id) |
| `assetsApi` | getAssets(), getAssetById(id), uploadAsset(data) |

## 🔄 Loading States

```typescript
const { data, loading, error } = useApi(() => api.getData());

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

## 🔁 Refetch Data

```typescript
const { data, refetch } = useApi(() => api.getData());

<button onClick={refetch}>Refresh</button>
```

## ⚙️ Configuration

### Toggle Mock API
In `services/api.ts`:
```typescript
const USE_MOCK_API = true;  // false for real API
```

### Adjust Delay
```typescript
const delay = (ms: number = 500) => // Change 500ms
```

## 🚨 Error Handling

```typescript
const { mutate, error } = useMutation(api.create);

const result = await mutate(data);
if (result) {
  // Success
} else if (error) {
  // Handle error
  console.error(error.message);
}
```

## 📝 Adding New Endpoint

1. **Type**: Add to `types/index.ts`
2. **Mock Data**: Add to `services/mockData.ts`
3. **API**: Add to `services/api.ts`
4. **Use**: Import and use in component

## 💡 Pro Tips

- ✅ Always handle loading and error states
- ✅ Use optional chaining: `data?.map()`
- ✅ Refetch after mutations
- ✅ Use TypeScript types for autocomplete
- ✅ Keep mock data realistic

## 🔗 Links

- [Complete Guide](MOCK_API_GUIDE.md)
- [Examples](src/examples/ApiUsageExamples.tsx)
- [Architecture](ARCHITECTURE.md)
