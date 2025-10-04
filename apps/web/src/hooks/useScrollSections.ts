import { useState, useEffect, useCallback } from 'react'

interface ScrollSection {
  id: string
  name: string
  element?: HTMLElement
}

export const useScrollSections = (sections: ScrollSection[]) => {
  const [currentSection, setCurrentSection] = useState<string>(sections[0]?.id || '')
  const [scrollProgress, setScrollProgress] = useState(0)

  // Update scroll progress
  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    setScrollProgress(progress)
  }, [])

  // Detect current section based on scroll position
  const updateCurrentSection = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight / 3

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      const element = document.getElementById(section.id)
      
      if (element && element.offsetTop <= scrollPosition) {
        setCurrentSection(section.id)
        break
      }
    }
  }, [sections])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  // Scroll to next/previous section
  const scrollToNext = useCallback(() => {
    const currentIndex = sections.findIndex(s => s.id === currentSection)
    if (currentIndex < sections.length - 1) {
      scrollToSection(sections[currentIndex + 1].id)
    }
  }, [currentSection, sections, scrollToSection])

  const scrollToPrevious = useCallback(() => {
    const currentIndex = sections.findIndex(s => s.id === currentSection)
    if (currentIndex > 0) {
      scrollToSection(sections[currentIndex - 1].id)
    }
  }, [currentSection, sections, scrollToSection])

  useEffect(() => {
    const handleScroll = () => {
      updateScrollProgress()
      updateCurrentSection()
    }

    // Throttle scroll events for performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [updateScrollProgress, updateCurrentSection])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && e.altKey) {
        e.preventDefault()
        scrollToNext()
      } else if (e.key === 'ArrowUp' && e.altKey) {
        e.preventDefault()
        scrollToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollToNext, scrollToPrevious])

  return {
    currentSection,
    scrollProgress,
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    sections
  }
}