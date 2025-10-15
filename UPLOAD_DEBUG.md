# Upload Error Debugging Guide

## Issue: "Unexpected end of JSON input" in Production

This error typically occurs when the server response is empty or malformed, causing `response.json()` to fail.

## Solutions Implemented

### 1. Robust Error Handling in Components

Updated `image-upload.tsx` and `HeroManagement.tsx` with proper error handling:

```typescript
// Before
const result = await response.json();

// After
let result;
try {
  result = await response.json();
} catch {
  throw new Error('Invalid response from server');
}
```

### 2. Enhanced Upload API (`/api/upload`)

- Added detailed error logging
- Improved error response handling
- Added environment variable validation

### 3. ImageKit Configuration Validation

Added environment variable validation in `lib/imagekit.ts` to catch missing configuration early.

### 4. Utility Functions

Created `safeFetch` and `uploadFile` utilities in `lib/utils.ts` for consistent error handling.

## Debugging Tools

### Health Check Endpoint: `/api/health`

Check if all environment variables are properly configured:

```bash
curl https://your-domain.com/api/health
```

### Upload Debug Endpoint: `/api/upload-debug`

Test upload functionality with detailed logging:

```bash
curl -X POST -F "file=@test-image.jpg" -F "folder=test" https://your-domain.com/api/upload-debug
```

## Common Production Issues

### 1. Missing Environment Variables

Check that these are set in your production environment:
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`  
- `IMAGEKIT_URL_ENDPOINT`

### 2. File Size Limits

Ensure your hosting platform supports:
- File uploads > 10MB (if needed)
- Proper timeout settings for image processing

### 3. ImageKit API Limits

- Check ImageKit dashboard for rate limits
- Verify API key permissions
- Ensure sufficient storage quota

### 4. Network Issues

- Check if ImageKit API is accessible from your server
- Verify firewall/security group settings
- Test with smaller files first

## Monitoring and Logs

1. Check server logs for detailed error messages
2. Monitor ImageKit dashboard for failed uploads
3. Use browser developer tools to inspect network requests
4. Check the `/api/health` endpoint regularly

## Quick Fixes to Try

1. **Restart your production server** - Environment variables might not be loaded
2. **Test with smaller files** - Rule out file size issues
3. **Check ImageKit dashboard** - Look for quota/rate limit issues
4. **Verify environment variables** - Use the health check endpoint
5. **Test the debug endpoint** - Get detailed logging information

## If Issues Persist

1. Enable more detailed logging in production
2. Test upload functionality with the debug endpoint
3. Check ImageKit service status
4. Contact hosting provider if server-side issues are suspected