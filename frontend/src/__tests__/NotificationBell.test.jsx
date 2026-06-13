import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NotificationBell from '../Components/NotificationBell'

vi.mock('../api/api', () => ({
  fetchNotifications: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  markNotificationRead: vi.fn(),
}))

import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../api/api'

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the bell button', async () => {
    fetchNotifications.mockResolvedValue([])
    render(<NotificationBell />)
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('shows no unread badge when there are no notifications', async () => {
    fetchNotifications.mockResolvedValue([])
    render(<NotificationBell />)
    await waitFor(() => {
      expect(screen.queryByText(/^\d+$/)).toBeNull()
    })
  })

  it('shows unread count badge when there are unread notifications', async () => {
    fetchNotifications.mockResolvedValue([
      { id: 1, title: 'New log', message: 'Your log was reviewed', is_read: false, created_at: new Date().toISOString() },
      { id: 2, title: 'Placement', message: 'Placement approved', is_read: true, created_at: new Date().toISOString() },
    ])
    render(<NotificationBell />)
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('opens notification dropdown when bell is clicked', async () => {
    fetchNotifications.mockResolvedValue([])
    render(<NotificationBell />)
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }))
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows "No notifications yet" when list is empty and open', async () => {
    fetchNotifications.mockResolvedValue([])
    render(<NotificationBell />)
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }))
    await waitFor(() => {
      expect(screen.getByText('No notifications yet.')).toBeInTheDocument()
    })
  })

  it('marks all notifications as read', async () => {
    fetchNotifications.mockResolvedValue([
      { id: 1, title: 'Test', message: 'Hello', is_read: false, created_at: new Date().toISOString() },
    ])
    markAllNotificationsRead.mockResolvedValue({})
    render(<NotificationBell />)
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }))
    await waitFor(() => {
      expect(screen.getByText('Mark all read')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Mark all read'))
    expect(markAllNotificationsRead).toHaveBeenCalledOnce()
  })
})