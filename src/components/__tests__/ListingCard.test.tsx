import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ListingCard from '../ListingCard'
import type { Listing } from '../../lib/supabase'

const mockListing: Listing = {
  id: '123',
  user_id: 'user123',
  title: 'Test Listing',
  description: 'A beautiful test listing',
  price: 100,
  location: 'Test City',
  availability: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('ListingCard Component', () => {
  it('renders listing information correctly', () => {
    render(
      <RouterWrapper>
        <ListingCard listing={mockListing} showActions={false} />
      </RouterWrapper>
    )

    expect(screen.getByText('Test Listing')).toBeInTheDocument()
    expect(screen.getByText('A beautiful test listing')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('Test City')).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('shows unavailable status when listing is not available', () => {
    const unavailableListing = { ...mockListing, availability: false }
    
    render(
      <RouterWrapper>
        <ListingCard listing={unavailableListing} showActions={false} />
      </RouterWrapper>
    )

    expect(screen.getByText('Not Available')).toBeInTheDocument()
  })

  it('renders action buttons when showActions is true', () => {
    const mockOnEdit = jest.fn()
    const mockOnDelete = jest.fn()

    render(
      <RouterWrapper>
        <ListingCard 
          listing={mockListing} 
          showActions={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </RouterWrapper>
    )

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('does not render action buttons when showActions is false', () => {
    render(
      <RouterWrapper>
        <ListingCard listing={mockListing} showActions={false} />
      </RouterWrapper>
    )

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    const mockOnDelete = jest.fn()

    render(
      <RouterWrapper>
        <ListingCard 
          listing={mockListing} 
          showActions={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </RouterWrapper>
    )

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockListing)
  })

  it('calls onDelete when delete button is clicked', () => {
    const mockOnEdit = jest.fn()
    const mockOnDelete = jest.fn()

    render(
      <RouterWrapper>
        <ListingCard 
          listing={mockListing} 
          showActions={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </RouterWrapper>
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockListing)
  })

  it('makes title clickable as a link to listing details', () => {
    render(
      <RouterWrapper>
        <ListingCard listing={mockListing} showActions={false} />
      </RouterWrapper>
    )

    const titleLink = screen.getByRole('link', { name: 'Test Listing' })
    expect(titleLink).toHaveAttribute('href', '/listing/123')
  })

  it('truncates long descriptions properly', () => {
    const longDescriptionListing = {
      ...mockListing,
      description: 'This is a very long description that should be truncated because it exceeds the maximum length that we want to display in the card component for better user experience and layout consistency'
    }

    render(
      <RouterWrapper>
        <ListingCard listing={longDescriptionListing} showActions={false} />
      </RouterWrapper>
    )

    const description = screen.getByText(/This is a very long description/)
    expect(description.textContent).toContain('...')
  })

  it('formats price correctly', () => {
    const expensiveListing = { ...mockListing, price: 1234.56 }
    
    render(
      <RouterWrapper>
        <ListingCard listing={expensiveListing} showActions={false} />
      </RouterWrapper>
    )

    expect(screen.getByText('$1,235')).toBeInTheDocument()
  })

  it('displays creation date', () => {
    render(
      <RouterWrapper>
        <ListingCard listing={mockListing} showActions={false} />
      </RouterWrapper>
    )

    expect(screen.getByText(/Created:/)).toBeInTheDocument()
  })
}) 