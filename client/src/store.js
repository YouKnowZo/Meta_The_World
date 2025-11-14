import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  socket: null,
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      set({ user: response.data, token })
    } catch (error) {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { user, token } = response.data
      localStorage.setItem('token', token)
      set({ user, token })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  },
  
  register: async (username, email, password, walletAddress) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        walletAddress
      })
      const { user, token } = response.data
      localStorage.setItem('token', token)
      set({ user, token })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' }
    }
  },
  
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  }
}))
