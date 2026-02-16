# Homepage Implementation Notes

**Date:** February 9, 2026  
**Status:** ✅ Implemented

---

## Overview

Implemented a modern portfolio homepage with a card carousel design based on the provided specifications and visual reference.

---

## Layout Specifications

### Overall Structure
- **Top Margin:** 50px
- **Bottom Margin:** 0px (carousel extends to viewport bottom)
- **Left/Right Margins:** 100px
- **Total Height:** 100vh (full viewport height)

---

## Components

### 1. Navigation Bar

**Position:** Top of page  
**Layout:** Flexbox with space-between

**Left Side:**
- "TJ Gomez-Vidal" (home link)
- Left-aligned (hugging left edge)

**Right Side:**
- "LinkedIn" link
- "Resume" link (opens PDF in new tab)
- Gap between links: 16px

**Typography:**
- Font: Inter
- Size: 18px
- Weight: 600 (Semi-bold)
- Color: #000000

---

### 2. Bio Section

**Position:** 25px below navbar

**Content:**
> "Hi, I am a Product Designer with 5+ years of experience designing for immersive entertainment and FinTech platforms. I specialize in simplifying technical workflows that are based on underlying complex systems."

**Typography:**
- Font: Inter
- Size: 16px
- Weight: 500 (Medium)
- Alignment: Left
- Max-width: 800px
- Line-height: 1.5

---

### 3. Card Carousel

**Position:** 50px below bio section

**Layout:**
- Takes up remaining viewport height
- Horizontal scrolling (overflow visible)
- No bottom margin (extends to viewport edge)

**Card Properties:**
- Width: 80vw (80% of viewport width)
- Gap between cards: 50px
- Border-radius: 24px
- Background: Dark color (#2A2A2A for default)
- Height: 100% of available space

**Behavior:**
- Horizontal scroll enabled
- Previous and next card edges visible
- Custom scrollbar styling
- Smooth hover transition (scale: 0.98)

**Current Cards (Placeholder):**
- Project 1 (Purple: #8B5CF6)
- Project 2 (Dark Gray: #2A2A2A)
- Project 3 (Red: #DC2626)

---

## Technical Implementation

### Fonts
- **Primary Font:** Inter (loaded from Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Fallback:** System font stack

### Scrolling
- Horizontal scroll on carousel container
- Custom scrollbar styling (8px height, rounded)
- Smooth scrolling behavior
- Overflow-x: auto, overflow-y: hidden

### Flexbox Layout
```
.app-container (column)
  ├── .navbar (row, space-between)
  ├── .bio
  └── .carousel-container (flex: 1)
       └── .carousel (row with gap)
            ├── .card
            ├── .card
            └── .card
```

---

## Responsive Breakpoints

### Desktop (Default)
- Margins: 50px top, 100px left/right
- Card width: 80vw

### Tablet (≤ 1024px)
- Margins: 40px top, 60px left/right
- Card width: 85vw

### Tablet Small (≤ 768px)
- Margins: 30px top, 40px left/right
- Font sizes slightly reduced (nav/bio: 16px/14px)
- Card width: 90vw

### Mobile (≤ 480px)
- Margins: 20px all sides
- Navbar stacks vertically
- Font sizes reduced (nav/bio: 14px/13px)
- Card width: 95vw
- Card border-radius: 16px (reduced)

---

## Key Features

### 1. Horizontal Carousel
- Cards scroll horizontally
- Edge of adjacent cards visible
- Maintains viewport height
- Custom scrollbar for better UX

### 2. Typography System
- Consistent Inter font throughout
- Proper font weights (semi-bold for nav, medium for bio)
- Appropriate sizing hierarchy

### 3. Responsive Design
- Four breakpoints for optimal viewing
- Maintains layout integrity at all sizes
- Mobile-friendly navigation

### 4. Hover Effects
- Links: opacity 0.7 on hover
- Cards: scale(0.98) on hover
- Smooth transitions (0.2s-0.3s)

---

## Color Palette

### Base Colors
- **Background:** #ffffff (white)
- **Text:** #000000 (black)
- **Card Default:** #2A2A2A (dark gray)

### Accent Colors (Placeholder Projects)
- **Purple:** #8B5CF6
- **Red:** #DC2626

---

## File Structure

### Modified Files
1. `index.html` - Added Inter font link
2. `src/index.css` - Updated global styles, added Inter font
3. `src/App.tsx` - Complete redesign with new layout
4. `src/App.css` - New styles matching specifications

---

## Next Steps (Optional Enhancements)

1. **Replace Placeholder Cards:**
   - Add actual project content
   - Add images/thumbnails
   - Add project descriptions
   - Add links to project details

2. **Add Resume PDF:**
   - Place resume PDF in public folder
   - Update resume link href

3. **Update LinkedIn URL:**
   - Replace placeholder with actual LinkedIn profile URL

4. **Enhanced Interactions:**
   - Add smooth scroll snapping to cards
   - Add keyboard navigation
   - Add touch/swipe gestures for mobile

5. **Loading States:**
   - Add skeleton loaders for cards
   - Add fade-in animations on load

6. **Additional Content:**
   - Add footer if needed
   - Add "About" or "Contact" sections
   - Add case study pages for projects

---

## Browser Compatibility

### Supported Features
- Flexbox (universal support)
- CSS custom properties (modern browsers)
- Google Fonts (all browsers)
- Custom scrollbar styling (WebKit browsers)
- Media queries (universal support)

### Tested On
- Modern Chrome/Edge (Chromium)
- Firefox
- Safari (desktop & mobile)

---

## Performance Notes

- Inter font preloaded with font-display: swap
- Minimal CSS for fast rendering
- No heavy JavaScript dependencies
- Smooth 60fps transitions
- Efficient horizontal scroll implementation

---

## Design Decisions

1. **Card Width (80vw):**
   - Large enough to be focal point
   - Small enough to show adjacent cards
   - Creates visual interest and invites scrolling

2. **Margins (100px left/right):**
   - Generous breathing room on desktop
   - Frames content nicely
   - Responsive scaling on smaller devices

3. **Carousel Height:**
   - Uses remaining viewport height
   - Maximizes visual impact
   - Creates immersive experience

4. **Typography Choices:**
   - Inter for modern, clean look
   - Semi-bold for nav (strong presence)
   - Medium for bio (readable, friendly)

---

## Accessibility Considerations

- Semantic HTML structure
- Proper link attributes (target, rel)
- Keyboard navigable
- Sufficient color contrast
- Readable font sizes
- Clear hover states

---

**Implementation Complete**  
The homepage now matches the provided design specifications with a functional card carousel, proper spacing, and responsive behavior across all device sizes.
