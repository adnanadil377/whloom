import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    Video,
    Clock,
    Briefcase,
} from 'lucide-react';

const CreatorDashboard = () => {
    // Mock Data
    const stats = [
        {
            title: 'Total Earning',
            value: '$12,450',
            change: '+15%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'green',
            subtitle: 'Avg. $500/campaign',
        },
        {
            title: 'Total Spend',
            value: '$2,300',
            change: '+5%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'red', // Or maybe orange for spend?
            subtitle: 'Equipment & Software',
        },
        {
            title: 'Total Views',
            value: '1.2M',
            change: '+22%',
            changeType: 'positive',
            icon: Eye,
            color: 'blue',
            subtitle: 'Avg. CPM $12.50',
        },
        {
            title: 'New Videos',
            value: '8',
            change: '-2%',
            changeType: 'negative',
            icon: Video,
            color: 'purple',
            subtitle: 'Last 30 days',
        },
    ];

    const recentCampaigns = [
        {
            id: 1,
            name: 'Tech Review 2024',
            brand: 'TechGear',
            status: 'In Progress',
            deadline: '2 days left',
            payout: '$800',
        },
        {
            id: 2,
            name: 'Summer Fashion Haul',
            brand: 'StyleCo',
            status: 'Pending Review',
            deadline: '5 days left',
            payout: '$1,200',
        },
    ];

    const availableCampaigns = [
        {
            id: 1,
            name: 'Gaming Headset Launch',
            brand: 'GameAudio',
            platform: 'YouTube',
            payout: '$1,500 - $3,000',
            requirements: '10k+ Subs',
        },
        {
            id: 2,
            name: 'Fitness App Promotion',
            brand: 'FitLife',
            platform: 'TikTok',
            payout: '$500 - $1,000',
            requirements: '50k+ Followers',
        },
        {
            id: 3,
            name: 'Organic Skincare Routine',
            brand: 'PureSkin',
            platform: 'Instagram',
            payout: '$800 - $1,200',
            requirements: '20k+ Followers',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, Creator! Here's your overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
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
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Campaigns Overview - Split into two blocks as per wireframe logic or just 2 cards */}
                {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                                <p className="text-sm text-gray-500">{campaign.brand}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                                }`}>
                                {campaign.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {campaign.deadline}
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {campaign.payout}
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Available Campaigns */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Available Campaigns</h2>
                    <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                        View all
                    </button>
                </div>
                <div className="space-y-4">
                    {availableCampaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span>{campaign.brand}</span>
                                        <span>•</span>
                                        <span className="capitalize">{campaign.platform}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900">{campaign.payout}</p>
                                <p className="text-sm text-gray-500">{campaign.requirements}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;
