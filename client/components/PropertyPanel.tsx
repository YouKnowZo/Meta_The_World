'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, DollarSign, Home, ShoppingCart, Plus } from 'lucide-react'
import { usePropertyStore, Property } from '@/store/propertyStore'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface PropertyPanelProps {
  onClose: () => void
}

export default function PropertyPanel({ onClose }: PropertyPanelProps) {
  const { properties, fetchProperties, purchaseProperty, selectProperty } = usePropertyStore()
  const { user } = useAuthStore()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>('')

  useEffect(() => {
    fetchProperties()
    fetchAgents()
  }, [fetchProperties])

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_URL}/agents`)
      setAgents(response.data)
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  const handlePurchase = async (property: Property) => {
    if (!user) return
    
    if (confirm(`Purchase ${property.title} for $${property.price.toLocaleString()}?`)) {
      try {
        await purchaseProperty(property.id, selectedAgent || undefined)
        alert('Property purchased successfully!')
        fetchProperties()
        setSelectedProperty(null)
      } catch (error: any) {
        alert(error.message || 'Failed to purchase property')
      }
    }
  }

  const handleCreateProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const propertyData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      property_type: formData.get('property_type') as string,
      size: parseFloat(formData.get('size') as string),
      price: parseFloat(formData.get('price') as string),
      location_x: (Math.random() - 0.5) * 400,
      location_y: 0,
      location_z: (Math.random() - 0.5) * 400,
    }

    try {
      await usePropertyStore.getState().createProperty(propertyData)
      alert('Property created successfully!')
      setShowCreateForm(false)
      fetchProperties()
    } catch (error: any) {
      alert(error.message || 'Failed to create property')
    }
  }

  return (
    <div className="absolute right-4 top-20 bottom-4 w-[500px] bg-black/80 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Home size={24} />
            Properties
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-colors"
              title="Create Property"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showCreateForm && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Property</h3>
            <form onSubmit={handleCreateProperty} className="space-y-3">
              <input
                name="title"
                placeholder="Property Title"
                required
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                rows={3}
              />
              <select
                name="property_type"
                required
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="luxury">Luxury Estate</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="size"
                  type="number"
                  placeholder="Size (sq ft)"
                  required
                  className="px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  required
                  className="px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
              >
                Create Property
              </button>
            </form>
          </div>
        )}

        {properties.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No properties available
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className={`bg-gray-800/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${
                selectedProperty?.id === property.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => {
                setSelectedProperty(property)
                selectProperty(property)
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{property.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  property.status === 'available' ? 'bg-green-500/20 text-green-300' :
                  property.status === 'sold' ? 'bg-red-500/20 text-red-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {property.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{property.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {property.property_type}
                </span>
                <span className="flex items-center gap-1">
                  <Home size={14} />
                  {property.size.toLocaleString()} sq ft
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-green-400">
                  ${property.price.toLocaleString()}
                </div>
                {property.status === 'available' && property.owner_id !== user?.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePurchase(property)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Buy
                  </button>
                )}
              </div>

              {selectedProperty?.id === property.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <label className="block text-sm text-gray-300 mb-2">
                    Use Agent (5% commission):
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">No Agent</option>
                    {agents.map((agent) => (
                      <option key={agent.user_id} value={agent.user_id}>
                        {agent.username} - {agent.total_transactions} transactions
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
