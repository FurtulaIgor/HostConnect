import { supabase } from './supabase'
import type { User } from './supabase'

export interface AuthError {
  message: string
}

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

// Sign up new user
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: { message: error.message } }
  }
}

// Sign in user
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: { message: error.message } }
  }
}

// Sign out user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: { message: error.message } }
  }
}

// Reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Update password
export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user ?? null)
  })
} 