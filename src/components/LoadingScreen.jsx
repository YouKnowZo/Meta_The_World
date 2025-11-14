import React from 'react'
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">Meta The World</h1>
        <p className="loading-subtitle">Loading your virtual reality...</p>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
