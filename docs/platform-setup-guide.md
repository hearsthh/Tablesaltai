# Platform Integration Setup Guide

## 1. Google My Business API Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google My Business API
   - Google My Business Business Information API
   - Google My Business Account Management API

### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in Google Cloud Console
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Set application type to "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### Step 3: Get Refresh Token
\`\`\`javascript
// Use this code to get refresh token (server-side only)
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/business.manage&access_type=offline&response_type=code&prompt=consent`;

// After user authorizes, exchange code for tokens
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: AUTHORIZATION_CODE,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  }),
});
\`\`\`

### Environment Variables (Server-side only)
\`\`\`bash
GOOGLE_MY_BUSINESS_CLIENT_ID=your_client_id
GOOGLE_MY_BUSINESS_CLIENT_SECRET=your_client_secret
GOOGLE_MY_BUSINESS_REFRESH_TOKEN=your_refresh_token
\`\`\`

## 2. Yelp Fusion API Setup

### Step 1: Create Yelp Developer Account
1. Go to [Yelp Developers](https://www.yelp.com/developers)
2. Sign up or log in
3. Create a new app

### Step 2: Get API Key
1. Fill out the app creation form
2. Copy your API Key

### Environment Variables (Server-side only)
\`\`\`bash
YELP_API_KEY=your_yelp_api_key
\`\`\`

## 3. OpenTable API Setup

### Step 1: Apply for OpenTable Partner Program
1. Go to [OpenTable for Restaurants](https://restaurant.opentable.com/)
2. Contact their partnership team
3. Apply for API access (requires existing restaurant partnership)

### Step 2: Get Credentials
1. Once approved, you'll receive:
   - Client ID
   - Client Secret
   - Restaurant ID

### Environment Variables (Server-side only)
\`\`\`bash
OPENTABLE_CLIENT_ID=your_client_id
OPENTABLE_CLIENT_SECRET=your_client_secret
OPENTABLE_RESTAURANT_ID=your_restaurant_id
\`\`\`

## 4. Testing Your Integrations

### Create Test Component
\`\`\`typescript
// components/integration-tester.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function IntegrationTester() {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const testConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/integrations/test-connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // All credentials are handled server-side for security
          testMode: true
        }),
      });

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Failed to test connections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Test Platform Integrations</h3>
      
      <Button onClick={testConnections} disabled={loading} className="mb-4">
        {loading ? 'Testing...' : 'Test All Connections'}
      </Button>

      <div className="space-y-2">
        {Object.entries(results).map(([platform, success]) => (
          <div key={platform} className="flex items-center justify-between">
            <span className="capitalize">{platform.replace(/([A-Z])/g, ' $1')}</span>
            <span className={success ? 'text-green-600' : 'text-red-600'}>
              {success ? '✓ Connected' : '✗ Failed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## 5. Common Issues and Solutions

### Google My Business
- **Issue**: "Access forbidden" error
- **Solution**: Ensure your Google account has access to the business location

### Yelp
- **Issue**: Rate limiting
- **Solution**: Implement proper caching and respect rate limits (5000 requests/day)

### OpenTable
- **Issue**: API access denied
- **Solution**: OpenTable requires existing restaurant partnership and approval process

## 6. Production Considerations

### Security
- Store ALL API keys as server-side environment variables only
- Never expose sensitive credentials in client-side code
- Use HTTPS for all API calls
- Implement proper error handling
- Add request logging and monitoring

### Rate Limiting
- Implement exponential backoff
- Cache responses when possible
- Use webhooks instead of polling when available

### Data Sync
- Implement incremental sync
- Handle API failures gracefully
- Provide manual sync options
- Store sync timestamps

## 7. Next Steps

1. **Start with Yelp**: Easiest to set up and test
2. **Add Google My Business**: Most important for local SEO
3. **Integrate OpenTable**: If you're already a partner
4. **Add more platforms**: TripAdvisor, Zomato, etc.

## 8. Support

For issues with specific platforms:
- Google My Business: [Google My Business API Support](https://developers.google.com/my-business/support)
- Yelp: [Yelp Developer Support](https://www.yelp.com/developers/support)
- OpenTable: Contact your OpenTable representative

## 9. Security Best Practices

### Environment Variable Management
- Use server-side environment variables for all API keys
- Never include sensitive keys in client-side code
- Use different keys for development and production
- Regularly rotate API keys
- Monitor API usage for unusual activity

### API Key Security
\`\`\`bash
# ✅ Correct - Server-side only
GOOGLE_MY_BUSINESS_API_KEY=your_key_here
YELP_API_KEY=your_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret
\`\`\`

### Implementation Pattern
\`\`\`typescript
// ✅ Correct - Server-side API route
// app/api/integrations/google/route.ts
export async function GET() {
  const apiKey = process.env.GOOGLE_MY_BUSINESS_API_KEY; // Server-side only
  // ... make API calls
}

// ✅ Correct - Client calls server route
// components/integration-component.tsx
const response = await fetch('/api/integrations/google');
\`\`\`

## 10. Environment Variables Reference

### Required Server-Side Variables
\`\`\`bash
# Google My Business
GOOGLE_MY_BUSINESS_CLIENT_ID=your_google_client_id
GOOGLE_MY_BUSINESS_CLIENT_SECRET=your_google_client_secret
GOOGLE_MY_BUSINESS_REFRESH_TOKEN=your_google_refresh_token

# Yelp
YELP_API_KEY=your_yelp_api_key

# OpenTable
OPENTABLE_CLIENT_ID=your_opentable_client_id
OPENTABLE_CLIENT_SECRET=your_opentable_client_secret
OPENTABLE_RESTAURANT_ID=your_restaurant_id

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
FAL_API_KEY=your_fal_api_key

# Payments (Server-side only)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
\`\`\`

### Public Variables (Safe for Client)
\`\`\`bash
# Only these specific variables can be prefixed with NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## 11. Testing Checklist

- [ ] All API keys are server-side only
- [ ] No sensitive variables in client code
- [ ] Integration tests pass
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Environment variables set in production
- [ ] HTTPS enabled
- [ ] API usage monitoring active

## 12. Deployment Security

### Before Deployment
1. Review all environment variables
2. Ensure no sensitive data in client code
3. Test all API integrations
4. Verify HTTPS configuration
5. Check rate limiting implementation

### After Deployment
1. Monitor API usage
2. Check error logs
3. Verify all integrations work
4. Test security measures
5. Monitor performance metrics

### Security Monitoring
- Set up alerts for unusual API usage
- Monitor failed authentication attempts
- Track rate limit violations
- Log all API errors
- Regular security audits

## 13. Payment Integration Security

### Razorpay Setup
1. Create Razorpay account
2. Get API keys from dashboard
3. Store keys securely server-side only
4. Never expose secret keys in client code

### Payment Security Pattern
\`\`\`typescript
// ✅ Correct - Server-side payment processing
// app/api/payments/create-order/route.ts
export async function POST() {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID; // Server-side only
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET; // Server-side only
  // ... process payment
}

// ✅ Correct - Client initiates payment
// components/payment-component.tsx
const response = await fetch('/api/payments/create-order');
\`\`\`

### Payment Environment Variables
\`\`\`bash
# Server-side payment credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
