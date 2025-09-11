import { useEffect, useState } from 'react'
import axios from 'axios'
import { createLeaderboardClient } from '../ws'

type Quiz = { id: number; title: string; difficulty: 'EASY'|'MEDIUM'|'HARD' }
type Result = { quizId: number; score: number }

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  async function load() {
    const qs = await axios.get('/api/quizzes/available')
    setQuizzes(qs.data)
    const rs = await axios.get('/api/attempts/mine')
    setResults(rs.data)
    const lb = await axios.get('/api/analytics/attempts')
    setLeaderboard(lb.data.slice(0, 10))
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    const stop = createLeaderboardClient((_msg) => {
      // simplistic refresh on any incoming leaderboard event
      load()
    })
    return () => {
      if (stop) stop()
    }
  }, [])

  async function attempt(quizId: number) {
    await axios.post(`/api/attempts/${quizId}`, {})
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
      <div className="card brutal" style={{gridColumn:'1 / -1'}}>
        <h3 style={{marginTop:0}}>Live Leaderboard</h3>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
          <div><b>Student</b></div><div><b>Quiz</b></div><div><b>Score</b></div><div><b>When</b></div>
          {leaderboard.map(a => (
            <>
              <div>{a.studentName}</div>
              <div>{a.quizTitle}</div>
              <div>{a.score}</div>
              <div>{new Date(a.createdAt).toLocaleTimeString()}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}


