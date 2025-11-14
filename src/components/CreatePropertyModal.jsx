import React, { useState } from 'react'
import { useWorldStore } from '../stores/worldStore'
import './CreatePropertyModal.css'

const CreatePropertyModal = () => {
  const {
    setShowCreateProperty,
    socket,
    user,
    isAgent
  } = useWorldStore()

  const [formData, setFormData] = useState({
    name: '',
    type: 'residential',
    price: '',
    size: '',
    description: '',
    position: [0, 0, 0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    socket.emit('createProperty', {
      ...formData,
      price: parseFloat(formData.price),
      ownerId: user?.id || 'guest',
      agentId: isAgent ? user?.id : null,
      status: 'available'
    })

    setShowCreateProperty(false)
    setFormData({
      name: '',
      type: 'residential',
      price: '',
      size: '',
      description: '',
      position: [0, 0, 0]
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="create-property-overlay" onClick={() => setShowCreateProperty(false)}>
      <div className="create-property-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setShowCreateProperty(false)}>
          ×
        </button>

        <h2>List New Property</h2>
        <p className="modal-subtitle">Add a property to the virtual real estate market</p>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-group">
            <label htmlFor="name">Property Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Luxury Sky Villa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="mansion">Mansion</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="100000"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="size">Size (sq ft)</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="2000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              rows="4"
            />
          </div>

          {isAgent && (
            <div className="agent-note">
              <p>💼 As an agent, you'll earn 5% commission on any sale of this property</p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => setShowCreateProperty(false)}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              List Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePropertyModal
