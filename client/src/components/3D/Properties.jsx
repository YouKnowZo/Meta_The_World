import { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import axios from 'axios'
import PropertyMarker from './PropertyMarker'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Properties() {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/real-estate/properties`)
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  return (
    <>
      {properties.map((property) => (
        <PropertyMarker
          key={property.id}
          property={property}
          position={[
            property.coordinates?.x || 0,
            property.coordinates?.y || 0,
            property.coordinates?.z || 0
          ]}
        />
      ))}
    </>
  )
}
