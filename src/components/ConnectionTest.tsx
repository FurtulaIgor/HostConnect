import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Simple test to see if Supabase is configured
      const { error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        setError(error.message)
        setStatus('error')
      } else {
        setStatus('connected')
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error')
      setStatus('error')
    }
  }

  const envStatus = {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    url: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
    keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm text-xs">
      <h3 className="font-bold mb-2">🔧 Supabase Connection Status</h3>
      
      <div className="space-y-1">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${envStatus.hasUrl ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>URL: {envStatus.hasUrl ? '✓' : '✗'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${envStatus.hasKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Key: {envStatus.hasKey ? `✓ (${envStatus.keyLength} chars)` : '✗'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${
            status === 'connected' ? 'bg-green-500' : 
            status === 'error' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}></span>
          <span>DB: {status === 'loading' ? 'Testing...' : status}</span>
        </div>
      </div>

      {status === 'error' && (
        <div className="mt-2 p-2 bg-red-50 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!envStatus.hasUrl && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-yellow-700">
          <strong>Missing .env file!</strong> Create .env with your Supabase credentials.
        </div>
      )}
    </div>
  )
} 