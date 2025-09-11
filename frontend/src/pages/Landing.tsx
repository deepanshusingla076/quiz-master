import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function Landing() {
  const { login, signup } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'TEACHER'|'STUDENT'>('STUDENT')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (isSignup) await signup(name, email, password, role)
      else await login(email, password)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Auth failed')
    }
  }

  return (
    <div className="hero">
      <div className="card brutal">
        <h2 style={{marginTop:0}}>We make quizzes feel like a showdown.</h2>
        <p>Brutal visuals. Clean flows. Built for speed.</p>
        <ul>
          <li>Role-based dashboards</li>
          <li>Real-time leaderboard</li>
          <li>Responsive by default</li>
        </ul>
      </div>
      <form className="card brutal" onSubmit={onSubmit}>
        <h3 style={{marginTop:0}}>{isSignup ? 'Create account' : 'Welcome back'}</h3>
        {isSignup && (
          <div style={{marginBottom:12}}>
            <label>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required/>
          </div>
        )}
        <div style={{marginBottom:12}}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div style={{marginBottom:12}}>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        {isSignup && (
          <div style={{marginBottom:12}}>
            <label>Role</label>
            <select value={role} onChange={e=>setRole(e.target.value as any)}>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>
        )}
        {error && <div style={{color:'red', fontWeight:800, marginBottom:12}}>{error}</div>}
        <button className="btn brutal" type="submit">{isSignup ? 'Sign up' : 'Login'}</button>
        <div style={{marginTop:12}}>
          <a onClick={()=>setIsSignup(!isSignup)} style={{cursor:'pointer', textDecoration:'underline'}}> {isSignup ? 'Have an account? Login' : 'New here? Sign up'}</a>
        </div>
      </form>
    </div>
  )
}


