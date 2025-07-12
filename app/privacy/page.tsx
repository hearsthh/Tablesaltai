import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We collect information you provide directly to us, such as:</p>
            <ul>
              <li>Name, email address, and contact information</li>
              <li>Restaurant business information</li>
              <li>Payment and billing information</li>
              <li>Communications with our support team</li>
            </ul>

            <h3>Usage Information</h3>
            <p>We automatically collect certain information about your use of our Service:</p>
            <ul>
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
              <li>Performance and error data</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve our Service</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
            <ul>
              <li>With your consent</li>
              <li>To service providers who assist us in operating our Service</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our Service and fulfill the
              purposes outlined in this policy, unless a longer retention period is required by law.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
            </ul>

            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to collect and use personal information about you. You
              can control cookies through your browser settings.
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place for such transfers.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13. We do not knowingly collect personal information from
              children under 13.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on this page.
            </p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@tablesalt.ai</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
