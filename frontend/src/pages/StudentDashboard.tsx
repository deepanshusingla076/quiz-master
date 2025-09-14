import { useEffect, useState } from 'react'
import axios from 'axios'
import { useWebSocket } from '../hooks/useWebSocket'

type Quiz = { id: number; title: string; difficulty: 'EASY'|'MEDIUM'|'HARD' }
type Result = { quizId: number; score: number }
type Question = { id: number; text: string; options: { id: number; text: string }[] }

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [takingQuiz, setTakingQuiz] = useState<{ quiz: Quiz; questions: Question[] } | null>(null)
  const { messages } = useWebSocket('/topic/leaderboard')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    try {
      // Use Promise.all to fetch data in parallel
      const [quizzesRes, resultsRes, leaderboardRes] = await Promise.all([
        axios.get('/api/quiz/available'),
        axios.get('/api/attempts/mine'),
        axios.get('/api/analytics/attempts')
      ])
      
      setQuizzes(quizzesRes.data)
      setResults(resultsRes.data)
      setLeaderboard(leaderboardRes.data.slice(0, 10))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }
  
  useEffect(() => { load() }, [])

  // Update leaderboard when new WebSocket messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Get the latest attempt from WebSocket
      const latestAttempt = messages[messages.length - 1]
      
      // Fetch updated leaderboard
      axios.get('/api/analytics/attempts')
        .then(response => {
          setLeaderboard(response.data.slice(0, 10))
        })
        .catch(error => {
          console.error('Error updating leaderboard:', error)
        })
    }
  }, [messages])

  async function attempt(quizId: number) {
    try {
      const meta = quizzes.find(q => q.id === quizId)
      if (!meta) {
        console.error('Quiz not found:', quizId)
        return
      }
      
      const r = await axios.get(`/api/quiz/${quizId}/questions`)
      setTakingQuiz({ quiz: meta, questions: r.data })
      setAnswers({})
    } catch (error) {
      console.error('Error loading quiz questions:', error)
      alert('Failed to load quiz questions. Please try again.')
    }
  }
  async function submitAttempt() {
    if (!takingQuiz) return
    
    // Validate all questions are answered
    const unansweredCount = takingQuiz.questions.length - Object.keys(answers).length
    if (unansweredCount > 0) {
      alert(`Please answer all questions before submitting. You have ${unansweredCount} unanswered questions.`)
      return
    }
    
    try {
      setSubmitting(true)
      const payload = {
        quizId: takingQuiz.quiz.id,
        answers: takingQuiz.questions.map(q => ({ 
          questionId: q.id, 
          optionId: answers[q.id] 
        }))
      }
      
      // Submit the attempt
      await axios.post('/api/attempts', payload)
      
      // Show success message
      alert('Quiz submitted successfully!')
      
      // Reset quiz state and reload data
      setTakingQuiz(null)
      setAnswers({})
      load()
    } catch (error) {
      console.error('Error submitting quiz:', error)
      const errorMessage = error.response?.data?.message || 'Failed to submit quiz. Please try again.'
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
    <div className="student-dashboard-grid">
      <div className="card brutal student-box">
        <h3 style={{marginTop:0, color: 'var(--accent)', borderBottom: '2px solid var(--muted)', paddingBottom: '10px'}}>Available Quizzes</h3>
        <ul className="quiz-list">
          {quizzes.map(q => (
            <li key={q.id} className="quiz-item">
              <div className="quiz-info">
                <span className="quiz-title">{q.title}</span>
                <span className="quiz-difficulty">{q.difficulty}</span>
              </div>
              <button className="btn brutal" onClick={()=>attempt(q.id)}>Attempt</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card brutal student-box">
        <h3 style={{marginTop:0, color: 'var(--accent)', borderBottom: '2px solid var(--muted)', paddingBottom: '10px'}}>My Results</h3>
        <ul className="results-list">
          {results.length > 0 ? results.map(r => (
            <li key={r.quizId} className="result-item">
              <span className="result-title">Quiz #{r.quizId}</span>
              <span className="result-score">{r.score}%</span>
            </li>
          )) : (
            <li className="no-results">No quiz attempts yet</li>
          )}
        </ul>
      </div>
      <div className="card brutal student-box leaderboard-container">
        <h3 style={{marginTop:0, color: 'var(--accent)', borderBottom: '2px solid var(--muted)', paddingBottom: '10px'}}>Live Leaderboard</h3>
        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <div><b>Student</b></div>
            <div><b>Quiz</b></div>
            <div><b>Score</b></div>
            <div><b>When</b></div>
          </div>
          {leaderboard.length > 0 ? leaderboard.map((a, index) => (
            <div key={index} className="leaderboard-row">
              <div>{a.studentName}</div>
              <div>{a.quizTitle}</div>
              <div className="leaderboard-score">{a.score}%</div>
              <div>{new Date(a.createdAt).toLocaleTimeString()}</div>
            </div>
          )) : (
            <div className="no-leaderboard">No attempts recorded yet</div>
          )}
        </div>
      </div>
    </div>

    {takingQuiz && (
      <div className="card brutal quiz-attempt">
        <h3 style={{marginTop:0, color: 'var(--accent)', borderBottom: '2px solid var(--muted)', paddingBottom: '10px'}}>
          Attempt: {takingQuiz.quiz.title}
        </h3>
        <div className="questions-container">
          {takingQuiz.questions.map(q => (
            <div key={q.id} className="card brutal question-card">
              <div className="question-text">{q.text}</div>
              <div className="options-container">
                {q.options.map(o => (
                  <label key={o.id} className={`option-label ${answers[q.id]===o.id ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      checked={answers[q.id]===o.id} 
                      onChange={()=>setAnswers(a=>({ ...a, [q.id]: o.id }))} 
                    /> 
                    <span className="option-text">{o.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="submit-container">
          <button 
            disabled={submitting || Object.keys(answers).length !== takingQuiz.questions.length} 
            className="btn brutal submit-btn" 
            onClick={submitAttempt}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
          {Object.keys(answers).length !== takingQuiz.questions.length && 
            <div className="answer-status">
              {Object.keys(answers).length} of {takingQuiz.questions.length} questions answered
            </div>
          }
        </div>
      </div>
    )}
    </>
  )
}


