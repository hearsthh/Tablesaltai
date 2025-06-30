# TableSalt AI - New User Flow Testing Guide

## Overview
This guide provides comprehensive instructions for testing the new user onboarding experience in TableSalt AI.

## Quick Start Testing

### 1. Access Test Interface
\`\`\`
http://localhost:3000/test-new-user-flow
\`\`\`

### 2. Start Fresh Onboarding
\`\`\`
http://localhost:3000/onboarding?new=true
\`\`\`

## Individual Module Testing

### Social Profile Creation
\`\`\`
http://localhost:3000/profile/social-profile?onboarding=true&new=true
\`\`\`

**Features to Test:**
- ✅ All 7 tabs (Basic, Brand, Profile, Features, Rewards, Marketing, Media)
- ✅ AI Profile Generation with platform selection
- ✅ Smart Fill functionality
- ✅ Save/Preview/Publish workflow
- ✅ Form validation and completion tracking

### Menu Builder
\`\`\`
http://localhost:3000/profile/menu-builder?onboarding=true&new=true
\`\`\`

### Review Management
\`\`\`
http://localhost:3000/profile/reviews?onboarding=true&new=true
\`\`\`

### Platform Integrations
\`\`\`
http://localhost:3000/profile/integrations?onboarding=true&new=true
\`\`\`

## Testing Checklist

### Pre-Testing Setup
- [ ] Clear browser storage (localStorage, sessionStorage, cookies)
- [ ] Use incognito/private browsing mode
- [ ] Check system health via test interface

### Core Functionality Tests
- [ ] Onboarding flow navigation works
- [ ] All tabs in social profile are accessible
- [ ] AI generation buttons are functional
- [ ] Form data persists between tabs
- [ ] Progress tracking updates correctly
- [ ] Save functionality works
- [ ] Preview modal displays correctly

### AI Features Tests
- [ ] "Generate AI Profile" button works
- [ ] Platform selection modal appears
- [ ] Profile generation modal shows progress
- [ ] Generated content populates forms
- [ ] Smart Fill modal functions correctly

### Mobile Responsiveness
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Navigation works on touch devices
- [ ] Forms are usable on small screens

### Error Handling
- [ ] Network errors are handled gracefully
- [ ] Form validation works correctly
- [ ] Loading states display properly
- [ ] Toast notifications appear

## Custom Domain Testing (tablesalt.fyi)

### DNS Configuration
1. Add CNAME records:
   \`\`\`
   @ → cname.vercel-dns.com
   www → cname.vercel-dns.com
   \`\`\`

2. Verify in Vercel dashboard under "Domains"

### Production Testing URLs
\`\`\`
https://tablesalt.fyi/test-new-user-flow
https://tablesalt.fyi/onboarding?new=true
https://tablesalt.fyi/profile/social-profile?onboarding=true&new=true
\`\`\`

## Environment Variables Checklist
Ensure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `FAL_API_KEY`

## Common Issues & Solutions

### "Generate AI Profile" Not Working
- Check OpenAI API key is set
- Verify network connectivity
- Check browser console for errors

### Forms Not Saving
- Verify Supabase connection
- Check environment variables
- Test database permissions

### Mobile Layout Issues
- Test with actual devices
- Check CSS media queries
- Verify touch interactions

## Performance Testing
- Page load time should be < 3 seconds
- AI generation should complete within 30 seconds
- Form interactions should be responsive
- Image uploads should work smoothly

## Browser Compatibility
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Reporting Issues
When reporting issues, include:
- Browser and version
- Device type and screen size
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots or screen recordings
