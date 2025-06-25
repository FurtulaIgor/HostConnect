import { supabase } from './supabase'
import type { Listing, Interaction } from './supabase'

// Listings operations
export const createListing = async (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export const getListings = async (userId?: string) => {
  try {
    let query = supabase.from('listings').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('availability', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export const getListingById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export const updateListing = async (id: string, updates: Partial<Listing>) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export const deleteListing = async (id: string) => {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Interactions operations
export const createInteraction = async (interaction: Omit<Interaction, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .insert([interaction])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export const getInteractions = async (userId: string, hostId?: string) => {
  try {
    let query = supabase.from('interactions').select('*')
    
    if (hostId) {
      query = query.or(`and(user_id.eq.${userId},host_id.eq.${hostId}),and(user_id.eq.${hostId},host_id.eq.${userId})`)
    } else {
      query = query.or(`user_id.eq.${userId},host_id.eq.${userId}`)
    }

    const { data, error } = await query.order('timestamp', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

// User operations
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export const updateUserProfile = async (userId: string, updates: { name?: string; verified?: boolean }) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
} 