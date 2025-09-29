import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { User, Role, AuthResponse } from '../types'
import { API_CONFIG, DEFAULT_HEADERS } from '../config/api'

type SignupRequest = {
  name: string;
  email: string;
  password: string;
  role: Role;
  groupSection?: string;
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as any)

// Set base URL for API Gateway
axios.defaults.baseURL = API_CONFIG.BASE_URL
axios.defaults.timeout = API_CONFIG.TIMEOUT
axios.defaults.headers.common = { ...DEFAULT_HEADERS }

// Configure axios to include JWT token in requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // Validate token with backend using proper endpoint
          const response = await axios.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE)
          // Update user data from backend response if needed
          setUser(JSON.parse(userData))
        } catch (err) {
          console.log('Token validation failed:', err)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  async function login(email: string, password: string) {
    const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password })
    const authData = response.data
    
    const user: User = {
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      groupSection: authData.groupSection || ''
    }
    
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }
  
  async function signup(data: SignupRequest) {
    const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, data)
    const authData = response.data
    
    const user: User = {
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      groupSection: authData.groupSection || ''
    }
    
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }
  
  async function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { 
  return useContext(AuthContext) 
}


