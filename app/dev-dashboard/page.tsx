import { AIFeatureTester } from "@/components/ai/ai-feature-tester"
import { AIServiceStatus } from "@/components/ai/ai-service-status"

export default function DevDashboard() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">🚀 TableSalt AI Development Dashboard</h1>
        <p className="text-gray-600">Test and verify all AI features and integrations</p>
      </div>

      <AIServiceStatus />
      <AIFeatureTester />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">🍽️ Restaurant Features</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Smart menu optimization</li>
            <li>• AI-generated food descriptions</li>
            <li>• Price analysis and recommendations</li>
            <li>• Review sentiment analysis</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">📊 Customer Analytics</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Customer segmentation</li>
            <li>• Churn prediction</li>
            <li>• Behavioral insights</li>
            <li>• Lifetime value analysis</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">🎯 Marketing AI</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Campaign orchestration</li>
            <li>• Content generation</li>
            <li>• Image creation</li>
            <li>• Performance optimization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
