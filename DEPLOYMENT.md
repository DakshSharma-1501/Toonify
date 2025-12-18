# TOONIFY - Deployment Guide

## 🚀 Deploying to GitHub and Vercel

Follow these steps to deploy your TOONIFY application:

### Step 1: Initialize Git Repository

```bash
# Initialize git (already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: TOONIFY - Token-Oriented Notation Converter"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right → **New repository**
3. Name your repository: `toonify` (or any name you prefer)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **Create repository**

### Step 3: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/toonify.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click **Add New** → **Project**
4. Import your `toonify` repository from GitHub
5. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Click **Deploy**
7. Wait 2-3 minutes for deployment to complete
8. Your app will be live at: `https://toonify-YOUR_USERNAME.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? toonify
# - In which directory is your code located? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

### Step 5: Verify Deployment

1. Visit your Vercel deployment URL
2. Test all features:
   - JSON conversion
   - React conversion
   - Theme toggle
   - Copy functionality
   - Format selector

### Environment Variables (if needed)

TOONIFY doesn't require any environment variables since it's 100% frontend.

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch automatically deploys to production
- Pull requests create preview deployments
- Vercel provides deployment previews for each commit

### Troubleshooting

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**App works locally but not on Vercel:**
- Check browser console for errors
- Verify all imports use correct paths
- Ensure no environment-specific code

### Quick Commands Reference

```bash
# Add changes and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push

# Redeploy on Vercel (if using CLI)
vercel --prod
```

---

**Your app is now live! 🎉**

Share your TOONIFY deployment with others and start converting code to Token-Oriented Notation!
