# Deploying to Vercel

## Prerequisites
- A Vercel account
- Git repository with your code

## Steps to Deploy

### 1. Push to Git
Make sure all your changes are committed and pushed to your Git repository.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Vite project

### 3. Configure Build Settings
Vercel should automatically detect the correct settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Troubleshooting

### If you get build errors:
1. Make sure all TypeScript errors are fixed locally first
2. Run `npm run build` locally to test
3. Check that all dependencies are in `package.json`

### If the app doesn't work after deployment:
1. Check the Vercel function logs
2. Ensure the `vercel.json` file is in the root directory
3. Verify that the build output is in the `dist` folder

## Environment Variables
If you need to add environment variables later, you can do so in the Vercel dashboard under Project Settings > Environment Variables.

## Custom Domain
After deployment, you can add a custom domain in the Vercel dashboard under Project Settings > Domains. 