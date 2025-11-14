'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuthStore } from '@/store/authStore'
import LoginModal from '@/components/LoginModal'
import PropertyPanel from '@/components/PropertyPanel'
import UserPanel from '@/components/UserPanel'
import AgentPanel from '@/components/AgentPanel'

// Dynamically import the 3D world to avoid SSR issues
const VirtualWorld = dynamic(() => import('@/components/VirtualWorld'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl">Loading Meta The World...</div>
    </div>
  ),
})

export default function Home() {
  const { user, isAuthenticated } = useAuthStore()
  const [showLogin, setShowLogin] = useState(false)
  const [showPropertyPanel, setShowPropertyPanel] = useState(false)
  const [showAgentPanel, setShowAgentPanel] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLogin(true)
    }
  }, [isAuthenticated])

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <VirtualWorld />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
          <div className="bg-black/70 backdrop-blur-md rounded-lg px-6 py-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Meta The World
            </h1>
          </div>
          
          {isAuthenticated && user && (
            <UserPanel 
              user={user}
              onShowProperties={() => setShowPropertyPanel(true)}
              onShowAgent={() => setShowAgentPanel(true)}
            />
          )}
        </div>

        {/* Property Panel */}
        {showPropertyPanel && (
          <PropertyPanel onClose={() => setShowPropertyPanel(false)} />
        )}

        {/* Agent Panel */}
        {showAgentPanel && (
          <AgentPanel onClose={() => setShowAgentPanel(false)} />
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal 
          onClose={() => {
            if (isAuthenticated) {
              setShowLogin(false)
            }
          }}
        />
      )}
    </main>
  )
}
