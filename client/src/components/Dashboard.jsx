import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import axios from 'axios'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Dashboard() {
  const { user, token } = useStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [properties, setProperties] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, propsRes, transRes] = await Promise.all([
        axios.get(`${API_URL}/world/stats`),
        axios.get(`${API_URL}/real-estate/properties?status=sold`),
        axios.get(`${API_URL}/transactions/history/${user.id}?type=all`)
      ])
      setStats(statsRes.data)
      setProperties(propsRes.data.filter(p => p.owner_id === user.id))
      setTransactions(transRes.data.slice(0, 5))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <button onClick={() => navigate('/')}>Enter World</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Your Balance</h3>
          <p className="stat-value">${user?.balance?.toLocaleString() || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Your Properties</h3>
          <p className="stat-value">{properties.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-value">{transactions.length}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h2>Your Properties</h2>
          <div className="properties-grid">
            {properties.length === 0 ? (
              <p>No properties yet. <button onClick={() => navigate('/marketplace')}>Browse Marketplace</button></p>
            ) : (
              properties.map(prop => (
                <div key={prop.id} className="property-card" onClick={() => navigate(`/property/${prop.id}`)}>
                  <h3>{prop.title}</h3>
                  <p>{prop.type}</p>
                  <p className="price">${prop.price?.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              transactions.map(trans => (
                <div key={trans.id} className="transaction-item">
                  <div>
                    <strong>{trans.title}</strong>
                    <p>{new Date(trans.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="transaction-amount">
                    {trans.buyer_id === user.id ? '-' : '+'}${trans.price?.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
