import './App.css'
import { useRef, useEffect, useState } from 'react'

function App() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Placeholder project data - will be replaced with actual content
  const projects = [
    { id: 1, title: 'Project 1', color: '#8B5CF6' },
    { id: 2, title: 'Project 2', color: '#2A2A2A' },
    { id: 3, title: 'Project 3', color: '#DC2626' },
  ]

  // Create a very large number of copies so repositioning is rarely needed
  const copies = 100 // 100 copies = 300 cards total
  const infiniteProjects = Array(copies).fill(projects).flat()

  useEffect(() => {
    // Start at the middle - this gives 150 cards in each direction
    if (carouselRef.current) {
      // Get the actual first card element to calculate accurate width
      const firstCard = carouselRef.current.querySelector('.card') as HTMLElement
      if (firstCard) {
        const cardStyle = window.getComputedStyle(firstCard)
        const cardWidth = firstCard.offsetWidth
        const gap = 25 // gap between cards
        const cardWithGap = cardWidth + gap
        const middlePosition = cardWithGap * projects.length * (copies / 2)
        
        // Disable smooth scrolling for initial position
        carouselRef.current.style.scrollBehavior = 'auto'
        carouselRef.current.scrollLeft = middlePosition
        
        // Re-enable smooth scrolling after a frame
        requestAnimationFrame(() => {
          if (carouselRef.current) {
            carouselRef.current.style.scrollBehavior = 'smooth'
          }
        })
      }
    }

    // Track which card is centered for the indicator
    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      
      // Wait for scroll snap to finish before updating indicator
      scrollTimeout = setTimeout(() => {
        if (!carouselRef.current) return
        
        const container = carouselRef.current
        const cards = Array.from(container.querySelectorAll('.card')) as HTMLElement[]
        if (cards.length === 0) return
        
        // Find which card is closest to the center of the viewport
        const containerRect = container.getBoundingClientRect()
        const containerCenter = containerRect.left + containerRect.width / 2
        
        let closestCard = cards[0]
        let closestDistance = Infinity
        
        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect()
          const cardCenter = cardRect.left + cardRect.width / 2
          const distance = Math.abs(cardCenter - containerCenter)
          
          if (distance < closestDistance) {
            closestDistance = distance
            closestCard = card
          }
        })
        
        // Get the card's title to determine which project (1, 2, or 3)
        const cardTitle = closestCard.querySelector('h2')?.textContent || ''
        const projectNum = parseInt(cardTitle.replace('Project ', ''))
        const currentIndex = (projectNum - 1) % projects.length
        
        setActiveIndex(currentIndex)
      }, 50) // Small delay to let snap finish
    }

    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Set initial state
      return () => {
        carousel.removeEventListener('scroll', handleScroll)
        clearTimeout(scrollTimeout)
      }
    }
  }, [projects.length, copies])

  const scrollLeft = () => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector('.card') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth
        const scrollAmount = cardWidth + 25 // card width + gap
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector('.card') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth
        const scrollAmount = cardWidth + 25 // card width + gap
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="nav-brand">TJ Gomez-Vidal</a>
        <div className="nav-links">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="nav-link">
            LinkedIn
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-link">
            Resume
          </a>
        </div>
      </nav>

      {/* Bio Section */}
      <section className="bio">
        <p className="bio-text">
          Hi, I am a Product Designer with 5+ years of experience designing for 
          immersive entertainment and FinTech platforms. I specialize in simplifying 
          technical workflows that are based on underlying complex systems.
        </p>
      </section>

      {/* Card Carousel */}
      <div className="carousel-wrapper">
        <div className="carousel-container" ref={carouselRef}>
          <div className="carousel">
            {infiniteProjects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="card"
                style={{ backgroundColor: project.color }}
              >
                <div className="card-content">
                  <h2>{project.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {projects.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
