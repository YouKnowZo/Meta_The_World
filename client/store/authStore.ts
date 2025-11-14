import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface User {
  id: string
  username: string
  email: string
  role: string
  wallet_balance: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({ user, token, isAuthenticated: true })
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({ user, token, isAuthenticated: true })
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (user: User) => {
    set({ user })
  },
}))

// Initialize auth from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    // Fetch user profile
    axios.get(`${API_URL}/users/me`)
      .then((response) => {
        useAuthStore.setState({
          user: response.data,
          token,
          isAuthenticated: true,
        })
      })
      .catch(() => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      })
  }
}
