# Supabase Setup Guide

## Prerequisites
- Node.js and npm installed
- A Supabase account (free tier available)

## Tailwind CSS v4 Configuration

This project uses **Tailwind CSS v4** (latest version). The configuration is already set up:

1. **CSS Import**: `src/index.css` contains only:
   ```css
   @import "tailwindcss";
   ```

2. **Config File**: `tailwind.config.js` is minimal:
   ```js
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   }
   ```

3. **No PostCSS**: Tailwind v4 doesn't require PostCSS configuration
4. **Vite Compatibility**: Using Vite v5.4.0 for compatibility

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Name: `HostConnect`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
4. Click "Create new project"
5. Wait for the project to be ready (usually takes 1-2 minutes)

## Step 2: Set up Database Tables

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the entire content from `supabase-schema.sql` 
3. Click "Run" to execute all the SQL commands
4. This will create:
   - Users table with proper relationships
   - Listings table with all required fields
   - Interactions table for messaging
   - Row Level Security (RLS) policies
   - Triggers for automatic user creation

## Step 3: Get API Keys

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon/Public Key**: `eyJ...` (long string)

## Step 4: Configure Environment Variables

Create a `.env` file in your project root with:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

Replace the placeholder values with your actual Supabase project URL and API key.

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. If you see "Missing Supabase environment variables" error, double-check your .env file

## Authentication Setup

The authentication is configured to:
- Use email/password authentication
- Require email verification for new users
- Automatically create user profiles when users sign up
- Support password reset functionality

## Database Schema

### Users Table
- `id`: UUID (references auth.users)
- `email`: User's email address
- `name`: User's display name
- `verified`: Boolean indicating email verification status
- `created_at`, `updated_at`: Timestamps

### Listings Table
- `id`: UUID (auto-generated)
- `user_id`: Reference to users table
- `title`: Listing title
- `description`: Detailed description
- `price`: Decimal price
- `location`: Location string
- `availability`: Boolean for listing status
- `created_at`, `updated_at`: Timestamps

### Interactions Table
- `id`: UUID (auto-generated)
- `user_id`: User sending the message
- `host_id`: Host receiving the message
- `message`: Message content
- `timestamp`: When message was sent
- `created_at`: Database timestamp

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own data
- Listings are publicly viewable when available
- Messages are only visible to involved parties
- Automatic user profile creation on signup

## Next Steps

After completing this setup, you can:
1. Start building the authentication pages
2. Create listing management functionality
3. Implement the messaging system
4. Test all features with the database

## Troubleshooting

### Common Issues:
1. **Environment variables not loading**: Restart your dev server after creating/modifying .env
2. **RLS blocking queries**: Check if user is authenticated before making database calls
3. **CORS errors**: Ensure your domain is added to Supabase allowed origins (usually automatic for localhost)

For more help, refer to the [Supabase Documentation](https://supabase.com/docs). 