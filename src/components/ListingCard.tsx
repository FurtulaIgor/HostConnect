import { Link } from 'react-router-dom'
import type { Listing } from '../lib/supabase'

interface ListingCardProps {
  listing: Listing
  showActions?: boolean
  onEdit?: (listing: Listing) => void
  onDelete?: (listing: Listing) => void
}

export default function ListingCard({ listing, showActions = false, onEdit, onDelete }: ListingCardProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/listing/${listing.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">{listing.title}</h3>
            </Link>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.location}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                <span className="text-sm text-gray-500 ml-1">/ night</span>
              </div>
              
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  listing.availability 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {listing.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-2">
              Created {formatDate(listing.created_at)}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
            <button
              onClick={() => onEdit?.(listing)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(listing)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 