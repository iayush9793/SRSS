import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

function getSupabaseClient() {
  // Only create client if it doesn't exist and env vars are available
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // During build time, env vars might not be available, so create a dummy client
    // This prevents build errors. Runtime errors will occur if env vars are missing when actually used.
    if (!supabaseUrl || !supabaseAnonKey) {
      // Return a mock client during build to prevent errors
      // This will fail at runtime if env vars are not set, which is the desired behavior
      if (typeof window === 'undefined') {
        // Server-side: create a client with placeholder values to prevent build errors
        supabaseClient = createClient(
          supabaseUrl || 'https://placeholder.supabase.co',
          supabaseAnonKey || 'placeholder-key'
        )
      } else {
        // Client-side: throw error if env vars are missing
        throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
      }
    } else {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    }
  }

  return supabaseClient
}

// Export a getter function that creates client lazily
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient()
    const value = client[prop]
    
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client)
    }
    
    return value
  }
})

