import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Landing from './pages/Landing'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

function ProtectedRoute({ children, role }: { children: JSX.Element, role?: 'TEACHER' | 'STUDENT' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'TEACHER' ? '/teacher' : '/student'} replace />
  return children
}

function Shell() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    // redirect post-login
    if (user) navigate(user.role === 'TEACHER' ? '/teacher' : '/student')
  }, [user])
  
  if (loading) {
    return (
      <div className="container">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <h1 style={{fontFamily:'Impact, Haettenschweiler, Arial Black', letterSpacing:1}}>QUIZ//PLATFORM</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container">
      <div className="header">
        <h1 style={{fontFamily:'Impact, Haettenschweiler, Arial Black', letterSpacing:1}}>QUIZ//PLATFORM</h1>
        <div>
          {user ? (
            <button className="btn brutal" onClick={logout}>Logout</button>
          ) : (
            <Link to="/" className="btn brutal" style={{textDecoration:'none'}}>Login</Link>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/teacher" element={<ProtectedRoute role="TEACHER"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}


