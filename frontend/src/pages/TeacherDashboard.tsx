import { useEffect, useState } from 'react'
import axios from 'axios'

type Quiz = { id: number; title: string; difficulty: 'EASY'|'MEDIUM'|'HARD' }

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<'EASY'|'MEDIUM'|'HARD'>('EASY')

  async function load() {
    const r = await axios.get('/api/quizzes', { withCredentials: true })
    setQuizzes(r.data)
  }
  useEffect(() => { load() }, [])

  async function createQuiz(e: React.FormEvent) {
    e.preventDefault()
    await axios.post('/api/quizzes', { title, difficulty }, { withCredentials: true })
    setTitle(''); setDifficulty('EASY'); load()
  }
  async function remove(id: number) {
    await axios.delete(`/api/quizzes/${id}`, { withCredentials: true }); load()
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <form className="card brutal" onSubmit={createQuiz}>
        <h3 style={{marginTop:0}}>Create Quiz</h3>
        <div style={{marginBottom:12}}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div style={{marginBottom:12}}>
          <label>Difficulty</label>
          <select value={difficulty} onChange={e=>setDifficulty(e.target.value as any)}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <button className="btn brutal" type="submit">Create</button>
      </form>

      <div className="card brutal">
        <h3 style={{marginTop:0}}>Manage Quizzes</h3>
        <ul>
          {quizzes.map(q => (
            <li key={q.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #ddd'}}>
              <span>{q.title} — {q.difficulty}</span>
              <button className="btn brutal" onClick={()=>remove(q.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


