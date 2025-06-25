import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/auth'
import { getInteractions } from '../lib/database'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import type { Interaction } from '../lib/supabase'

interface GroupedMessage {
  userId: string
  userEmail: string
  messages: Interaction[]
  lastMessage: Interaction
}

export default function Messages() {
  const [user, setUser] = useState<any>(null)
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUserAndLoadMessages()
  }, [])

  const checkUserAndLoadMessages = async () => {
    const { user, error } = await getCurrentUser()
    if (error || !user) {
      navigate('/login')
    } else {
      setUser(user)
      loadMessages(user.id)
    }
  }

  const loadMessages = async (userId: string) => {
    setLoading(true)
    const { data, error } = await getInteractions(userId)
    
    if (!error && data) {
      // Group messages by user
      const grouped = groupMessagesByUser(data, userId)
      setGroupedMessages(grouped)
    }
    
    setLoading(false)
  }

  const groupMessagesByUser = (messages: Interaction[], currentUserId: string): GroupedMessage[] => {
    const groups: { [key: string]: GroupedMessage } = {}

    messages.forEach(message => {
      // Determine the other user (not the current user)
      const otherUserId = message.user_id === currentUserId ? message.host_id : message.user_id
      
      if (!groups[otherUserId]) {
        groups[otherUserId] = {
          userId: otherUserId,
          userEmail: `User ${otherUserId.slice(0, 8)}...`, // We'll need to fetch user details separately
          messages: [],
          lastMessage: message
        }
      }
      
      groups[otherUserId].messages.push(message)
      
      // Update last message if this one is newer
      if (new Date(message.timestamp) > new Date(groups[otherUserId].lastMessage.timestamp)) {
        groups[otherUserId].lastMessage = message
      }
    })

    // Convert to array and sort by last message timestamp
    return Object.values(groups).sort((a, b) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    )
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', {
        weekday: 'short'
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const truncateMessage = (message: string, maxLength: number = 60) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
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
              <h2 className="text-2xl font-bold text-gray-900">Your Messages</h2>
              <p className="text-gray-600">Conversations with guests and hosts</p>
            </div>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {groupedMessages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4L3 20l4-3a8.014 8.014 0 01-1-4c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                When users contact you about your listings, conversations will appear here.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {groupedMessages.map((conversation) => (
                  <li key={conversation.userId}>
                    <Link to={`/conversation/${conversation.userId}`}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {conversation.userEmail.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {conversation.userEmail}
                              </p>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="mt-1">
                              <p className="text-sm text-gray-600">
                                {truncateMessage(conversation.lastMessage.message)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              conversation.lastMessage.user_id === user?.id
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {conversation.lastMessage.user_id === user?.id ? 'You replied' : 'New message'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Message Preview */}
                      <div className="mt-4">
                        <div className="text-sm text-gray-500">
                          Recent conversation:
                        </div>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                          {conversation.messages.slice(-3).map((message) => (
                            <div
                              key={message.id}
                              className={`text-sm p-2 rounded ${
                                message.user_id === user?.id
                                  ? 'bg-blue-50 text-blue-900 ml-8'
                                  : 'bg-gray-50 text-gray-900 mr-8'
                              }`}
                            >
                              <p>{message.message}</p>
                              <p className="text-xs opacity-75 mt-1">
                                {formatMessageTime(message.timestamp)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 