import React from 'react'

export const ModelPlaceholder: React.FC<{ size?: number; color?: string }> = ({ size = 1, color = '#888' }) => {
  return (
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

export default ModelPlaceholder
