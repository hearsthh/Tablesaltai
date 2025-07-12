import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using TableSalt AI ("the Service"), you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              TableSalt AI is a restaurant management platform that provides AI-powered tools for menu optimization,
              customer insights, and marketing automation.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept
              responsibility for all activities that occur under your account.
            </p>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Upload, post, or transmit any content that is unlawful, harmful, or objectionable</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except
              as required by law.
            </p>

            <h2>6. Data and Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              Service.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by TableSalt AI and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall TableSalt AI be liable for any indirect, incidental, special, consequential, or punitive
              damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>10. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at legal@tablesalt.ai</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
