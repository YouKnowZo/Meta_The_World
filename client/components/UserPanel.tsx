'use client'

import { Home, User, Wallet, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface UserPanelProps {
  user: {
    id: string
    username: string
    email: string
    role: string
    wallet_balance: number
  }
  onShowProperties: () => void
  onShowAgent: () => void
}

export default function UserPanel({ user, onShowProperties, onShowAgent }: UserPanelProps) {
  const { logout } = useAuthStore()

  const addFunds = async () => {
    const amount = prompt('Enter amount to add (default: 10000):', '10000')
    if (amount && !isNaN(parseFloat(amount))) {
      try {
        await axios.post(`${API_URL}/users/wallet/add`, { amount: parseFloat(amount) })
        window.location.reload()
      } catch (error) {
        alert('Failed to add funds')
      }
    }
  }

  return (
    <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 min-w-[300px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <div className="font-semibold text-white">{user.username}</div>
          <div className="text-xs text-gray-400 capitalize">{user.role}</div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <Wallet size={16} />
            <span className="text-sm">Balance</span>
          </div>
          <div className="text-lg font-bold text-green-400">
            ${user.wallet_balance.toLocaleString()}
          </div>
        </div>
        <button
          onClick={addFunds}
          className="mt-2 w-full text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-1 rounded transition-colors"
        >
          Add Funds
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={onShowProperties}
          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors"
        >
          <Home size={18} />
          <span>Properties</span>
        </button>

        {user.role === 'agent' && (
          <button
            onClick={onShowAgent}
            className="w-full flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 transition-colors"
          >
            <User size={18} />
            <span>Agent Dashboard</span>
          </button>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
