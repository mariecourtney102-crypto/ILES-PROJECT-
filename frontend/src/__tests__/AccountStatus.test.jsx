import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AccountStatus from '../Components/AccountStatus'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

describe('AccountStatus', () => {
  it('renders nothing when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null })
    const { container } = render(<AccountStatus />)
    expect(container.firstChild).toBeNull()
  })

  it('displays the user name when logged in', () => {
    useAuth.mockReturnValue({ user: { name: 'Alice', role: 'student' } })
    render(<AccountStatus />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('displays the role with first letter capitalized', () => {
    useAuth.mockReturnValue({ user: { name: 'Alice', role: 'student' } })
    render(<AccountStatus />)
    expect(screen.getByText('Student')).toBeInTheDocument()
  })

  it('falls back to full_name if name is not set', () => {
    useAuth.mockReturnValue({ user: { full_name: 'Bob Mukasa', role: 'supervisor' } })
    render(<AccountStatus />)
    expect(screen.getByText('Bob Mukasa')).toBeInTheDocument()
  })

  it('falls back to "User" if no name is provided', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' } })
    render(<AccountStatus />)
    expect(screen.getByText('User')).toBeInTheDocument()
  })
})