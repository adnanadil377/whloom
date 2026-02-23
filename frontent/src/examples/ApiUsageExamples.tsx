// Example: How to use the Mock API in your components
// This file demonstrates common patterns and usage

import { useApi, useMutation } from '../hooks/useApi';
import { campaignsApi, creatorsApi } from '../services/api';

// ============================================
// EXAMPLE 1: Simple Data Fetching
// ============================================
export const SimpleFetchExample = () => {
  const { data, loading, error } = useApi(() => campaignsApi.getCampaigns());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(campaign => (
        <div key={campaign.id}>{campaign.name}</div>
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE 2: Fetching with Parameter
// ============================================
export const FetchWithIdExample = ({ campaignId }: { campaignId: number }) => {
  const { data: campaign, loading } = useApi(
    () => campaignsApi.getCampaignById(campaignId),
    [campaignId] // Refetch when campaignId changes
  );

  if (loading) return <div>Loading campaign...</div>;

  return <div>{campaign?.name}</div>;
};

// ============================================
// EXAMPLE 3: Manual Refetching
// ============================================
export const RefetchExample = () => {
  const { data, loading, refetch } = useApi(() => creatorsApi.getCreators());

  return (
    <div>
      <button onClick={refetch} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
      <div>{data?.length} creators loaded</div>
    </div>
  );
};

// ============================================
// EXAMPLE 4: Creating New Data (Mutation)
// ============================================
export const CreateCampaignExample = () => {
  const { mutate, loading, error } = useMutation(campaignsApi.createCampaign);

  const handleCreate = async () => {
    const newCampaign = {
      name: 'New Campaign',
      platform: 'YouTube',
      status: 'Draft' as const,
      budget: '$5000',
      spent: '$0',
    };

    const result = await mutate(newCampaign);
    if (result) {
      console.log('Campaign created successfully!');
      // Optionally refetch the campaigns list here
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </div>
  );
};

// ============================================
// EXAMPLE 5: Multiple Parallel Fetches
// ============================================
export const MultipleFetchesExample = () => {
  const { data: campaigns, loading: campaignsLoading } = useApi(() => 
    campaignsApi.getCampaigns()
  );
  const { data: creators, loading: creatorsLoading } = useApi(() => 
    creatorsApi.getCreators()
  );

  const loading = campaignsLoading || creatorsLoading;

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Campaigns: {campaigns?.length}</h2>
      <h2>Creators: {creators?.length}</h2>
    </div>
  );
};

// ============================================
// EXAMPLE 6: With Loading Skeleton
// ============================================
export const WithSkeletonExample = () => {
  const { data, loading } = useApi(() => campaignsApi.getCampaigns());

  return (
    <div>
      {loading ? (
        // Show skeleton while loading
        <>
          <div className="skeleton-box">Loading...</div>
          <div className="skeleton-box">Loading...</div>
          <div className="skeleton-box">Loading...</div>
        </>
      ) : (
        // Show actual data
        data?.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            {campaign.name}
          </div>
        ))
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 7: Conditional Fetching
// ============================================
export const ConditionalFetchExample = ({ shouldFetch }: { shouldFetch: boolean }) => {
  const { data, loading } = useApi(
    () => shouldFetch ? campaignsApi.getCampaigns() : Promise.resolve([]),
    [shouldFetch]
  );

  if (!shouldFetch) return <div>Select an option to load data</div>;
  if (loading) return <div>Loading...</div>;

  return <div>Loaded {data?.length} items</div>;
};

// ============================================
// EXAMPLE 8: Update Data (PUT Request)
// ============================================
export const UpdateCampaignExample = ({ campaignId }: { campaignId: number }) => {
  const { mutate: updateCampaign, loading } = useMutation(
    (data: any) => campaignsApi.updateCampaign(campaignId, data)
  );

  const handleUpdate = async () => {
    const updates = { status: 'Active' as const };
    const result = await updateCampaign(updates);
    if (result) {
      console.log('Updated successfully!');
    }
  };

  return (
    <button onClick={handleUpdate} disabled={loading}>
      {loading ? 'Updating...' : 'Activate Campaign'}
    </button>
  );
};

// ============================================
// EXAMPLE 9: Delete Data
// ============================================
export const DeleteCampaignExample = ({ campaignId }: { campaignId: number }) => {
  const { mutate: deleteCampaign, loading } = useMutation(
    () => campaignsApi.deleteCampaign(campaignId)
  );

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      const result = await deleteCampaign(undefined);
      if (result) {
        console.log('Deleted successfully!');
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

// ============================================
// EXAMPLE 10: Combined Create and Refetch
// ============================================
export const CreateAndRefetchExample = () => {
  const { data: campaigns, refetch } = useApi(() => campaignsApi.getCampaigns());
  const { mutate, loading } = useMutation(campaignsApi.createCampaign);

  const handleCreate = async () => {
    const result = await mutate({ name: 'New Campaign' });
    if (result) {
      // Refetch the list to include the new item
      refetch();
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        Create New
      </button>
      <div>Total campaigns: {campaigns?.length}</div>
    </div>
  );
};

export default {
  SimpleFetchExample,
  FetchWithIdExample,
  RefetchExample,
  CreateCampaignExample,
  MultipleFetchesExample,
  WithSkeletonExample,
  ConditionalFetchExample,
  UpdateCampaignExample,
  DeleteCampaignExample,
  CreateAndRefetchExample,
};
