# TopBar Components Update

This document describes the new professional notification widget and user menu components that have been implemented for the TopBar.

## Overview

The TopBar has been enhanced with two new professional components:

1. **NotificationWidget** - A modern, feature-rich notification dropdown
2. **UserMenu** - A clean, professional user menu with avatar support

## Components

### 1. NotificationWidget

A comprehensive notification system with the following features:

#### Features
- ✅ Badge showing unread count (displays "99+" for counts over 99)
- ✅ Categorized notifications by type (info, success, warning, error, system)
- ✅ Color-coded notification items with appropriate icons
- ✅ Timestamp display using relative time ("5 minutes ago", etc.)
- ✅ Mark individual notifications as read
- ✅ Mark all notifications as read
- ✅ Clear all notifications
- ✅ Empty state when no notifications
- ✅ Scrollable list for many notifications
- ✅ Visual indicator for unread notifications
- ✅ Click handling with optional action URLs
- ✅ Avatar support for user-generated notifications

#### Props

```typescript
interface NotificationWidgetProperties {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  maxHeight?: string;
}
```

#### Notification Type

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "system";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  icon?: React.ReactNode;
}
```

### 2. UserMenu

A professional dropdown menu for user account actions.

#### Features
- ✅ Avatar with fallback initials
- ✅ User name and role display
- ✅ Profile link
- ✅ Settings link
- ✅ Logout with destructive styling
- ✅ Smooth animations
- ✅ Responsive design (hides text on mobile)

#### Props

```typescript
interface UserMenuProperties {
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  className?: string;
}
```

## Usage

### Updated TopBar Component

The TopBar component now accepts the following props:

```typescript
type TopBarProperties = {
  adminName: string;
  adminEmail?: string;
  adminAvatar?: string;
  adminRole?: string;
  notifications?: Notification[];
  className?: string;
};
```

### Basic Example

```tsx
import TopBar from "@/components/shared/top-bar";

export function MyLayout() {
  return (
    <TopBar
      adminName="John Doe"
      adminEmail="john@example.com"
      adminRole="Administrator"
      adminAvatar="/avatars/john.png"
      notifications={[
        {
          id: "1",
          title: "New message",
          message: "You have a new message from Sarah",
          type: "info",
          timestamp: new Date(),
          read: false,
        },
      ]}
    />
  );
}
```

### With No Notifications

```tsx
<TopBar
  adminName="Jane Smith"
  adminEmail="jane@example.com"
  notifications={[]}
/>
```

### Minimal Setup

```tsx
<TopBar adminName="Admin User" />
```

## Updating Existing Implementation

To update the existing admin layout, change from:

```tsx
<TopBar
  adminName={session?.user.employee.fullName || ""}
  notificationsCount={12}
  className="sticky top-0 z-[999] px-6 shadow"
/>
```

To:

```tsx
<TopBar
  adminName={session?.user.employee.fullName || ""}
  adminEmail={session?.user.email || ""}
  adminRole="Administrator" // or get from session
  adminAvatar={session?.user.image}
  notifications={notifications} // Get from your API/state
  className="sticky top-0 z-[999] px-6 shadow"
/>
```

## Notification Management

The TopBar internally manages notification state. When a user:

1. **Clicks a notification** - If an `actionUrl` is provided, the user is navigated to that URL
2. **Marks as read** - The notification's read state is updated
3. **Marks all as read** - All notifications are marked as read
4. **Clears all** - All notifications are removed from the list

## Styling

The components use:
- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling
- **shadcn/ui** design patterns
- **Dark mode** support built-in
- **Responsive** design

## File Structure

```
src/components/shared/
├── notification-widget/
│   ├── index.tsx              # Main NotificationWidget component
│   ├── notification-item.tsx   # Individual notification item
│   └── types.ts               # TypeScript types
├── user-menu/
│   └── index.tsx              # UserMenu component
└── top-bar/
    ├── index.tsx              # Updated TopBar component
    └── example-usage.tsx      # Usage examples
```

## Dependencies

All required dependencies are already installed:
- `@radix-ui/react-avatar`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-popover`
- `date-fns`
- `lucide-react`

## Design Features

### NotificationWidget
- Professional popover design with smooth animations
- Color-coded by notification type
- Unread indicator dot
- Relative timestamps
- Action buttons in header
- Empty state illustration
- Maximum height with scrolling
- "View all notifications" footer link

### UserMenu
- Clean dropdown design
- Avatar with fallback
- User info display
- Grouped menu items
- Destructive logout styling
- Keyboard accessible
- Focus management

## Accessibility

Both components are fully accessible:
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus management
- ✅ Semantic HTML

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

Possible future improvements:
- Real-time notifications via WebSocket/SSE
- Notification preferences
- Group notifications by date
- Notification sounds
- Browser notifications API integration
- Notification categories filter
- Search notifications
