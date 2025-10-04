import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import './ScrollSection.css'

interface ScrollSectionProps {
  id: string
  className?: string
  background?: 'dark' | 'gradient' | 'transparent' | 'glass'
  padding?: 'none' | 'small' | 'medium' | 'large'
  minHeight?: 'auto' | 'screen' | 'half'
  children: ReactNode
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  className = '',
  background = 'transparent',
  padding = 'large',
  minHeight = 'auto',
  children
}) => {
  const backgroundClasses = {
    dark: 'bg-dark',
    gradient: 'bg-gradient',
    transparent: 'bg-transparent',
    glass: 'bg-glass'
  }

  const paddingClasses = {
    none: 'p-none',
    small: 'p-small',
    medium: 'p-medium',
    large: 'p-large'
  }

  const heightClasses = {
    auto: 'h-auto',
    screen: 'h-screen',
    half: 'h-half'
  }

  return (
    <motion.section
      id={id}
      className={`scroll-section ${backgroundClasses[background]} ${paddingClasses[padding]} ${heightClasses[minHeight]} ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="section-container">
        {children}
      </div>
    </motion.section>
  )
}

// Specialized sections
export const HeroSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="hero" background="gradient" minHeight="screen" className={`hero-section ${className}`}>
    {children}
  </ScrollSection>
)

export const MetaverseSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="metaverse" background="dark" minHeight="screen" className={`metaverse-section ${className}`}>
    {children}
  </ScrollSection>
)

export const LandSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="land" background="glass" minHeight="screen" className={`land-section ${className}`}>
    {children}
  </ScrollSection>
)

export const CryptoSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="crypto" background="gradient" minHeight="screen" className={`crypto-section ${className}`}>
    {children}
  </ScrollSection>
)

export const CasinoSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="casino" background="dark" minHeight="screen" className={`casino-section ${className}`}>
    {children}
  </ScrollSection>
)

export const EarningSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="earning" background="glass" minHeight="screen" className={`earning-section ${className}`}>
    {children}
  </ScrollSection>
)

export const SocialSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="social" background="gradient" minHeight="screen" className={`social-section ${className}`}>
    {children}
  </ScrollSection>
)

export const CustomizeSection: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ScrollSection id="customize" background="dark" minHeight="screen" className={`customize-section ${className}`}>
    {children}
  </ScrollSection>
)