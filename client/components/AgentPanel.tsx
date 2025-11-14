'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, DollarSign, FileText, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface AgentPanelProps {
  onClose: () => void
}

export default function AgentPanel({ onClose }: AgentPanelProps) {
  const { user } = useAuthStore()
  const [agentData, setAgentData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (user?.role === 'agent') {
      fetchAgentData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchAgentData = async () => {
    try {
      const [agentRes, transactionsRes] = await Promise.all([
        axios.get(`${API_URL}/agents/${user?.id}`),
        axios.get(`${API_URL}/agents/${user?.id}/transactions`)
      ])
      setAgentData(agentRes.data)
      setTransactions(transactionsRes.data)
    } catch (error) {
      console.error('Failed to fetch agent data:', error)
    } finally {
      setLoading(false)
    }
  }

  const registerAsAgent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      await axios.post(`${API_URL}/agents/register`, {
        licenseNumber: formData.get('licenseNumber'),
        bio: formData.get('bio'),
        specialties: (formData.get('specialties') as string).split(',').map(s => s.trim())
      })
      alert('Successfully registered as a real estate agent!')
      setShowRegister(false)
      window.location.reload()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to register as agent')
    }
  }

  if (loading) {
    return (
      <div className="absolute right-4 top-20 bottom-4 w-[500px] bg-black/80 backdrop-blur-md rounded-xl border border-gray-700 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!agentData && user?.role !== 'agent') {
    return (
      <div className="absolute right-4 top-20 bottom-4 w-[500px] bg-black/80 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus size={24} />
              Become an Agent
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {showRegister ? (
            <form onSubmit={registerAsAgent} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">License Number</label>
                <input
                  name="licenseNumber"
                  placeholder="RE-LICENSE-12345"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Specialties (comma-separated)</label>
                <input
                  name="specialties"
                  placeholder="Residential, Commercial, Luxury"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Register as Agent
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-white">Become a Virtual Real Estate Agent</h3>
              <p className="text-gray-400">
                Help buyers find their dream properties and earn commissions on every transaction!
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 text-left space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <span>Earn 5% commission on every sale</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  <span>Build your reputation and track your success</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-purple-400" />
                  <span>Manage listings and help clients</span>
                </div>
              </div>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Register Now
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute right-4 top-20 bottom-4 w-[500px] bg-black/80 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={24} />
            Agent Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="text-sm text-green-300 mb-1">Total Commission</div>
            <div className="text-2xl font-bold text-white">
              ${agentData?.total_commission?.toLocaleString() || '0'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
            <div className="text-sm text-blue-300 mb-1">Transactions</div>
            <div className="text-2xl font-bold text-white">
              {agentData?.total_transactions || 0}
            </div>
          </div>
        </div>

        {/* Agent Info */}
        {agentData?.bio && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">About</h3>
            <p className="text-sm text-gray-300">{agentData.bio}</p>
            {agentData.specialties && agentData.specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {agentData.specialties.map((spec: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transactions */}
        <div>
          <h3 className="font-semibold text-white mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-white">{transaction.property_title}</div>
                      <div className="text-xs text-gray-400">{transaction.property_type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">
                        +${transaction.agent_commission?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Commission</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
