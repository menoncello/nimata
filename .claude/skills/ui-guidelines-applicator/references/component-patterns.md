# Component Patterns Reference

## Button Patterns

### Basic Button Implementation

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Usage examples:
<Button variant="primary" size="md">Submit</Button>
<Button variant="secondary" size="sm">Cancel</Button>
```

### Button Variants

- **Primary**: Main call-to-action actions
- **Secondary**: Secondary actions and alternatives
- **Outline**: Low-emphasis actions

### Button Sizes

- **sm**: 32px height, 12px padding
- **md**: 40px height, 16px padding
- **lg**: 48px height, 20px padding

## Form Patterns

### Input Field Structure

```tsx
interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  disabled?: boolean;
}

// Implementation pattern:
<div className="form-field">
  <label className="form-label">{label}</label>
  <input
    type={type}
    className={`form-input ${error ? 'error' : ''}`}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
  />
  {error && <span className="form-error">{error}</span>}
  {helper && <span className="form-helper">{helper}</span>}
</div>;
```

### Validation States

- **Default**: Normal input appearance
- **Error**: Red border, error message below
- **Success**: Green border, optional success indicator
- **Disabled**: Gray background, reduced opacity

## Card Patterns

### Content Card Structure

```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

// Usage:
<Card title="Card Title" subtitle="Optional subtitle">
  <p>Card content goes here</p>
</Card>;
```

### Card Variants

- **Basic**: Simple content container
- **Elevated**: With shadow for emphasis
- **Bordered**: With visible border
- **Interactive**: Hover state for clickable cards

## Navigation Patterns

### Header Navigation Structure

```tsx
interface NavigationProps {
  logo: React.ReactNode;
  items: NavItem[];
  actions?: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}
```

### Breadcrumb Pattern

```tsx
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

// Usage:
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' },
  ]}
/>;
```

## Modal Patterns

### Modal Structure

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

### Modal Sizes

- **sm**: 400px max width
- **md**: 600px max width
- **lg**: 800px max width
- **xl**: 1200px max width

## Table Patterns

### Data Table Structure

```tsx
interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: PaginationProps;
}

interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}
```

### Table Features

- **Sorting**: Click column headers to sort
- **Filtering**: Search/filter inputs above table
- **Pagination**: Navigation for large datasets
- **Selection**: Row selection with checkboxes

## Loading Patterns

### Loading States

```tsx
// Skeleton loading
<div className="skeleton">
  <div className="skeleton-line"></div>
  <div className="skeleton-line short"></div>
</div>

// Spinner loading
<div className="spinner">
  <div className="spinner-circle"></div>
</div>

// Progress bar
<div className="progress-bar">
  <div className="progress-fill" style={{ width: '60%' }}></div>
</div>
```

### Loading Best Practices

- Use skeleton loading for content areas
- Use spinners for button actions
- Use progress bars for multi-step processes
- Show loading state within 100ms of action

## Alert/Notification Patterns

### Alert Types

```tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Alert Placement

- **Top-right**: Toast notifications (auto-dismiss)
- **Top-center**: Page-level alerts (persistent)
- **Inline**: Form or section-level alerts

## Responsive Patterns

### Mobile-First Implementation

```tsx
// Mobile styles first (default)
.component {
  padding: 16px;
  font-size: 14px;
}

// Tablet and up
@media (min-width: 768px) {
  .component {
    padding: 24px;
    font-size: 16px;
  }
}

// Desktop and up
@media (min-width: 1024px) {
  .component {
    padding: 32px;
    max-width: 1200px;
  }
}
```

### Breakpoint System

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large**: 1280px+

## Accessibility Patterns

### ARIA Implementation

```tsx
// Button with loading state
<button
  aria-busy={loading}
  aria-describedby={error ? 'error-message' : undefined}
  disabled={disabled}
>
  {loading ? 'Loading...' : children}
</button>

// Modal with proper focus management
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Modal Title</h2>
</div>
```

### Keyboard Navigation

- Tab order follows visual order
- All interactive elements reachable by keyboard
- Focus indicators clearly visible
- Skip links for main navigation
