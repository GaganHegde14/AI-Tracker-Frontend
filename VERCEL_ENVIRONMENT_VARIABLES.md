# Vercel Environment Variables Setup

## Critical: Set these environment variables in your Vercel dashboard

To fix the API connection issues, you need to configure these environment variables in your Vercel project:

### Required Environment Variables:

1. **VITE_API_BASE_URL**

   - Value: `https://ai-tracker-backend.onrender.com`
   - This is your deployed backend URL

2. **VITE_BACKEND_URL**

   - Value: `https://ai-tracker-backend.onrender.com`
   - Backup environment variable for API calls

3. **VITE_APP_NAME**
   - Value: `Progress AI`
   - Application name

### How to set up in Vercel:

1. Go to your Vercel dashboard
2. Select your "AI-Tracker-Frontend" project
3. Go to "Settings" → "Environment Variables"
4. Add each variable with the values above
5. Redeploy your application

### Test after setup:

- Tasks should sync properly after completion
- Profile page should show correct level and task count
- No more "Network Error" or "ERR_CONNECTION_REFUSED" errors
- API endpoints will be: 
  - `GET /level` - Fetch user level
  - `PUT /level` - Update user level
  - `POST /level/increment` - Increment tasks completed

**Last Updated:** December 27, 2025
**Backend URL:** https://ai-tracker-backend.onrender.com
