import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import { getCurrentUser } from '../../lib/auth'
import { supabase } from '../../lib/supabase'

// Mock the auth and supabase modules
jest.mock('../../lib/auth')
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn()
    }
  }
}))

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockSignOut = supabase.auth.signOut as jest.MockedFunction<typeof supabase.auth.signOut>

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' })
}))

// Wrapper component for Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockGetCurrentUser.mockResolvedValue({ user: null, error: null })
    
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders unauthenticated state correctly', async () => {
    mockGetCurrentUser.mockResolvedValue({ user: null, error: null })
    
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('HostConnect')).toBeInTheDocument()
      expect(screen.getByText('🔑 Login')).toBeInTheDocument()
      expect(screen.getByText('🚀 Sign Up')).toBeInTheDocument()
    })
  })

  it('renders authenticated state correctly', async () => {
    const mockUser = { id: '123', email: 'test@example.com' } as any
    mockGetCurrentUser.mockResolvedValue({ user: mockUser, error: null })
    
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('HostConnect')).toBeInTheDocument()
      expect(screen.getByText('📊 Dashboard')).toBeInTheDocument()
      expect(screen.getByText('💬 Messages')).toBeInTheDocument()
      expect(screen.getByText('➕ Create Listing')).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
      expect(screen.getByText('🚪 Sign Out')).toBeInTheDocument()
    })
  })

  it('handles sign out correctly', async () => {
    const mockUser = { id: '123', email: 'test@example.com' } as any
    mockGetCurrentUser.mockResolvedValue({ user: mockUser, error: null })
    mockSignOut.mockResolvedValue({ error: null })
    
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('🚪 Sign Out')).toBeInTheDocument()
    })

    const signOutButton = screen.getByText('🚪 Sign Out')
    fireEvent.click(signOutButton)

    expect(mockSignOut).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('toggles mobile menu correctly', async () => {
    mockGetCurrentUser.mockResolvedValue({ user: null, error: null })
    
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /open main menu/i })).toBeInTheDocument()
    })

    const menuButton = screen.getByRole('button', { name: /open main menu/i })
    fireEvent.click(menuButton)

    // Check if mobile menu items appear
    await waitFor(() => {
      expect(screen.getByText('🏠 Home')).toBeInTheDocument()
    })
  })

  it('highlights active navigation links', async () => {
    mockGetCurrentUser.mockResolvedValue({ user: { id: '123', email: 'test@example.com' } as any, error: null })
    
    // Mock useLocation to return dashboard path
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useLocation: () => ({ pathname: '/dashboard' })
    }))
    
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    )

    await waitFor(() => {
      const dashboardLink = screen.getByText('📊 Dashboard')
      expect(dashboardLink).toBeInTheDocument()
      // Check if the active class is applied (bg-blue-600 text-white)
      expect(dashboardLink.closest('a')).toHaveClass('bg-blue-600', 'text-white')
    })
  })
}) 