import { Plus, Search, Filter, Grid, List, FolderOpen, Image, Video, FileText, MoreHorizontal, Download } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { assetsApi } from '../services/api';

const Assets = () => {
  // Fetch assets using custom hook
  const { data: assets, loading } = useApi(() => assetsApi.getAssets());

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading assets...</div>
      </div>
    );
  }
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'folder':
        return <FolderOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-600';
      case 'image':
        return 'bg-blue-100 text-blue-600';
      case 'folder':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-500 mt-1">Manage your campaign assets and media files</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Files</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">248</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Videos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">64</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Images</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Storage Used</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12.4 GB</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>All Types</option>
          <option>Videos</option>
          <option>Images</option>
          <option>Documents</option>
          <option>Folders</option>
        </select>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button className="p-2.5 bg-purple-50 text-purple-600">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2.5 text-gray-400 hover:text-gray-600">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets?.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Thumbnail */}
            <div className="h-40 bg-gray-100 relative">
              {asset.thumbnail ? (
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`p-4 rounded-xl ${getTypeColor(asset.type || 'document')}`}>
                    {getTypeIcon(asset.type || 'document')}
                  </div>
                </div>
              )}
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${getTypeColor(asset.type || 'document')}`}>
                    {getTypeIcon(asset.type || 'document')}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm truncate" style={{ maxWidth: '180px' }}>
                      {asset.name || asset.title}
                    </h3>
                    <p className="text-xs text-gray-500">{asset.size}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{asset.uploadedBy || asset.creator}</span> •{' '}
                  {asset.uploadedAt || asset.uploadDate}
                </p>
                <p className="text-xs text-purple-600 mt-1">{asset.campaign}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assets;
