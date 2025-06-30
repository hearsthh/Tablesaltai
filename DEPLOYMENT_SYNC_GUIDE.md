# Deployment Sync Guide

## Overview
This guide helps you understand how to sync changes from v0 to your live website at tablesalt.fyi.

## Current Status
- ✅ **v0 Development**: Latest code with all features
- ❌ **Live Site**: Showing older version
- 🔄 **Action Needed**: Deploy from v0 to sync

## Step-by-Step Deployment

### 1. Deploy from v0
- Look for the **"Deploy"** button in the top-right corner of this v0 chat
- Click **"Deploy to Vercel"**
- Select your existing project (tablesalt.fyi)
- Wait for deployment to complete (2-3 minutes)

### 2. Verify Deployment
- Visit **https://tablesalt.fyi**
- Hard refresh: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac)
- Check that you see the updated homepage

### 3. Test Features
- Navigate through different pages
- Test on mobile devices
- Verify all links work correctly

## What You'll See After Deployment

### Before (Current Live Site)
- Basic cards layout
- Simple "Deployment Successful" message
- Limited functionality

### After (Updated from v0)
- Rich hero section with animations
- Detailed module descriptions
- Customer testimonials
- Professional footer
- Mobile-responsive design

## Troubleshooting

### If Deployment Fails
1. Check for any error messages
2. Ensure all environment variables are set
3. Try deploying again after a few minutes

### If Changes Don't Appear
1. Clear browser cache
2. Try incognito/private browsing mode
3. Check different devices/browsers

### If Features Don't Work
1. Check browser console for errors
2. Verify API keys are configured
3. Test individual components

## Environment Variables Needed

### Required for Full Functionality
- `OPENAI_API_KEY` - For AI content generation
- `FAL_API_KEY` - For image generation
- `SUPABASE_URL` - For database
- `SUPABASE_ANON_KEY` - For database access
- `RAZORPAY_KEY_ID` - For payments

### Optional but Recommended
- `NEXT_PUBLIC_SUPABASE_URL` - For client-side database access
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - For client-side database access

## Next Steps After Deployment

1. **Set up environment variables** in Vercel dashboard
2. **Test payment flow** with Razorpay
3. **Configure database** with Supabase
4. **Add AI API keys** for content generation
5. **Test with real restaurant data**

## Support

If you encounter any issues:
1. Check the deployment logs in Vercel
2. Review error messages carefully
3. Ensure all required files are present
4. Contact support if problems persist

Remember: Every change made in v0 needs to be deployed to appear on your live site!
