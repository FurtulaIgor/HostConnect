import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { getInteractions, createInteraction } from '../lib/database'
import Navbar from '../components/Navbar'
import type { Interaction } from '../lib/supabase'

export default function Conversation() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Interaction[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUserAndLoadMessages()
  }, [userId])

  const checkUserAndLoadMessages = async () => {
    const { user, error } = await getCurrentUser()
    if (error || !user) {
      navigate('/login')
      return
    }

    setUser(user)

    if (!userId) {
      navigate('/messages')
      return
    }

    loadMessages(user.id, userId)
  }

  const loadMessages = async (currentUserId: string, otherUserId: string) => {
    setLoading(true)
    const { data, error } = await getInteractions(currentUserId, otherUserId)
    
    if (!error && data) {
      setMessages(data)
    }
    
    setLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) {
      setError('Please enter a message')
      return
    }

    if (newMessage.length > 500) {
      setError('Message must be less than 500 characters')
      return
    }

    setSendingMessage(true)
    setError('')

    const messageData = {
      user_id: user.id,
      host_id: userId!,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    }

    const { data, error: messageError } = await createInteraction(messageData)

    if (messageError) {
      setError('Failed to send message. Please try again.')
    } else if (data) {
      setMessages([...messages, data])
      setNewMessage('')
    }

    setSendingMessage(false)
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Conversation</h2>
              <p className="text-gray-600">Chat with User {userId?.slice(0, 8)}...</p>
            </div>
            <Link
              to="/messages"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Back to Messages
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Messages */}
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No messages in this conversation yet.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.user_id === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.user_id === user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.user_id === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="border-t pt-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                      placeholder="Type your reply..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newMessage.length}/500 characters
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingMessage ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                      {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 