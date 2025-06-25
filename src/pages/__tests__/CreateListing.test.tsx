import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CreateListing from '../CreateListing'
import { getCurrentUser } from '../../lib/auth'
import { createListing } from '../../lib/database'

// Mock the dependencies
jest.mock('../../lib/auth')
jest.mock('../../lib/database')

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockCreateListing = createListing as jest.MockedFunction<typeof createListing>

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('CreateListing Form Validation', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' } as any

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue({ user: mockUser, error: null })
  })

  it('redirects to login if user is not authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue({ user: null, error: null })

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('renders form fields correctly for authenticated user', async () => {
    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/available for booking/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create listing/i })).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create listing/i })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /create listing/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(screen.getByText('Price is required')).toBeInTheDocument()
      expect(screen.getByText('Location is required')).toBeInTheDocument()
    })
  })

  it('validates minimum field lengths', async () => {
    const user = userEvent.setup()

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    })

    // Fill in fields with insufficient length
    await user.type(screen.getByLabelText(/title/i), 'Hi')
    await user.type(screen.getByLabelText(/description/i), 'Short')
    await user.type(screen.getByLabelText(/location/i), 'NY')
    await user.type(screen.getByLabelText(/price/i), '50')

    const submitButton = screen.getByRole('button', { name: /create listing/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 5 characters long')).toBeInTheDocument()
      expect(screen.getByText('Description must be at least 20 characters long')).toBeInTheDocument()
      expect(screen.getByText('Location must be at least 3 characters long')).toBeInTheDocument()
    })
  })

  it('validates price is a positive number', async () => {
    const user = userEvent.setup()

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/title/i), 'Valid Title')
    await user.type(screen.getByLabelText(/description/i), 'This is a valid description with enough characters')
    await user.type(screen.getByLabelText(/location/i), 'Valid Location')
    await user.type(screen.getByLabelText(/price/i), '-10')

    const submitButton = screen.getByRole('button', { name: /create listing/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Price must be a valid positive number')).toBeInTheDocument()
    })
  })

  it('successfully creates listing with valid data', async () => {
    const user = userEvent.setup()
    mockCreateListing.mockResolvedValue({ data: { id: 'listing123' } as any, error: null })

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    })

    // Fill in valid form data
    await user.type(screen.getByLabelText(/title/i), 'Beautiful Apartment')
    await user.type(screen.getByLabelText(/description/i), 'This is a beautiful apartment with all amenities')
    await user.type(screen.getByLabelText(/location/i), 'New York, NY')
    await user.type(screen.getByLabelText(/price/i), '150')

    const submitButton = screen.getByRole('button', { name: /create listing/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateListing).toHaveBeenCalledWith({
        user_id: 'user123',
        title: 'Beautiful Apartment',
        description: 'This is a beautiful apartment with all amenities',
        price: 150,
        location: 'New York, NY',
        availability: true
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard?created=true')
    })
  })

  it('displays error message when listing creation fails', async () => {
    const user = userEvent.setup()
    mockCreateListing.mockResolvedValue({ data: null, error: { message: 'Database error' } })

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    })

    // Fill in valid form data
    await user.type(screen.getByLabelText(/title/i), 'Beautiful Apartment')
    await user.type(screen.getByLabelText(/description/i), 'This is a beautiful apartment with all amenities')
    await user.type(screen.getByLabelText(/location/i), 'New York, NY')
    await user.type(screen.getByLabelText(/price/i), '150')

    const submitButton = screen.getByRole('button', { name: /create listing/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument()
    })
  })

  it('toggles availability checkbox correctly', async () => {
    const user = userEvent.setup()

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/available for booking/i)).toBeInTheDocument()
    })

    const checkbox = screen.getByLabelText(/available for booking/i) as HTMLInputElement
    expect(checkbox.checked).toBe(true)

    await user.click(checkbox)
    expect(checkbox.checked).toBe(false)

    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    // Mock a delayed response
    mockCreateListing.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { id: 'listing123' } as any, error: null }), 100))
    )

    render(
      <RouterWrapper>
        <CreateListing />
      </RouterWrapper>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    })

    // Fill in valid form data
    await user.type(screen.getByLabelText(/title/i), 'Beautiful Apartment')
    await user.type(screen.getByLabelText(/description/i), 'This is a beautiful apartment with all amenities')
    await user.type(screen.getByLabelText(/location/i), 'New York, NY')
    await user.type(screen.getByLabelText(/price/i), '150')

    const submitButton = screen.getByRole('button', { name: /create listing/i })
    await user.click(submitButton)

    // Check loading state
    expect(screen.getByText('Creating Listing...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Wait for completion
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard?created=true')
    })
  })
}) 