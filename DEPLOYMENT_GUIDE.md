# HostConnect Deployment Guide

## 🚀 Production Deployment Setup

### Prerequisites
- Node.js 18+ installed
- Supabase project configured
- Git repository
- Domain name (optional)

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env` file with your production Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Build Optimization
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### 3. Database Setup
Ensure your Supabase database has:
- [x] Users table with RLS enabled
- [x] Listings table with RLS enabled  
- [x] Interactions table with RLS enabled
- [x] Proper foreign key relationships
- [x] Row-level security policies configured

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended)

#### Setup Steps:
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

3. **Domain Configuration**
   - Add custom domain in Vercel dashboard
   - Configure DNS records

#### Vercel Configuration (`vercel.json`):
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Option 2: Netlify

#### Setup Steps:
1. **Connect Repository**
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials

#### Netlify Configuration (`netlify.toml`):
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

#### Setup Steps:
1. **Create GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **Configure Repository Secrets**
   - Go to Repository → Settings → Secrets and variables → Actions
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

## 🔧 Production Optimizations

### 1. Performance Optimizations
```typescript
// vite.config.ts optimizations
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Error Logging Setup
Consider integrating error tracking:
- Sentry
- LogRocket
- Bugsnag

### 3. Analytics Setup
Add analytics tracking:
- Google Analytics
- Plausible
- Mixpanel

## 🔒 Security Configuration

### 1. Supabase Security
- [x] Row-level security enabled
- [x] API keys properly configured
- [x] CORS settings configured
- [x] Rate limiting enabled

### 2. Environment Security
- [x] Environment variables not committed to git
- [x] Sensitive data encrypted
- [x] HTTPS enforced
- [x] Security headers configured

## 📊 Monitoring and Maintenance

### 1. Health Checks
Monitor these endpoints:
- `/` - Home page loads
- `/login` - Authentication works
- `/dashboard` - Protected routes accessible
- API connectivity to Supabase

### 2. Performance Monitoring
Track these metrics:
- Page load times
- API response times
- Error rates
- User engagement

### 3. Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor security vulnerabilities
- [ ] Backup database regularly
- [ ] Review logs weekly

## 🚨 Troubleshooting

### Common Issues:

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### Environment Variable Issues
```bash
# Verify variables are loaded
echo $VITE_SUPABASE_URL

# Check build output includes variables
npm run build -- --debug
```

#### Supabase Connection Issues
- Verify URL and API key are correct
- Check network connectivity
- Verify RLS policies allow access
- Check browser console for CORS errors

## 📈 Post-Deployment Testing

### Automated Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] CRUD operations function
- [ ] Messaging system operational
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Performance is acceptable

## 🎯 Success Metrics

### Technical Metrics
- [ ] Page load time < 3 seconds
- [ ] 99%+ uptime
- [ ] Zero critical security vulnerabilities
- [ ] All tests passing

### User Experience Metrics
- [ ] User registration flow completion > 80%
- [ ] Listing creation success rate > 95%
- [ ] Message delivery success rate > 99%
- [ ] Mobile usability score > 85%

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check Supabase status and logs
4. Verify environment configuration

**Deployment Status:** ✅ Ready for Production

*Last Updated: [Date]* 