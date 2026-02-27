import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Video,
  Target,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { dashboardApi } from '../services/api';

const Dashboard = () => {
  // Fetch data using custom hooks
  const { data: statsCards, loading: statsLoading } = useApi(() => dashboardApi.getStats());
  const { data: recentCampaigns, loading: campaignsLoading } = useApi(() => dashboardApi.getRecentCampaigns());
  const { data: topCreators, loading: creatorsLoading } = useApi(() => dashboardApi.getTopCreators());

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Target, DollarSign, Eye, Video };
    return icons[iconName] || Target;
  };

  // Show loading state
  if (statsLoading || campaignsLoading || creatorsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }
  const getPlatformIcon = (platform: string) => {
    if (platform === 'facebook') {
      return (
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">f</span>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-2xl">G</span>
      </div>
    );
  };



  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
      </div>

      {/* Revenue Card */}
      {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Your total revenue</p>
            <p className="text-4xl font-bold text-purple-500 mt-1">$90,239.00</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Select Dates
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards?.map((stat) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === 'purple'
                      ? 'bg-purple-100 text-purple-600'
                      : stat.color === 'green'
                        ? 'bg-green-100 text-green-600'
                        : stat.color === 'blue'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-orange-100 text-orange-600'
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.changeType === 'positive'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                    }`}
                >
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">compared to last week</p>
              {/* Smooth Line Chart */}
              <div className="mt-auto h-16 relative">
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`gradient-${stat.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={
                        stat.color === 'purple' ? '#a855f7' :
                          stat.color === 'green' ? '#22c55e' :
                            stat.color === 'blue' ? '#3b82f6' :
                              '#f97316'
                      } stopOpacity="0.3" />
                      <stop offset="100%" stopColor={
                        stat.color === 'purple' ? '#a855f7' :
                          stat.color === 'green' ? '#22c55e' :
                            stat.color === 'blue' ? '#3b82f6' :
                              '#f97316'
                      } stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines - Y axis */}
                  <line x1="0" y1="15" x2="200" y2="15" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="30" x2="200" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="45" x2="200" y2="45" stroke="#f3f4f6" strokeWidth="1" />
                  {/* Grid lines - X axis */}
                  <line x1="50" y1="0" x2="50" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="100" y1="0" x2="100" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="150" y1="0" x2="150" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                  {/* Bottom axis line */}
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#e5e7eb" strokeWidth="1.5" />
                  {/* Area fill */}
                  <path
                    d={stat.changeType === 'positive'
                      ? "M0,50 Q20,45 40,42 T80,35 T120,30 T160,25 T200,20 L200,60 L0,60 Z"
                      : "M0,30 Q20,32 40,35 T80,38 T120,42 T160,45 T200,50 L200,60 L0,60 Z"}
                    fill={`url(#gradient-${stat.color})`}
                  />
                  {/* Line */}
                  <path
                    d={stat.changeType === 'positive'
                      ? "M0,50 Q20,45 40,42 T80,35 T120,30 T160,25 T200,20"
                      : "M0,30 Q20,32 40,35 T80,38 T120,42 T160,45 T200,50"}
                    fill="none"
                    stroke={
                      stat.color === 'purple' ? '#a855f7' :
                        stat.color === 'green' ? '#22c55e' :
                          stat.color === 'blue' ? '#3b82f6' :
                            '#f97316'
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Campaigns & Top Creators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
              View all
            </button>
          </div>


          {/* Campaign Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCampaigns?.slice(0, 2).map((campaign) => (
              <div
                key={campaign.id}
                className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  {getPlatformIcon(campaign.platform)}
                  <div className="flex -space-x-2">
                    {campaign.avatars?.map((avatar, i) => (
                      <img
                        key={i}
                        src={avatar}
                        alt=""
                        className="w-7 h-7 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>Start: {campaign.startDate}</span>
                  {campaign.endDate && <span>• Ends: {campaign.endDate}</span>}
                </div>
                {campaign.progress && campaign.progress > 0 && campaign.progress < 100 && (
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-400">Last updated: {campaign.lastUpdated}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Creators</h2>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {topCreators?.map((creator, index) => (
              <div
                key={creator.name}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-400 w-4">
                  {index + 1}
                </span>
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{creator.name}</p>
                  <p className="text-xs text-gray-500">{creator.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Views by Channel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Views by Channel</h2>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        {/* Chart Placeholder */}
        <div className="h-64 bg-gradient-to-b from-purple-50 to-white rounded-xl flex items-end justify-around p-6">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div
                  className="w-6 bg-purple-400 rounded-t-lg"
                  style={{ height: `${[120, 90, 140, 100, 160, 80, 110][i]}px` }}
                />
                <div
                  className="w-6 bg-orange-400 rounded-t-lg"
                  style={{ height: `${[80, 60, 100, 70, 120, 50, 90][i]}px` }}
                />
              </div>
              <span className="text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <span className="text-sm text-gray-600">YouTube</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full" />
            <span className="text-sm text-gray-600">TikTok</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
