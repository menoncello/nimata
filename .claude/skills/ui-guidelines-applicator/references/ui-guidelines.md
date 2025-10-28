# UI Guidelines Reference

## Design Principles

### 1. Consistency

- Use consistent spacing, colors, and typography across all components
- Follow established patterns for similar interactions
- Maintain visual hierarchy throughout the application

### 2. Accessibility

- Ensure WCAG 2.1 AA compliance
- Provide proper color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Include proper ARIA labels and semantic HTML
- Support keyboard navigation

### 3. Responsive Design

- Mobile-first approach
- Fluid layouts that adapt to different screen sizes
- Touch-friendly interaction targets (minimum 44px)

## Color System

### Primary Colors

- **Primary Blue**: #0066CC (RGB: 0, 102, 204)
- **Primary Dark**: #004499 (RGB: 0, 68, 153)
- **Primary Light**: #E6F2FF (RGB: 230, 242, 255)

### Secondary Colors

- **Secondary Green**: #28A745 (RGB: 40, 167, 69)
- **Secondary Orange**: #FD7E14 (RGB: 253, 126, 20)
- **Secondary Red**: #DC3545 (RGB: 220, 53, 69)

### Neutral Colors

- **Gray 900**: #212529 (text primary)
- **Gray 700**: #495057 (text secondary)
- **Gray 500**: #6C757D (text disabled)
- **Gray 300**: #DEE2E6 (borders)
- **Gray 100**: #F8F9FA (backgrounds)
- **White**: #FFFFFF

### Usage Guidelines

- Primary blue for main CTAs and key interactions
- Secondary colors for status indicators and accents
- Neutral colors for text, borders, and backgrounds
- Maintain sufficient contrast ratios for accessibility

## Typography

### Font Stack

- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Monospace**: JetBrains Mono, Consolas, monospace

### Font Sizes

- **Display**: 48px / 48px weight 700
- **H1**: 36px / 44px weight 700
- **H2**: 28px / 36px weight 600
- **H3**: 22px / 30px weight 600
- **H4**: 18px / 26px weight 600
- **Body Large**: 16px / 24px weight 400
- **Body**: 14px / 20px weight 400
- **Body Small**: 12px / 16px weight 400
- **Caption**: 11px / 14px weight 400

### Typography Guidelines

- Use semantic HTML tags (h1, h2, p, etc.)
- Limit font weights to 400, 600, and 700
- Maintain proper line height for readability
- Use letter spacing sparingly for headings only

## Spacing System

### Scale

Use 4px base unit with multipliers:

- **2xs**: 4px
- **xs**: 8px
- **sm**: 12px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Usage Patterns

- **Component padding**: sm to md
- **Section spacing**: lg to xl
- **Margin between elements**: xs to sm
- **Layout gutters**: md to lg

## Component Patterns

### Buttons

#### Primary Button

- Background: Primary Blue (#0066CC)
- Text: White
- Border: None
- Padding: 12px 24px
- Border radius: 6px
- Font weight: 600
- Hover: Primary Dark (#004499)

#### Secondary Button

- Background: Transparent
- Text: Primary Blue (#0066CC)
- Border: 1px solid Primary Blue
- Padding: 11px 23px (account for border)
- Border radius: 6px
- Font weight: 600
- Hover: Primary Light (#E6F2FF)

### Form Elements

#### Input Fields

- Border: 1px solid Gray 300 (#DEE2E6)
- Border radius: 6px
- Padding: 12px 16px
- Font size: 14px
- Focus: Primary Blue border, shadow 0 0 0 3px rgba(0, 102, 204, 0.1)

#### Labels

- Font size: 14px
- Font weight: 600
- Color: Gray 900 (#212529)
- Margin bottom: 4px

### Cards

- Background: White
- Border: 1px solid Gray 300 (#DEE2E6)
- Border radius: 8px
- Padding: 24px
- Box shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

## Iconography

### Icon Sizing

- **Small**: 16px
- **Medium**: 20px
- **Large**: 24px

### Usage Guidelines

- Use icons for clear, universally understood actions
- Maintain consistent stroke width (2px)
- Use semantic colors for status icons
- Always include aria-label for screen readers

## Layout Patterns

### Grid System

- 12-column grid
- Max width: 1200px
- Gutter: 24px
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Container Patterns

- **Page container**: Max width with horizontal padding
- **Section containers**: Full width with internal padding
- **Card containers**: White backgrounds with shadows

## Interactive States

### Hover States

- Slightly darker/lighter backgrounds
- Maintain accessibility contrast
- Include visual feedback for interactive elements

### Focus States

- 2px solid outline with Primary Blue
- 4px offset shadow with rgba(0, 102, 204, 0.1)
- Maintain visible focus indicator

### Active States

- Pressed button state with slightly darker color
- Brief transition (150ms) for smooth interactions

## Animation Guidelines

### Duration

- **Fast**: 150ms (hover states, tooltips)
- **Medium**: 250ms (modals, dropdowns)
- **Slow**: 350ms (page transitions)

### Easing

- **Ease-out**: Most animations
- **Ease-in-out**: Modal appearances
- **Linear**: Loading spinners

### Best Practices

- Prefer transforms over position changes for performance
- Respect prefers-reduced-motion
- Keep animations purposeful and subtle
