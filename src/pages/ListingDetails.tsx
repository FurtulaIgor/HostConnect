import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getListingById, getInteractions, createInteraction } from '../lib/database'
import { getCurrentUser } from '../lib/auth'
import Navbar from '../components/Navbar'
import type { Listing, Interaction } from '../lib/supabase'

export default function ListingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Listing | null>(null)
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Interaction[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadListingAndMessages()
  }, [id])

  const loadListingAndMessages = async () => {
    if (!id) {
      navigate('/')
      return
    }

    setLoading(true)

    // Get current user
    const { user: currentUser } = await getCurrentUser()
    setUser(currentUser)

    // Get listing details
    const { data: listingData, error: listingError } = await getListingById(id)
    if (listingError || !listingData) {
      setError('Listing not found')
      setLoading(false)
      return
    }
    setListing(listingData)

    // Get messages if user is logged in
    if (currentUser) {
      const { data: messagesData } = await getInteractions(currentUser.id, listingData.user_id)
      if (messagesData) {
        setMessages(messagesData)
      }
    }

    setLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      navigate('/login')
      return
    }

    if (!newMessage.trim()) {
      setError('Please enter a message')
      return
    }

    if (newMessage.length > 500) {
      setError('Message must be less than 500 characters')
      return
    }

    if (user.id === listing?.user_id) {
      setError('You cannot send messages to yourself')
      return
    }

    setSendingMessage(true)
    setError('')

    const messageData = {
      user_id: user.id,
      host_id: listing!.user_id,
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  if (error && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Listing not found</h3>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
              ← Back to Listings
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listing Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing?.title}</h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {listing?.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{listing && formatPrice(listing.price)}</div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      listing?.availability 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {listing?.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{listing?.description}</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Listed on {listing && formatDate(listing.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messaging Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Host</h3>
                  
                  {!user ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Please log in to contact the host</p>
                      <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Login
                      </Link>
                    </div>
                  ) : user.id === listing?.user_id ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">This is your own listing</p>
                    </div>
                  ) : (
                    <>
                      {/* Messages History */}
                      {messages.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Previous Messages</h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`p-3 rounded-lg ${
                                  message.user_id === user.id
                                    ? 'bg-blue-100 ml-4'
                                    : 'bg-gray-100 mr-4'
                                }`}
                              >
                                <p className="text-sm text-gray-800">{message.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatMessageTime(message.timestamp)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Send Message Form */}
                      <form onSubmit={handleSendMessage} className="space-y-4">
                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Send a message
                          </label>
                          <textarea
                            id="message"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Ask about availability, amenities, or anything else..."
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {newMessage.length}/500 characters
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={sendingMessage || !newMessage.trim()}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingMessage ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : null}
                          {sendingMessage ? 'Sending...' : 'Send Message'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 