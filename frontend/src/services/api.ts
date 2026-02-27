// API Service Layer
// This file provides a centralized way to fetch data
// Currently uses mock data, but can easily be replaced with real API calls

import {
  mockOverviewStats,
  mockDashboardStats,
  mockPlatformData,
  mockTopContent,
  mockCampaigns,
  mockRecentCampaigns,
  mockCreators,
  mockTopCreators,
  mockPayments,
  mockAssets,
} from './mockData';

// Toggle this to switch between mock and real API
const USE_MOCK_API = true;

// Simulates API delay for more realistic behavior
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Analytics API
export const analyticsApi = {
  async getOverviewStats() {
    await delay();
    if (USE_MOCK_API) {
      return mockOverviewStats;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/analytics/overview');
    // return response.json();
    return mockOverviewStats;
  },

  async getPlatformData() {
    await delay();
    if (USE_MOCK_API) {
      return mockPlatformData;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/analytics/platforms');
    // return response.json();
    return mockPlatformData;
  },

  async getTopContent() {
    await delay();
    if (USE_MOCK_API) {
      return mockTopContent;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/analytics/top-content');
    // return response.json();
    return mockTopContent;
  },
};

// Dashboard API
export const dashboardApi = {
  async getStats() {
    await delay();
    if (USE_MOCK_API) {
      return mockDashboardStats;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/dashboard/stats');
    // return response.json();
    return mockDashboardStats;
  },

  async getRecentCampaigns() {
    await delay();
    if (USE_MOCK_API) {
      return mockRecentCampaigns;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/dashboard/recent-campaigns');
    // return response.json();
    return mockRecentCampaigns;
  },

  async getTopCreators() {
    await delay();
    if (USE_MOCK_API) {
      return mockTopCreators;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/dashboard/top-creators');
    // return response.json();
    return mockTopCreators;
  },
};

// Campaigns API
export const campaignsApi = {
  async getCampaigns() {
    await delay();
    if (USE_MOCK_API) {
      return mockCampaigns;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/campaigns');
    // return response.json();
    return mockCampaigns;
  },

  async getCampaignById(id: number) {
    await delay();
    if (USE_MOCK_API) {
      return mockCampaigns.find(c => c.id === id);
    }
    // TODO: Replace with real API call
    // const response = await fetch(`/api/campaigns/${id}`);
    // return response.json();
    return mockCampaigns.find(c => c.id === id);
  },

  async createCampaign(data: any) {
    await delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/campaigns', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    console.log('Creating campaign:', data);
    return { success: true };
  },

  async updateCampaign(id: number, data: any) {
    await delay();
    // TODO: Replace with real API call
    // const response = await fetch(`/api/campaigns/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    console.log('Updating campaign:', id, data);
    return { success: true };
  },

  async deleteCampaign(id: number) {
    await delay();
    // TODO: Replace with real API call
    // const response = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    // return response.json();
    console.log('Deleting campaign:', id);
    return { success: true };
  },
};

// Creators API
export const creatorsApi = {
  async getCreators() {
    await delay();
    if (USE_MOCK_API) {
      return mockCreators;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/creators');
    // return response.json();
    return mockCreators;
  },

  async getCreatorById(id: number) {
    await delay();
    if (USE_MOCK_API) {
      return mockCreators.find(c => c.id === id);
    }
    // TODO: Replace with real API call
    // const response = await fetch(`/api/creators/${id}`);
    // return response.json();
    return mockCreators.find(c => c.id === id);
  },

  async inviteCreator(email: string) {
    await delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/creators/invite', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });
    // return response.json();
    console.log('Inviting creator:', email);
    return { success: true };
  },
};

// Payments API
export const paymentsApi = {
  async getPayments() {
    await delay();
    if (USE_MOCK_API) {
      return mockPayments;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/payments');
    // return response.json();
    return mockPayments;
  },

  async processPayment(id: number) {
    await delay();
    // TODO: Replace with real API call
    // const response = await fetch(`/api/payments/${id}/process`, { method: 'POST' });
    // return response.json();
    console.log('Processing payment:', id);
    return { success: true };
  },
};

// Assets API
export const assetsApi = {
  async getAssets() {
    await delay();
    if (USE_MOCK_API) {
      return mockAssets;
    }
    // TODO: Replace with real API call
    // const response = await fetch('/api/assets');
    // return response.json();
    return mockAssets;
  },

  async getAssetById(id: number) {
    await delay();
    if (USE_MOCK_API) {
      return mockAssets.find(a => a.id === id);
    }
    // TODO: Replace with real API call
    // const response = await fetch(`/api/assets/${id}`);
    // return response.json();
    return mockAssets.find(a => a.id === id);
  },

  async uploadAsset(formData: FormData) {
    await delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/assets', {
    //   method: 'POST',
    //   body: formData,
    // });
    // return response.json();
    console.log('Uploading asset:', formData);
    return { success: true };
  },
};
