import { TrendingUp, TrendingDown, Eye, DollarSign, Users, Video, Calendar } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { analyticsApi } from '../services/api';

const Analytics = () => {
  // Fetch data using custom hooks
  const { data: overviewStats, loading: statsLoading } = useApi(() => analyticsApi.getOverviewStats());
  const { data: platformData, loading: platformLoading } = useApi(() => analyticsApi.getPlatformData());
  const { data: topContent, loading: contentLoading } = useApi(() => analyticsApi.getTopContent());

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Eye, DollarSign, TrendingDown, Users };
    return icons[iconName] || Eye;
  };

  // Show loading state
  if (statsLoading || platformLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your campaign performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats?.map((stat) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === 'blue'
                      ? 'bg-blue-100 text-blue-600'
                      : stat.color === 'green'
                      ? 'bg-green-100 text-green-600'
                      : stat.color === 'purple'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Views Over Time</h2>
          <div className="h-64 flex items-end justify-around gap-2 px-4">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => (
              <div key={week} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all"
                  style={{ height: `${[140, 180, 160, 200][i]}px` }}
                />
                <span className="text-xs text-gray-500">{week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spend Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Spend by Platform</h2>
          <div className="space-y-4">
            {platformData?.map((platform) => (
              <div key={platform.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                  <span className="text-sm text-gray-500">{platform.spend}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${platform.color} rounded-full`}
                    style={{
                      width: platform.name === 'YouTube' ? '47%' : platform.name === 'TikTok' ? '31%' : '22%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Spend</span>
              <span className="font-semibold text-gray-900">$89,420</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Performance & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Platform</th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Views</th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Spend</th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">CPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {platformData?.map((platform) => (
                  <tr key={platform.name}>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                        <span className="font-medium text-gray-900">{platform.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{platform.views}</td>
                    <td className="py-4 text-gray-600">{platform.spend}</td>
                    <td className="py-4 text-gray-600">{platform.cpm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Content</h2>
          <div className="space-y-4">
            {topContent?.map((content, index) => (
              <div key={content.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-400 w-4">{index + 1}</span>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                  <p className="text-xs text-gray-500">by {content.creator}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 text-sm">{content.views}</p>
                  <p className="text-xs text-green-500">{content.engagement} eng.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
