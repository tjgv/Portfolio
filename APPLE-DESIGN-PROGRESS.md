# Apple-Inspired Design - Progress

**Started:** February 9, 2026  
**Status:** Phase 1 Complete

---

## ✅ Completed

### Phase 1: Frosted Glass Navbar + Video Hero

1. **Frosted Glass Navbar**
   - Fixed position with blur effect (`backdrop-filter`)
   - Semi-transparent white background
   - Same links as before: TJ Gomez-Vidal, LinkedIn, Resume
   - Stays on top while scrolling

2. **Hero Section with Video Background**
   - Full viewport height hero section (200vh for scroll effect)
   - Video background that plays in a loop
   - Text overlay positioned at bottom (20% from bottom)
   - Scroll-driven animations:
     - Video fades to black as you scroll (opacity based on scroll progress)
     - Text moves up and fades out as you scroll

---

## 🚧 Next Steps

### Phase 2: Dynamic Text Fade-In
- Add multiple text blocks that fade in from bottom as you scroll
- Each new text block pushes previous text up
- Progressive text reveal effect

### Phase 3: Full-Screen Image Section
- Add full-screen image after hero
- Implement shrinking animation (100% → 60% width × 40% height)
- Keep image centered during shrink
- Trigger on scroll

### Phase 4: Carousel Integration
- Bring back the carousel from archived design
- Make it appear after image fully condenses
- Integrate with scroll flow

---

## 📝 To Do Before Testing

### Add Background Video
You need to provide a background video file:
1. Add your video to `/public/` folder
2. Name it something like `hero-background.mp4` or `portfolio-hero.mp4`
3. Update the video source in `App.tsx` (currently set to `/placeholder-video.mp4`)

**Video Recommendations:**
- Duration: 10-30 seconds (will loop)
- Resolution: 1920x1080 or higher
- Format: MP4 (H.264 codec)
- Size: Keep under 10MB if possible for web performance
- Content: Something related to your work (abstract, motion graphics, etc.)

---

## 🎨 Current Design Features

### Navbar
- Backdrop blur: 20px
- Background: rgba(255, 255, 255, 0.7)
- Padding: 16px 100px
- Font size: 14px (semi-bold Inter)

### Hero Section
- Height: 200vh (allows for scroll effect)
- Video: Full-screen, centered, object-fit: cover
- Text: Bottom 20%, left/right padding 100px
- Title: 64px bold
- Subtitle: 24px regular, max-width 600px

### Scroll Effects
- Video opacity: 1 → 0 (fades to black)
- Black overlay opacity: 0 → 1 (covers video)
- Text translateY: 0 → -100px (moves up)
- Text opacity: 1 → 0 (fades out)

---

## 💡 Technical Implementation

### Key Technologies
- React hooks: `useState`, `useRef`, `useEffect`
- Scroll-based animations using `window.scrollY`
- CSS `backdrop-filter` for frosted glass effect
- Inline styles for dynamic scroll-based properties

### Performance Considerations
- Passive scroll listener for better performance
- Video set to autoplay, loop, muted, playsInline
- Sticky positioning for video container

---

## 🔄 Archived Design

The previous carousel design has been saved to:
- `/archived-designs/carousel-design/`
- Includes: App.tsx, App.css, README.md

You can reference or restore this design anytime.

---

## Next Session Plan

1. Test hero section with actual video
2. Implement multi-text fade-in system
3. Add full-screen image section
4. Integrate shrinking animation
5. Bring back carousel at the end

Let me know when you're ready to continue or if you need adjustments to Phase 1!
