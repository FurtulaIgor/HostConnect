import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { user } = await getCurrentUser()
    setUser(user)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
    const activeClass = "bg-blue-600 text-white"
    const inactiveClass = "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`
  }

  const mobileNavLinkClass = (path: string) => {
    const baseClass = "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
    const activeClass = "bg-blue-600 text-white"
    const inactiveClass = "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HostConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={navLinkClass('/')}>
              🏠 Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  📊 Dashboard
                </Link>
                <Link to="/messages" className={navLinkClass('/messages')}>
                  💬 Messages
                </Link>
                <Link to="/create-listing" className={navLinkClass('/create-listing')}>
                  ➕ Create Listing
                </Link>
                
                {/* User Menu */}
                <div className="ml-4 flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 max-w-32 truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className={navLinkClass('/login')}>
                  🔑 Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  🚀 Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link 
              to="/" 
              className={mobileNavLinkClass('/')}
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={mobileNavLinkClass('/dashboard')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/messages" 
                  className={mobileNavLinkClass('/messages')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  💬 Messages
                </Link>
                <Link 
                  to="/create-listing" 
                  className={mobileNavLinkClass('/create-listing')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ➕ Create Listing
                </Link>
                
                {/* Mobile User Info */}
                <div className="px-3 py-2 border-t border-gray-200 mt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Signed in as</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link 
                  to="/login" 
                  className={mobileNavLinkClass('/login')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block mx-3 my-2 px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🚀 Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 