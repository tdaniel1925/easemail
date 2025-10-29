"use client"

import { useNotificationStore } from "@/lib/stores/notification-store"
import { InlineAlert, InlineAlertTitle, InlineAlertDescription } from "@/components/ui/inline-alert"

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 space-y-2">
      {notifications.map((notification) => (
        <InlineAlert
          key={notification.id}
          variant={notification.type}
          onDismiss={() => removeNotification(notification.id)}
          className="animate-in slide-in-from-top-2"
        >
          {notification.title && <InlineAlertTitle>{notification.title}</InlineAlertTitle>}
          <InlineAlertDescription>{notification.message}</InlineAlertDescription>
        </InlineAlert>
      ))}
    </div>
  )
}


