import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type Role = 'TEACHER' | 'STUDENT'
type User = { id: number; name: string; role: Role }

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as any)

// Configure axios to include JWT token in requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('/api/auth/me').then(r => {
        setUser(r.data)
        setLoading(false)
      }).catch((err) => {
        console.log('Auth check failed:', err)
        localStorage.removeItem('token')
        setUser(null)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const response = await axios.post('/api/auth/login', { email, password })
    const { token, user: userData } = response.data
    localStorage.setItem('token', token)
    setUser(userData)
  }
  
  async function signup(name: string, email: string, password: string, role: Role) {
    const response = await axios.post('/api/auth/signup', { name, email, password, role })
    const { token, user: userData } = response.data
    localStorage.setItem('token', token)
    setUser(userData)
  }
  
  async function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }


