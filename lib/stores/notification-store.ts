import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification = { ...notification, id }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))
    
    // Auto-dismiss if duration is set
    if (notification.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, notification.duration)
    }
  },
  
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  
  clearAll: () => set({ notifications: [] }),
}))

// Helper functions for easier usage
export const showSuccess = (message: string, title?: string, duration = 5000) => {
  useNotificationStore.getState().addNotification({
    type: 'success',
    title,
    message,
    duration,
  })
}

export const showError = (message: string, title?: string, duration = 7000) => {
  useNotificationStore.getState().addNotification({
    type: 'error',
    title,
    message,
    duration,
  })
}

export const showWarning = (message: string, title?: string, duration = 6000) => {
  useNotificationStore.getState().addNotification({
    type: 'warning',
    title,
    message,
    duration,
  })
}

export const showInfo = (message: string, title?: string, duration = 5000) => {
  useNotificationStore.getState().addNotification({
    type: 'info',
    title,
    message,
    duration,
  })
}


