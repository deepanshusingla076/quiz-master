import { useEffect, useState } from 'react'
import axios from 'axios'

type Quiz = { id: number; title: string; difficulty: 'EASY'|'MEDIUM'|'HARD' }
type Result = { quizId: number; score: number }

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<Result[]>([])

  async function load() {
    const qs = await axios.get('/api/quizzes/available', { withCredentials: true })
    setQuizzes(qs.data)
    const rs = await axios.get('/api/attempts/mine', { withCredentials: true })
    setResults(rs.data)
  }
  useEffect(() => { load() }, [])

  async function attempt(quizId: number) {
    await axios.post(`/api/attempts/${quizId}`, {}, { withCredentials: true })
    load()
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card brutal">
        <h3 style={{marginTop:0}}>Available Quizzes</h3>
        <ul>
          {quizzes.map(q => (
            <li key={q.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #ddd'}}>
              <span>{q.title} — {q.difficulty}</span>
              <button className="btn brutal" onClick={()=>attempt(q.id)}>Attempt</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card brutal">
        <h3 style={{marginTop:0}}>My Results</h3>
        <ul>
          {results.map(r => (
            <li key={r.quizId}>Quiz #{r.quizId}: {r.score}%</li>
          ))}
        </ul>
      </div>
    </div>
  )
}


