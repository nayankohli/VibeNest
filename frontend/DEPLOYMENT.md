# VibeNest Frontend Deployment

This document provides instructions for deploying the VibeNest frontend to Render.com.

## Deployment Steps

1. **Build the Frontend**
   ```bash
   npm install
   npm run build
   ```
   This creates an optimized production build in the `build` folder.

2. **Deploy to Render.com**
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Use the following settings:
     - Name: vibenest
     - Environment: Static Site
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`
     - Auto-Deploy: Yes

3. **Configure Environment Variables**
   - `NODE_ENV`: production

4. **Set Up Redirect/Rewrite Rules**
   For single-page applications to work correctly with client-side routing:
   - Add a rewrite rule to redirect all routes to `index.html`

## API Configuration

The application is already configured to use the correct API URL based on the environment:
- Development: `http://localhost:5000`
- Production: `https://vibenest-api.onrender.com`

This is configured in `src/config/api-config.js`.

## Post-Deployment Verification

After deployment, verify that:
1. The frontend can connect to the backend API
2. User authentication works correctly
3. Images and media files are loading properly
4. All application features function as expected

## Troubleshooting

If you encounter CORS issues:
- Verify that the backend's `FRONTEND_URL` environment variable is set correctly
- Check that the backend CORS configuration is properly set up