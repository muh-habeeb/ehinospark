# ETHNOSPARK Color Palette Guide

## 🎨 Primary Color Palette (Invitation Card Theme)

### Core Colors
| Color Name | Hex Code | CSS Variable | Tailwind Class | Usage |
|------------|----------|--------------|----------------|-------|
| **Deep Maroon** | `#4A0B0B` | `--ethno-deep-maroon` | `bg-ethno-maroon` | Main background, primary brand color |
| **Metallic Gold** | `#D4AF37` | `--ethno-gold-metallic` | `bg-ethno-gold` | Main text, primary actions |
| **Bright Gold** | `#FFD700` | `--ethno-gold-bright` | `bg-ethno-gold-bright` | Highlights, glowing effects |
| **Cream White** | `#FDF5E6` | `--ethno-cream-white` | `bg-ethno-cream` | Text on dark backgrounds |
| **Decorative Gold** | `#C8A951` | `--ethno-gold-decorative` | `bg-ethno-gold-decorative` | Borders, decorative elements |

### Extended Palette (Enhanced UX)
| Color Name | Hex Code | CSS Variable | Tailwind Class | Usage |
|------------|----------|--------------|----------------|-------|
| **Light Maroon** | `#6B1A1A` | `--ethno-maroon-light` | `bg-ethno-maroon-light` | Cards, hover states |
| **Dark Maroon** | `#2D0606` | `--ethno-maroon-dark` | `bg-ethno-maroon-dark` | Deep shadows, sidebar |
| **Muted Gold** | `#B8941F` | `--ethno-gold-muted` | `bg-ethno-gold-muted` | Subtle elements |
| **Dark Cream** | `#F5E6C8` | `--ethno-cream-dark` | `bg-ethno-cream-dark` | Muted text |
| **Accent Red** | `#8B0000` | `--ethno-accent-red` | `bg-ethno-accent-red` | Error states, alerts |

## 🎯 Usage Guidelines

### Backgrounds
- **Primary Background**: Deep Maroon (`#4A0B0B`)
- **Card Background**: Light Maroon (`#6B1A1A`)
- **Sidebar/Navigation**: Dark Maroon (`#2D0606`)

### Text Colors
- **Primary Text**: Cream White (`#FDF5E6`)
- **Headers/Titles**: Bright Gold (`#FFD700`) with glow effect
- **Body Text**: Cream White (`#FDF5E6`)
- **Muted Text**: Dark Cream (`#F5E6C8`)

### Interactive Elements
- **Primary Buttons**: Metallic Gold background (`#D4AF37`)
- **Button Text**: Deep Maroon (`#4A0B0B`)
- **Hover States**: Bright Gold (`#FFD700`)
- **Borders**: Decorative Gold (`#C8A951`)

### Special Effects
- **Text Glow**: Use `text-glow-gold` class for title effects
- **Gradients**: Use `bg-gold-gradient` for premium feel
- **Shadows**: Use `shadow-gold` and `shadow-gold-lg` classes

## 🔧 CSS Classes Available

### Background Classes
```css
.bg-ethno-maroon          /* Deep maroon background */
.bg-ethno-maroon-light    /* Light maroon for cards */
.bg-ethno-maroon-dark     /* Dark maroon for navigation */
.bg-ethno-gold            /* Metallic gold */
.bg-ethno-gold-bright     /* Bright gold highlights */
.bg-ethno-gold-decorative /* Decorative gold borders */
.bg-ethno-cream           /* Cream white background */
```

### Text Classes
```css
.text-ethno-maroon        /* Deep maroon text */
.text-ethno-gold          /* Metallic gold text */
.text-ethno-gold-bright   /* Bright gold text */
.text-ethno-cream         /* Cream white text */
```

### Special Effect Classes
```css
.text-glow-gold          /* Glowing gold text effect */
.bg-gold-gradient        /* Gold gradient background */
.text-gold-gradient      /* Gold gradient text */
.bg-maroon-gradient      /* Maroon gradient background */
.shadow-gold             /* Gold shadow effect */
.shadow-gold-lg          /* Large gold shadow */
.shadow-maroon           /* Maroon shadow effect */
```

### Border Classes
```css
.border-ethno-gold            /* Metallic gold border */
.border-ethno-gold-bright     /* Bright gold border */
.border-ethno-gold-decorative /* Decorative gold border */
```

## 🎨 Design Examples

### Hero Section
```tsx
<section className="bg-ethno-maroon">
  <h1 className="text-glow-gold font-bitsumis">ETHNOSPARK</h1>
  <p className="text-ethno-cream">Cultural celebration</p>
</section>
```

### Navigation
```tsx
<nav className="bg-ethno-maroon/95 backdrop-blur-md shadow-gold-lg">
  <h1 className="text-ethno-gold-bright">ETHNOSPARK</h1>
  <button className="text-ethno-cream hover:text-ethno-gold-bright">
    About
  </button>
</nav>
```

### Cards
```tsx
<div className="bg-ethno-maroon-light border border-ethno-gold-decorative/30 shadow-gold">
  <h3 className="text-ethno-gold">Card Title</h3>
  <p className="text-ethno-cream">Card content</p>
</div>
```

### Buttons
```tsx
<button className="bg-ethno-gold text-ethno-maroon hover:bg-ethno-gold-bright">
  Primary Action
</button>
```

## 🌟 Best Practices

1. **Contrast**: Always ensure sufficient contrast between text and background
2. **Hierarchy**: Use gold variants for different levels of importance
3. **Accessibility**: Test color combinations for accessibility compliance
4. **Consistency**: Stick to the defined palette throughout the application
5. **Effects**: Use glowing and gradient effects sparingly for maximum impact

## 📱 Responsive Considerations

- Colors remain consistent across all screen sizes
- Ensure gold text remains readable on mobile devices
- Consider reducing glow effects on smaller screens for better performance
- Maintain border visibility on all devices

## 🎭 Theme Variations

### Light Mode (Day Event)
- Maintain maroon and gold scheme
- Increase cream color opacity for better readability

### Dark Mode (Evening Event)
- Deepen maroon backgrounds
- Increase gold brightness for better contrast
- Enhanced glow effects for premium feel

This color palette creates a sophisticated, culturally rich aesthetic that reflects the elegance and tradition of ETHNOSPARK events.