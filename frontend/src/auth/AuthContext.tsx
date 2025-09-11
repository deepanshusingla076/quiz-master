import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type Role = 'TEACHER' | 'STUDENT'
type User = { id: number; name: string; role: Role }

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true }).then(r => setUser(r.data)).catch(() => setUser(null))
  }, [])

  async function login(email: string, password: string) {
    await axios.post('/api/auth/login', { email, password }, { withCredentials: true })
    const me = await axios.get('/api/auth/me', { withCredentials: true })
    setUser(me.data)
  }
  async function signup(name: string, email: string, password: string, role: Role) {
    await axios.post('/api/auth/signup', { name, email, password, role }, { withCredentials: true })
    await login(email, password)
  }
  async function logout() {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }


