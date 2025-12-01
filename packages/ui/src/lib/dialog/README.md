# Alert Modal Component

A flexible and reusable alert modal component that supports multiple types: success, error, warning, and info.

## Features

- **Multiple Types**: Success, Error, Warning, and Info with appropriate icons and colors
- **Customizable**: Configurable titles, descriptions, and button text
- **Auto-close**: Optional automatic closing with configurable delay
- **Loading States**: Support for loading states during async operations
- **Responsive**: Works well on all screen sizes
- **Accessible**: Built with accessibility in mind

## Usage

### Basic Usage

```tsx
import { AlertModal, AlertType } from "@/components/shared/dialog/alert-modal";
import { useState } from "react";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Show Success Modal</button>

      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type="success"
        title="Success!"
        description="Your action has been completed successfully."
        confirmText="Great!"
        showCancelButton={false}
      />
    </div>
  );
}
```

### With Confirmation Action

```tsx
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Your async operation here
      await someAsyncOperation();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={handleConfirm}
      loading={loading}
      type="warning"
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}
```

### Auto-close Modal

```tsx
<AlertModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  type="success"
  title="Success!"
  description="This modal will close automatically in 3 seconds."
  confirmText="OK"
  showCancelButton={false}
  autoClose={true}
  autoCloseDelay={3000}
/>
```

## Props

| Prop               | Type         | Default      | Description                                          |
| ------------------ | ------------ | ------------ | ---------------------------------------------------- |
| `isOpen`           | `boolean`    | -            | Controls whether the modal is open                   |
| `onClose`          | `() => void` | -            | Callback when modal is closed                        |
| `onConfirm`        | `() => void` | -            | Optional callback when confirm button is clicked     |
| `loading`          | `boolean`    | `false`      | Shows loading state on confirm button                |
| `type`             | `AlertType`  | -            | Type of alert: "success", "error", "warning", "info" |
| `title`            | `string`     | -            | Modal title                                          |
| `description`      | `string`     | -            | Modal description                                    |
| `confirmText`      | `string`     | `"Continue"` | Text for confirm button                              |
| `cancelText`       | `string`     | `"Cancel"`   | Text for cancel button                               |
| `showCancelButton` | `boolean`    | `true`       | Whether to show cancel button                        |
| `autoClose`        | `boolean`    | `false`      | Whether to auto-close the modal                      |
| `autoCloseDelay`   | `number`     | `3000`       | Delay in milliseconds before auto-closing            |

## Alert Types

### Success

- **Icon**: CheckCircle
- **Colors**: Green theme
- **Use case**: Confirming successful actions

### Error

- **Icon**: XCircle
- **Colors**: Red theme
- **Use case**: Displaying error messages

### Warning

- **Icon**: AlertTriangle
- **Colors**: Yellow theme
- **Use case**: Confirming destructive actions

### Info

- **Icon**: Info
- **Colors**: Blue theme
- **Use case**: Displaying informational messages

## Examples

Interactive examples are included in the code snippets above and in the component source files.

## Accessibility

The modal is built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Styling

The modal uses Tailwind CSS classes and follows the design system. Colors and styling are automatically applied based on the alert type.
