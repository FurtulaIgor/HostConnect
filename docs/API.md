# 📡 HostConnect API Documentation

## Overview

HostConnect uses Supabase as its backend service, providing a robust API layer for authentication, database operations, and real-time functionality. This document covers all API endpoints and their usage.

## Base Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🔐 Authentication API

### User Registration

```typescript
/**
 * Register a new user
 * @param email - User's email address
 * @param password - User's password (min 6 characters)
 * @param name - User's display name (optional)
 * @returns Promise<AuthResponse>
 */
export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || ''
      }
    }
  })
  
  if (error) throw error
  return data
}
```

**Usage Example:**
```typescript
try {
  const result = await signUp('user@example.com', 'password123', 'John Doe')
  console.log('Registration successful:', result.user)
} catch (error) {
  console.error('Registration failed:', error.message)
}
```

### User Login

```typescript
/**
 * Sign in existing user
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise<AuthResponse>
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}
```

### Password Reset

```typescript
/**
 * Send password reset email
 * @param email - User's email address
 * @returns Promise<void>
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) throw error
}
```

### Get Current User

```typescript
/**
 * Get currently authenticated user
 * @returns Promise<User | null>
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

### Sign Out

```typescript
/**
 * Sign out current user
 * @returns Promise<void>
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

## 🏠 Listings API

### Data Types

```typescript
interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  location: string
  availability: boolean
  created_at: string
  updated_at: string
}

interface CreateListingData {
  title: string
  description: string
  price: number
  location: string
  availability?: boolean
}
```

### Create Listing

```typescript
/**
 * Create a new listing
 * @param listing - Listing data
 * @returns Promise<Listing>
 */
export async function createListing(listing: CreateListingData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('listings')
    .insert([{
      ...listing,
      user_id: user.id
    }])
    .select()
    .single()

  if (error) throw error
  return data
}
```

**Usage Example:**
```typescript
const newListing = await createListing({
  title: 'Cozy Downtown Apartment',
  description: 'Beautiful 2-bedroom apartment in the heart of the city',
  price: 120,
  location: 'New York, NY',
  availability: true
})
```

### Get Listings

```typescript
/**
 * Get listings (all or user-specific)
 * @param userId - Optional user ID to filter by
 * @returns Promise<Listing[]>
 */
export async function getListings(userId?: string) {
  let query = supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}
```

### Get Listing by ID

```typescript
/**
 * Get a specific listing by ID
 * @param id - Listing ID
 * @returns Promise<Listing | null>
 */
export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw error
  }
  
  return data
}
```

### Update Listing

```typescript
/**
 * Update an existing listing
 * @param id - Listing ID
 * @param updates - Partial listing data to update
 * @returns Promise<Listing>
 */
export async function updateListing(id: string, updates: Partial<CreateListingData>) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns the listing
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Delete Listing

```typescript
/**
 * Delete a listing
 * @param id - Listing ID
 * @returns Promise<void>
 */
export async function deleteListing(id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns the listing

  if (error) throw error
}
```

## 💬 Messaging API

### Data Types

```typescript
interface Interaction {
  id: string
  user_id: string
  host_id: string
  message: string
  timestamp: string
}

interface CreateInteractionData {
  host_id: string
  message: string
}
```

### Send Message

```typescript
/**
 * Create a new message/interaction
 * @param interaction - Message data
 * @returns Promise<Interaction>
 */
export async function createInteraction(interaction: CreateInteractionData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be authenticated')
  }

  if (user.id === interaction.host_id) {
    throw new Error('Cannot send message to yourself')
  }

  const { data, error } = await supabase
    .from('interactions')
    .insert([{
      ...interaction,
      user_id: user.id
    }])
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Get Messages/Conversations

```typescript
/**
 * Get interactions/messages
 * @param userId - Current user ID
 * @param hostId - Optional host ID to filter conversation
 * @returns Promise<Interaction[]>
 */
export async function getInteractions(userId: string, hostId?: string) {
  let query = supabase
    .from('interactions')
    .select('*')
    .or(`user_id.eq.${userId},host_id.eq.${userId}`)
    .order('timestamp', { ascending: true })

  if (hostId) {
    query = query.or(`and(user_id.eq.${userId},host_id.eq.${hostId}),and(user_id.eq.${hostId},host_id.eq.${userId})`)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}
```

## 🔒 Row Level Security (RLS) Policies

### Users Table
```sql
-- Users can only read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Listings Table
```sql
-- Anyone can view available listings
CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (availability = true OR auth.uid() = user_id);

-- Only authenticated users can create listings
CREATE POLICY "Authenticated users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own listings
CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own listings
CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);
```

### Interactions Table
```sql
-- Users can view messages they sent or received
CREATE POLICY "Users can view own interactions" ON interactions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = host_id);

-- Users can create interactions
CREATE POLICY "Users can create interactions" ON interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🚨 Error Handling

### Common Error Codes

```typescript
// Authentication errors
'invalid_credentials' // Wrong email/password
'email_not_confirmed' // Email not verified
'signup_disabled' // Registration disabled
'too_many_requests' // Rate limited

// Database errors
'PGRST116' // Row not found
'23505' // Unique constraint violation
'42501' // Insufficient permissions
```

### Error Handling Pattern

```typescript
export async function apiCall() {
  try {
    const result = await someSupabaseOperation()
    return { data: result, error: null }
  } catch (error) {
    console.error('API Error:', error)
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        details: error.details
      }
    }
  }
}
```

## 🔄 Real-time Subscriptions

### Listen to Listing Changes

```typescript
/**
 * Subscribe to listing changes
 * @param callback - Function to call when data changes
 * @returns Subscription object
 */
export function subscribeToListings(callback: (payload: any) => void) {
  return supabase
    .channel('listings-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'listings' 
      }, 
      callback
    )
    .subscribe()
}
```

### Listen to Messages

```typescript
/**
 * Subscribe to new messages
 * @param userId - Current user ID
 * @param callback - Function to call when new message arrives
 * @returns Subscription object
 */
export function subscribeToMessages(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('messages-changes')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'interactions',
        filter: `host_id=eq.${userId}`
      }, 
      callback
    )
    .subscribe()
}
```

## 📊 Rate Limiting

Supabase has built-in rate limiting:
- **Authentication**: 30 requests per hour per IP
- **Database**: 100 requests per second per project
- **Real-time**: 200 concurrent connections

## 🔧 Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Server-side only
```

## 🧪 Testing API Calls

```typescript
// Mock Supabase for testing
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
      signOut: jest.fn()
    },
    from: () => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis()
    })
  })
}))
```

## 📈 Performance Tips

1. **Use select() wisely** - Only fetch needed columns
2. **Implement pagination** - Use `range()` for large datasets
3. **Cache frequently accessed data** - Use React Query or SWR
4. **Batch operations** - Combine multiple inserts when possible
5. **Use indexes** - Ensure database has proper indexes

## 🔍 Debugging

```typescript
// Enable debug mode
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    debug: true // Enable auth debugging
  }
})

// Log all database queries
supabase.from('listings').select('*').then(console.log)
```

---

**Need help?** Check our [Troubleshooting Guide](../README.md#troubleshooting) or contact support!
