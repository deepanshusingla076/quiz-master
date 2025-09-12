import { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '../components/Modal'

type Quiz = { id: number; title: string; difficulty: 'EASY'|'MEDIUM'|'HARD' }
type Question = { id?: number; text: string; options: { text: string; correct: boolean }[] }

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<'EASY'|'MEDIUM'|'HARD'>('EASY')
  const [students, setStudents] = useState<any[]>([])
  const [summary, setSummary] = useState<any | null>(null)
  const [attempts, setAttempts] = useState<any[]>([])
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [aiBusy, setAiBusy] = useState(false)

  async function load() {
    const r = await axios.get('/api/quizzes')
    setQuizzes(r.data)
    const s = await axios.get('/api/analytics/students')
    setStudents(s.data)
    const sum = await axios.get('/api/analytics/summary')
    setSummary(sum.data)
    const at = await axios.get('/api/analytics/attempts')
    setAttempts(at.data)
  }
  useEffect(() => { load() }, [])

  async function createQuiz(e: React.FormEvent) {
    e.preventDefault()
    await axios.post('/api/quizzes', { title, difficulty })
    setTitle(''); setDifficulty('EASY'); load()
  }
  async function openQuestions(quizId: number) {
    setEditingQuizId(quizId)
    const r = await axios.get(`/api/quizzes/${quizId}/questions`)
    setQuestions(r.data || [])
    setQuestionModalOpen(true)
  }
  function addQuestion() {
    setQuestions(qs => [...qs, { text: '', options: [
      { text: '', correct: true },
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false }
    ] }])
  }
  async function saveQuestions() {
    if (!editingQuizId) return
    await axios.put(`/api/quizzes/${editingQuizId}/questions`, questions)
    setQuestionModalOpen(false)
  }
  async function generateWithAI() {
    if (!editingQuizId) return
    try {
      setAiBusy(true)
      const r = await axios.post(`/api/quizzes/${editingQuizId}/ai-generate`, { difficulty })
      setQuestions(r.data)
    } finally {
      setAiBusy(false)
    }
  }
  async function remove(id: number) {
    await axios.delete(`/api/quizzes/${id}`); load()
  }

  return (
    <>
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
              <div style={{display:'flex', gap:8}}>
                <button className="btn brutal" onClick={()=>openQuestions(q.id)}>Questions</button>
                <button className="btn brutal" onClick={()=>remove(q.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card brutal" style={{gridColumn:'1 / -1'}}>
        <h3 style={{marginTop:0}}>Students</h3>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
          <div><b>Name</b></div><div><b>Attempts</b></div><div><b>Avg Score</b></div><div><b>Id</b></div>
          {students.map(s => (
            <>
              <div>{s.name}</div>
              <div>{s.attempts}</div>
              <div>{Math.round(s.avgScore)}</div>
              <div>{s.studentId}</div>
            </>
          ))}
        </div>
      </div>

      <div className="card brutal" style={{gridColumn:'1 / -1'}}>
        <h3 style={{marginTop:0}}>Analytics</h3>
        {summary && (
          <div style={{display:'flex', gap:24}}>
            <div><b>Attempts</b><div>{summary.attemptCount}</div></div>
            <div><b>Avg</b><div>{Math.round(summary.avgScore)}</div></div>
            <div><b>Best</b><div>{summary.maxScore}</div></div>
            <div><b>Worst</b><div>{summary.minScore}</div></div>
          </div>
        )}
        <h4>Recent Attempts</h4>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
          <div><b>Student</b></div><div><b>Quiz</b></div><div><b>Score</b></div><div><b>Time</b></div>
          {attempts.map(a => (
            <>
              <div>{a.studentName}</div>
              <div>{a.quizTitle}</div>
              <div>{a.score}</div>
              <div>{new Date(a.createdAt).toLocaleString()}</div>
            </>
          ))}
        </div>
      </div>
    </div>

    <Modal open={questionModalOpen} title="Edit Questions" onClose={()=>setQuestionModalOpen(false)}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <button className="btn brutal" onClick={addQuestion}>Add Question</button>
        <div style={{display:'flex', gap:8}}>
          <button disabled={aiBusy} className="btn brutal" onClick={generateWithAI}>{aiBusy ? 'Generating…' : 'Generate with AI'}</button>
          <button className="btn brutal" onClick={saveQuestions}>Save</button>
        </div>
      </div>
      <div className="grid" style={{gridTemplateColumns:'1fr'}}>
        {questions.map((q, qi) => (
          <div key={qi} className="card brutal" style={{marginBottom:12}}>
            <label>Question</label>
            <input value={q.text} onChange={e=>{
              const v = e.target.value; setQuestions(prev => prev.map((qq, i)=> i===qi ? { ...qq, text: v } : qq))
            }} />
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
              {q.options.map((opt, oi) => (
                <div key={oi} style={{display:'flex', gap:8, alignItems:'center'}}>
                  <input value={opt.text} placeholder={`Option ${oi+1}`} onChange={e=>{
                    const v = e.target.value; setQuestions(prev => prev.map((qq, i)=> i===qi ? { ...qq, options: qq.options.map((oo, j)=> j===oi ? { ...oo, text: v } : oo) } : qq))
                  }} />
                  <label style={{fontSize:12}}>
                    <input type="checkbox" checked={opt.correct} onChange={e=>{
                      const checked = e.target.checked
                      setQuestions(prev => prev.map((qq, i)=> i===qi ? { ...qq, options: qq.options.map((oo, j)=> ({ ...oo, correct: j===oi ? checked : false })) } : qq))
                    }} /> Correct
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
    </>
  )
}


