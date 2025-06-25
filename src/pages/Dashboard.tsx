import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/auth'
import { getListings, deleteListing } from '../lib/database'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import Navbar from '../components/Navbar'
import type { Listing } from '../lib/supabase'

export default function Dashboard() {
  const [, setUser] = useState<any>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const showCreatedMessage = searchParams.get('created') === 'true'
  const showUpdatedMessage = searchParams.get('updated') === 'true'

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { user, error } = await getCurrentUser()
    if (error || !user) {
      navigate('/login')
    } else {
      setUser(user)
      loadUserListings(user.id)
    }
  }

  const loadUserListings = async (userId: string) => {
    setLoading(true)
    const { data, error } = await getListings(userId)
    if (!error && data) {
      setListings(data)
    }
    setLoading(false)
  }



  const handleEditListing = (listing: Listing) => {
    navigate(`/edit-listing/${listing.id}`)
  }

  const handleDeleteListing = async (listing: Listing) => {
    if (!confirm(`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(listing.id)
    const { error } = await deleteListing(listing.id)
    
    if (!error) {
      // Remove from local state
      setListings(listings.filter(l => l.id !== listing.id))
    } else {
      alert('Failed to delete listing. Please try again.')
    }
    
    setDeleteLoading(null)
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
      {/* Success Messages */}
      {(showCreatedMessage || showUpdatedMessage) && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">
                {showCreatedMessage ? 'Listing created successfully!' : 'Listing updated successfully!'}
              </span>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
              <p className="text-gray-600">Manage your accommodation listings</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/messages"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              >
                📨 View Messages
              </Link>
              <Link
                to="/create-listing"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              >
                + Create New Listing
              </Link>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2h12a2 2 0 012 2v2M7 16h6v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first accommodation listing.
              </p>
              <div className="mt-6">
                <Link
                  to="/create-listing"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Create New Listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="relative">
                  {deleteLoading === listing.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  )}
                  <ListingCard
                    listing={listing}
                    showActions={true}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteListing}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 