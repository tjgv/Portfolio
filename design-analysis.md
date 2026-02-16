# jiakong.me Design Analysis

## Date: February 9, 2026
## Analyzed by: AI Agent

---

## Overview

The jiakong.me website is a minimal, clean portfolio site that follows modern design principles with a focus on typography, whitespace, and simple navigation.

## Design Specifications

### Typography

**Primary Heading (Name)**
- Font Family: Sans-serif (likely system font stack or modern sans-serif like Inter, SF Pro, or Helvetica Neue)
- Font Size: ~48-64px (large, bold display size)
- Font Weight: 700 (Bold)
- Text Transform: Uppercase
- Letter Spacing: Normal to slightly increased
- Color: #000000 or very dark gray (#1a1a1a)

**Body Text (Bio)**
- Font Family: Same as heading or complementary sans-serif
- Font Size: ~16-18px
- Font Weight: 400 (Regular)
- Line Height: 1.6-1.8 (generous for readability)
- Color: #333333 or #444444 (dark gray)
- Max Width: ~600-700px for optimal readability

**Navigation Links**
- Font Family: Same as body
- Font Size: ~16-18px
- Font Weight: 400-500 (Regular to Medium)
- Prefix: → (arrow character)
- Color: #000000 or dark gray
- Hover State: Likely underline or color change

**Footer Text**
- Font Family: Same as body
- Font Size: ~12-14px (smaller)
- Font Weight: 400 (Regular)
- Color: #666666 or #888888 (medium gray)

### Color Palette

**Primary Colors**
- Background: #FFFFFF (pure white) or #FAFAFA (off-white)
- Text Primary: #000000 or #1a1a1a (black/very dark gray)
- Text Secondary: #333333 or #444444 (dark gray)
- Text Tertiary: #666666 or #888888 (medium gray for footer)

**Interactive Elements**
- Link Default: #000000 (black)
- Link Hover: Possibly underlined or slight opacity change (0.7-0.8)
- Link Active: Same as hover or with different styling

### Spacing & Layout

**Container/Max Width**
- Main Content: ~800-900px max-width
- Centered horizontally: `margin: 0 auto`
- Padding: 40-60px on sides (mobile: 20-30px)

**Vertical Spacing**
- Top Padding (Name): 80-120px
- Section Gaps: 40-60px between major sections
- Paragraph Spacing: 20-30px between paragraphs
- Navigation Item Spacing: 12-16px between links
- Footer Top Margin: 60-80px

**Element Spacing**
- Name to Bio: 30-40px
- Bio to Navigation: 40-50px
- Navigation to Footer: 60-80px (or positioned at bottom)

### Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│          [80-120px top]             │
│                                     │
│         JIA KONG (centered)         │
│                                     │
│         [30-40px gap]               │
│                                     │
│    Bio text (left-aligned or       │
│    centered, max-width)            │
│                                     │
│         [40-50px gap]               │
│                                     │
│    →PRODUCT                         │
│    →BRANDING                        │
│    →About                           │
│    →Resume                          │
│                                     │
│         [60-80px gap]               │
│                                     │
│    ©2025 JIA KONG                   │
│    Made in Earth with love          │
│                                     │
└─────────────────────────────────────┘
```

### Component Details

**Header/Name Section**
- Alignment: Center
- Display: Block element
- Margin bottom: 30-40px

**Bio Section**
- Alignment: Left or center (left is more common for readability)
- Display: Block with constrained max-width
- Margin: 0 auto (if centered container)

**Navigation Section**
- Display: Flex column or block
- Alignment: Left
- Gap between items: 12-16px
- Each link prefixed with "→" character
- Links are clean without underline (underline on hover)

**Footer Section**
- Position: Relative or at bottom of content
- Alignment: Left or center
- Font size: Smaller than body
- Color: Lighter gray
- Multiple lines if needed

### Hover & Interaction States

**Links**
- Default: No underline, black text
- Hover: Underline appears or opacity reduces to 0.7-0.8
- Transition: 0.2-0.3s ease
- Cursor: Pointer

**Overall Feel**
- Clean and minimal
- Lots of breathing room (whitespace)
- No busy elements or distractions
- Focus on content and typography
- Professional but approachable

### Responsive Considerations

**Mobile (<768px)**
- Reduce top padding to 40-60px
- Reduce side padding to 20-30px
- Slightly smaller heading (36-48px)
- Maintain readable body text (16px minimum)
- Stack all elements vertically
- Reduce gaps proportionally

**Tablet (768px-1024px)**
- Medium padding values
- Heading size: 48-56px
- Maintain layout structure

**Desktop (>1024px)**
- Full spacing as specified above
- Max content width enforced
- Centered layout

### CSS Reset/Base Styles Needed

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1a1a1a;
  background: #ffffff;
}

a {
  text-decoration: none;
  color: inherit;
}
```

### Key Takeaways for Implementation

1. **Simplicity First**: No unnecessary elements or decorations
2. **Typography-Driven**: The design relies heavily on font sizing and weight hierarchy
3. **Whitespace**: Generous spacing throughout creates breathing room
4. **Minimal Color**: Primarily black text on white background with gray accents
5. **Clear Hierarchy**: Name → Bio → Navigation → Footer
6. **Arrow Prefix**: The "→" character is a key design element for navigation
7. **Hover States**: Subtle interactions with transitions
8. **Responsive**: Should adapt gracefully to different screen sizes

### Recommended Font Stacks

**Option 1: System Fonts**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

**Option 2: Google Fonts (Inter)**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Option 3: Google Fonts (Work Sans)**
```css
font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

---

## Implementation Notes

When implementing this design:
1. Start with a clean CSS reset
2. Set up the typography hierarchy first
3. Build the layout with proper spacing
4. Add hover states and transitions
5. Test responsive behavior
6. Ensure accessibility (contrast ratios, focus states)
7. Remove any emojis from bio text as specified in the plan

## Content Customization for T.J. Gomez-Vidal

- Replace "JIA KONG" with "T.J. GOMEZ-VIDAL"
- Update bio to the provided text (without emojis)
- Add Resume and LinkedIn links (placeholders)
- Update footer to "©2025 T.J. GOMEZ-VIDAL" and "This website was made entirely with AI coding"

---

**End of Analysis**
