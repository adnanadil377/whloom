import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface CampaignFormData {
  // Stage 1 - Info
  campaignName: string;
  cpm: string;
  budget: string;
  timeline: string;

  // Stage 2 - Terms
  termsOfServices: string;
  campaignAssets: string;

  // Stage 3 - Targeting
  platforms: string[];
  region: string;
  language: string;
  niche: string;
}

const CreateCampaign = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: '',
    cpm: '',
    budget: '',
    timeline: '',
    termsOfServices: '',
    campaignAssets: '',
    platforms: [],
    region: '',
    language: '',
    niche: '',
  });

  const stages = [
    { number: 1, name: 'Info' },
    { number: 2, name: 'Terms' },
    { number: 3, name: 'Targeting' },
    { number: 4, name: 'Review' },
  ];

  const platformOptions = [
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'facebook', name: 'Facebook', icon: 'f' },
  ];

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleNext = () => {
    if (currentStage < 4) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handlePublish = () => {
    console.log('Publishing campaign:', formData);
    // Here you would integrate with your API
    alert('Campaign published successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create a new Campaign</h1>
          <p className="text-gray-500 mt-1">Follow the steps to create your campaign</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              />
            </div>

            {stages.map((stage) => (
              <div key={stage.number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStage > stage.number
                      ? 'bg-purple-600 text-white'
                      : currentStage === stage.number
                        ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                >
                  {currentStage > stage.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stage.number
                  )}
                </div>
                <span className={`text-sm mt-2 font-medium ${currentStage >= stage.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Stage 1 - Info */}
          {currentStage === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Stages 1 - Info
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.campaignName}
                  onChange={(e) => handleInputChange('campaignName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPM
                </label>
                <input
                  type="text"
                  value={formData.cpm}
                  onChange={(e) => handleInputChange('cpm', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter CPM rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter budget amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 2 weeks, 1 month"
                />
              </div>
            </div>
          )}

          {/* Stage 2 - Terms */}
          {currentStage === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Stages 2 - Terms
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms of services
                </label>
                <textarea
                  value={formData.termsOfServices}
                  onChange={(e) => handleInputChange('termsOfServices', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px]"
                  placeholder="Enter terms and conditions for this campaign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Assets
                </label>
                <textarea
                  value={formData.campaignAssets}
                  onChange={(e) => handleInputChange('campaignAssets', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                  placeholder="Describe the assets, links, or resources for creators"
                />
              </div>
            </div>
          )}

          {/* Stage 3 - Targeting */}
          {currentStage === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Stages 3 - Targeting
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Platforms
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${formData.platforms.includes(platform.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="font-medium text-gray-900">{platform.name}</span>
                      {formData.platforms.includes(platform.id) && (
                        <Check className="w-5 h-5 text-purple-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., North America, Europe, Global"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., English, Spanish, Multiple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche
                </label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => handleInputChange('niche', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Gaming, Beauty, Tech, Lifestyle"
                />
              </div>
            </div>
          )}

          {/* Stage 4 - Review */}
          {currentStage === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Stages 4 - Review
                </h2>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Summary of all the options
                </h3>

                <div className="space-y-4">
                  {/* Campaign Info */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-purple-600 mb-3">Campaign Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium text-gray-900">{formData.campaignName || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">CPM:</span>
                        <p className="font-medium text-gray-900">{formData.cpm || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <p className="font-medium text-gray-900">{formData.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeline:</span>
                        <p className="font-medium text-gray-900">{formData.timeline || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-purple-600 mb-3">Terms & Assets</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Terms of Services:</span>
                        <p className="font-medium text-gray-900 mt-1 line-clamp-3">
                          {formData.termsOfServices || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Campaign Assets:</span>
                        <p className="font-medium text-gray-900 mt-1 line-clamp-3">
                          {formData.campaignAssets || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Targeting */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-purple-600 mb-3">Targeting</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Platforms:</span>
                        <p className="font-medium text-gray-900">
                          {formData.platforms.length > 0
                            ? formData.platforms.map(p => platformOptions.find(opt => opt.id === p)?.name).join(', ')
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Region:</span>
                        <p className="font-medium text-gray-900">{formData.region || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Language:</span>
                        <p className="font-medium text-gray-900">{formData.language || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Niche:</span>
                        <p className="font-medium text-gray-900">{formData.niche || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStage > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStage < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors ml-auto"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors ml-auto"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
