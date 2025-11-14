import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useStore } from '../store'
import './RealEstateMarketplace.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function RealEstateMarketplace() {
  const { user, token } = useStore()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    type: '',
    status: 'available'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [filters])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)

      const response = await axios.get(`${API_URL}/real-estate/properties?${params}`)
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>🏠 Real Estate Marketplace</h1>
        <button onClick={() => navigate('/')}>Back to World</button>
      </div>

      <div className="marketplace-filters">
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
          <option value="luxury">Luxury</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : (
        <div className="properties-grid">
          {properties.map(property => (
            <div
              key={property.id}
              className="property-card"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              <div className="property-image">
                <div className="property-status-badge">{property.status}</div>
              </div>
              <div className="property-info">
                <h3>{property.title}</h3>
                <p className="property-type">{property.type}</p>
                <p className="property-description">{property.description}</p>
                <div className="property-footer">
                  <span className="property-price">${property.price?.toLocaleString()}</span>
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {properties.length === 0 && !loading && (
        <div className="no-properties">
          <p>No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
