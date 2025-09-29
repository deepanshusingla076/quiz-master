import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Landing() {
  const { login, signup } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'TEACHER'|'STUDENT'>('STUDENT')
  const [groupSection, setGroupSection] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    // Validate group section for students during signup
    if (isSignup && role === 'STUDENT' && !groupSection.trim()) {
      setError('Group section is required for students')
      return
    }
    
    try {
      if (isSignup) {
        await signup({
          name,
          email,
          password,
          role,
          groupSection: role === 'STUDENT' ? groupSection.trim() : undefined
        })
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err?.response?.data?.message || err?.message || 'Auth failed')
    }
  }

  return (
    <div>
      <section className="hero">
        <div className="card brutal">
          <h2 style={{marginTop:0}}>Quiz Master: Microservices Architecture</h2>
          <p>Modern, scalable quiz platform with advanced microservices architecture</p>
          <ul>
            <li>🏗️ Microservices-based architecture with Eureka service discovery</li>
            <li>🔒 JWT-based authentication with API Gateway security</li>
            <li>👥 Role-based dashboards for teachers and students</li>
            <li>📊 Group-wise quiz assignment and management</li>
            <li>⏱️ Single-attempt enforcement with result publication control</li>
            <li>🔄 Service-to-service communication with load balancing</li>
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
          <>
            <div style={{marginBottom:12}}>
              <label>Role</label>
              <select value={role} onChange={e=>setRole(e.target.value as any)}>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            {role === 'STUDENT' && (
              <div style={{marginBottom:12}}>
                <label>Group/Section</label>
                <input 
                  type="text"
                  value={groupSection} 
                  onChange={e=>setGroupSection(e.target.value)} 
                  placeholder="e.g., CS-A, Math-B1, etc."
                  required={role === 'STUDENT'}
                />
              </div>
            )}
          </>
        )}
        {error && <div style={{color:'red', fontWeight:800, marginBottom:12}}>{error}</div>}
        <button className="btn brutal" type="submit">{isSignup ? 'Sign up' : 'Login'}</button>
        <div style={{marginTop:12}}>
          <a onClick={()=>setIsSignup(!isSignup)} style={{cursor:'pointer', textDecoration:'underline'}}> {isSignup ? 'Have an account? Login' : 'New here? Sign up'}</a>
        </div>
        </form>
      </section>

      <section className="card brutal" style={{marginTop:24}}>
        <h2 style={{marginTop:0}}>Microservices Architecture Overview</h2>
        <p>Our platform is built using a modern microservices architecture that ensures scalability, reliability, and maintainability. Each service is independent and communicates through well-defined APIs.</p>
        
        <h4>Service Architecture:</h4>
        <ul>
          <li><strong>🎯 API Gateway (Port 8080):</strong> Single entry point with JWT validation and routing</li>
          <li><strong>🔍 Eureka Service Registry (Port 8761):</strong> Service discovery and load balancing</li>
          <li><strong>🔐 Auth Service (Port 8081):</strong> User authentication and JWT token management</li>
          <li><strong>📝 Question Bank Service (Port 8082):</strong> Quiz and question management with group assignment</li>
          <li><strong>📊 Result Service (Port 8083):</strong> Attempt tracking and result publication control</li>
        </ul>
        
        <h4>Key Features:</h4>
        <ul>
          <li><strong>Group-Based Assignment:</strong> Teachers can assign quizzes to specific groups/sections</li>
          <li><strong>Single Attempt Enforcement:</strong> Backend validation prevents multiple attempts</li>
          <li><strong>Result Publication Control:</strong> Teachers manually publish results when ready</li>
          <li><strong>Secure Communication:</strong> All inter-service calls are secured and validated</li>
          <li><strong>Service Discovery:</strong> Dynamic service registration and discovery via Eureka</li>
          <li><strong>Load Balancing:</strong> Automatic load balancing across service instances</li>
        </ul>
        
        <h4>Perfect For:</h4>
        <ul>
          <li>Educational institutions with multiple classes/sections</li>
          <li>Large-scale online learning platforms</li>
          <li>Corporate training with departmental organization</li>
          <li>Competitive exam preparation centers</li>
          <li>Any scenario requiring organized group management</li>
        </ul>
      </section>

      <section className="card brutal" style={{marginTop:24}}>
        <h2 style={{marginTop:0}}>Teacher Dashboard Features</h2>
        <div className="feature-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px'}}>
          <div>
            <h4>📝 Quiz Management</h4>
            <ul>
              <li>Create quizzes with multiple question types</li>
              <li>Assign quizzes to specific groups</li>
              <li>Set time limits and total marks</li>
              <li>Edit and delete quizzes</li>
            </ul>
          </div>
          <div>
            <h4>📊 Result Management</h4>
            <ul>
              <li>View all student attempts</li>
              <li>Group-wise attempt filtering</li>
              <li>Publish/unpublish results manually</li>
              <li>Real-time attempt monitoring</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card brutal" style={{marginTop:24}}>
        <h2 style={{marginTop:0}}>Student Dashboard Features</h2>
        <div className="feature-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px'}}>
          <div>
            <h4>📋 Quiz Access</h4>
            <ul>
              <li>View quizzes assigned to your group</li>
              <li>Single attempt enforcement</li>
              <li>Real-time timer during attempts</li>
              <li>Auto-submit on time expiry</li>
            </ul>
          </div>
          <div>
            <h4>📈 Progress Tracking</h4>
            <ul>
              <li>View quiz history and status</li>
              <li>See results when published</li>
              <li>Track completion percentage</li>
              <li>Time taken analytics</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card brutal" style={{marginTop:24}}>
        <h2 style={{marginTop:0}}>Technical Stack</h2>
        <div className="tech-stack" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px'}}>
          <div>
            <h4>Backend Technologies</h4>
            <ul>
              <li>Spring Boot 3.3.3</li>
              <li>Spring Cloud (Eureka, Gateway)</li>
              <li>Spring Security with JWT</li>
              <li>Spring Data JPA</li>
              <li>MySQL Database</li>
              <li>OpenFeign for service communication</li>
            </ul>
          </div>
          <div>
            <h4>Frontend Technologies</h4>
            <ul>
              <li>React 18 with TypeScript</li>
              <li>Tailwind CSS for styling</li>
              <li>Axios for HTTP requests</li>
              <li>React Context for state management</li>
              <li>Vite for build tooling</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card brutal" style={{marginTop:24}}>
        <h2 style={{marginTop:0}}>Getting Started</h2>
        <p>Follow these simple steps to get the Quiz Master microservices platform up and running:</p>
        
        <div className="startup-guide" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px'}}>
          <div>
            <h4>� Quick Start</h4>
            <ol>
              <li>Start Eureka Service Registry (Port 8761)</li>
              <li>Start API Gateway (Port 8080)</li>
              <li>Start Auth Service (Port 8081)</li>
              <li>Start Question Bank Service (Port 8082)</li>
              <li>Start Result Service (Port 8083)</li>
              <li>Launch React Frontend (Port 5173)</li>
            </ol>
          </div>
          
          <div>
            <h4>� Support & Contact</h4>
            <ul>
              <li><strong>Email:</strong> support@quizplatform.com</li>
              <li><strong>Phone:</strong> +91 89237 09367</li>
              <li><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</li>
              <li><strong>Features:</strong> features@quizplatform.com</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}


