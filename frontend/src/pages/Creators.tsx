import { Plus, Search, Filter, Star, ExternalLink } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { creatorsApi } from '../services/api';

const Creators = () => {
  // Fetch creators using custom hook
  const { data: creators, loading } = useApi(() => creatorsApi.getCreators());

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading creators...</div>
      </div>
    );
  }
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return 'bg-red-100 text-red-700';
      case 'TikTok':
        return 'bg-gray-900 text-white';
      case 'Instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creators</h1>
          <p className="text-gray-500 mt-1">Manage your creator partnerships and collaborations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Creator
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Creators</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Active Partnerships</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">32</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Avg. Rating</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4.7</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Reach</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">45.2M</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search creators..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>All Platforms</option>
          <option>YouTube</option>
          <option>TikTok</option>
          <option>Instagram</option>
        </select>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators?.map((creator) => (
          <div
            key={creator.id}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getPlatformColor(
                      creator.platform
                    )}`}
                  >
                    {creator.platform}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{creator.handle}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{creator.rating}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{creator.subscribers}</p>
                <p className="text-xs text-gray-500">Subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{creator.avgViews}</p>
                <p className="text-xs text-gray-500">Avg. Views</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{creator.campaigns}</p>
                <p className="text-xs text-gray-500">Campaigns</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                View Profile
              </button>
              <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Creators;
