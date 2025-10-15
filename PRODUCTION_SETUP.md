# Production Deployment Configuration

## Environment Variables Required

```bash
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint

# Optional: Disable Sharp in production if it causes issues
DISABLE_SHARP=false
```

## Sharp Installation for Production

If you're getting Sharp-related errors in production, try these commands:

```bash
# Install Sharp with platform-specific dependencies
npm install --include=optional sharp

# For specific platform (if deploying to Linux)
npm install --os=linux --cpu=x64 sharp

# Alternative: Install Sharp with cross-platform support
npm install sharp --platform=linux --arch=x64
```

## Deployment Platform Specific Instructions

### Vercel
Sharp should work out of the box. If issues persist:
1. Add to `package.json` scripts:
   ```json
   {
     "postinstall": "npm install --include=optional sharp"
   }
   ```

### Railway/Heroku
Set buildpack to Node.js and ensure Sharp installs correctly:
1. Add to package.json:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### Docker
Add to your Dockerfile:
```dockerfile
# Install Sharp dependencies
RUN npm install --include=optional sharp
```

## Fallback Configuration

If Sharp continues to cause issues, you can disable image optimization by setting:
```bash
DISABLE_SHARP=true
```

This will upload images without optimization but ensures the upload functionality works.