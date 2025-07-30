import SurveyForm from '@/components/survey-form'

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-white rounded-lg p-4 mr-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-400 rounded-full"></div>
                <div className="space-y-1">
                  <div className="w-6 h-2 bg-green-400 rounded"></div>
                  <div className="w-6 h-2 bg-green-400 rounded"></div>
                </div>
                <div className="w-8 h-4 bg-yellow-400 rounded"></div>
              </div>
            </div>
            <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Vaniloom Beta User Survey</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              Welcome to Vaniloom's first beta test! Vaniloom is a personalized fanfiction/fan content creation platform for North America, currently supporting English only.
              Your beta testing personal information will be kept strictly private. We will immediately send you a beta account to your WeChat or email after receiving your survey response. Thank you for your support!
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <SurveyForm />
          </div>
        </div>
      </div>
    </div>
  )
}