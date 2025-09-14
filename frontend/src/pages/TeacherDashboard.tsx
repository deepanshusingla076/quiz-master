import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '../components/Modal'
import AIQuizGenerator from '../components/AIQuizGenerator'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

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
  const [aiPrompt, setAiPrompt] = useState('')
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  async function load() {
    try {
      const r = await axios.get('/api/quiz')
      setQuizzes(r.data)
      const s = await axios.get('/api/analytics/students')
      setStudents(s.data)
      const sum = await axios.get('/api/analytics/summary')
      setSummary(sum.data)
      const at = await axios.get('/api/analytics/attempts')
      setAttempts(at.data)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }
  
  useEffect(() => { load() }, [])

  async function createQuiz(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post('/api/quiz', { title, difficulty })
      setTitle('')
      setDifficulty('EASY')
      load()
    } catch (error) {
      console.error('Error creating quiz:', error)
    }
  }
  
  const handleQuizGenerated = async (questionBank: any) => {
    try {
      // First create a new quiz
      const quizResponse = await axios.post('/api/quiz', { 
        title: `AI Generated: ${questionBank.subject}`, 
        difficulty: questionBank.difficulty 
      })
      
      const quizId = quizResponse.data.id
      
      // Then add all the generated questions to the quiz
      const questionsToAdd = questionBank.questions.map((q: any) => ({
        text: q.text,
        options: q.options
      }))
      
      await axios.post(`/api/quiz/${quizId}/questions/batch`, questionsToAdd)
      
      // Refresh the quiz list
      load()
      setShowAIGenerator(false)
    } catch (error) {
      console.error('Error saving AI generated quiz:', error)
    }
  }

  async function openQuestions(quizId: number) {
    setEditingQuizId(quizId)
    try {
      const r = await axios.get(`/api/quiz/${quizId}/questions`)
      setQuestions(r.data || [])
      setCurrentQuestionIndex(0)
      setQuestionModalOpen(true)
    } catch (error) {
      console.error('Error loading questions:', error)
      setQuestions([])
      setQuestionModalOpen(true)
    }
  }

  function addQuestion() {
    const newQuestion: Question = {
      text: '',
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    }
    setQuestions(prev => [...prev, newQuestion])
    setCurrentQuestionIndex(questions.length)
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  function updateCurrentQuestion(updatedQuestion: Question) {
    setQuestions(prev => prev.map((q, i) => i === currentQuestionIndex ? updatedQuestion : q))
  }

  function deleteCurrentQuestion() {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter((_, i) => i !== currentQuestionIndex))
      if (currentQuestionIndex >= questions.length - 1) {
        setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
      }
    }
  }

  async function saveQuestions() {
    if (!editingQuizId) return
    try {
      await axios.put(`/api/quiz/${editingQuizId}/questions`, questions)
      setQuestionModalOpen(false)
      load()
    } catch (error) {
      console.error('Error saving questions:', error)
    }
  }

  async function generateWithAI() {
    if (!editingQuizId) return
    try {
      setAiBusy(true)
      const r = await axios.post(`/api/quiz/${editingQuizId}/ai-generate`, { 
        difficulty, 
        prompt: aiPrompt || 'Generate questions about general knowledge' 
      })
      setQuestions(r.data)
      setCurrentQuestionIndex(0)
      setAiPrompt('')
    } catch (error) {
      console.error('Error generating AI questions:', error)
      // Fallback to mock questions
      setQuestions([
        {
          text: 'What is the capital of France?',
          options: [
            { text: 'Paris', correct: true },
            { text: 'London', correct: false },
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false }
          ]
        },
        {
          text: 'What is 2 + 2?',
          options: [
            { text: '3', correct: false },
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false }
          ]
        }
      ])
      setCurrentQuestionIndex(0)
    } finally {
      setAiBusy(false)
    }
  }

  async function remove(id: number) {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`/api/quiz/${id}`)
        load()
      } catch (error) {
        console.error('Error deleting quiz:', error)
      }
    }
  }

  const currentQuestion = questions[currentQuestionIndex] || { text: '', options: [] }

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
        <button className="btn brutal" type="submit">Create Quiz</button>
        <button 
          type="button" 
          className="btn brutal" 
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          style={{marginLeft: '10px'}}
        >
          {showAIGenerator ? 'Hide AI Generator' : 'Use AI Generator'}
        </button>
      </form>
      
      {showAIGenerator && (
        <div className="ai-generator-container" style={{marginTop: '20px'}}>
          <AIQuizGenerator onQuizGenerated={handleQuizGenerated} />
        </div>
      )}

      <div className="card brutal">
        <h3 style={{marginTop:0}}>Manage Quizzes</h3>
        <div className="quiz-table">
          {quizzes.map(q => (
            <div key={q.id} className="quiz-row">
              <div className="quiz-info">
                <span className="quiz-title">{q.title}</span>
                <span className="quiz-difficulty">{q.difficulty}</span>
              </div>
              <div className="quiz-actions">
                <button className="btn brutal btn-small" onClick={()=>openQuestions(q.id)}>Edit Questions</button>
                <button className="btn brutal btn-small btn-danger" onClick={()=>remove(q.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{gridColumn:'1 / -1'}}>
        <AnalyticsDashboard />
      </div>
    </div>

    <Modal open={questionModalOpen} title="Edit Questions" onClose={()=>setQuestionModalOpen(false)}>
      <div className="question-controls">
        <div className="save-controls">
          <button className="btn brutal btn-primary" onClick={saveQuestions}>Save All Questions</button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="question-navigation">
          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="question-nav-buttons">
            <button 
              className="btn brutal btn-small" 
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>
            <button 
              className="btn brutal btn-small" 
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <div className="question-editor">
        {questions.length === 0 ? (
          <div className="no-questions">
            <p>No questions yet. Add a question or generate with AI.</p>
            <button className="btn brutal" onClick={addQuestion}>Add First Question</button>
          </div>
        ) : (
          <div className="question-card">
            <div className="question-header">
              <label>Question Text</label>
              <div className="question-actions">
                <button className="btn brutal btn-small btn-danger" onClick={deleteCurrentQuestion}>Delete</button>
              </div>
            </div>
            <input 
              value={currentQuestion.text} 
              onChange={e => updateCurrentQuestion({ ...currentQuestion, text: e.target.value })} 
              placeholder="Enter your question here..."
              className="question-input"
            />
            <div className="options-grid">
              {currentQuestion.options.map((opt, oi) => (
                <div key={oi} className="option-row">
                  <input 
                    value={opt.text} 
                    placeholder={`Option ${oi+1}`} 
                    onChange={e => {
                      const newOptions = [...currentQuestion.options]
                      newOptions[oi] = { ...opt, text: e.target.value }
                      updateCurrentQuestion({ ...currentQuestion, options: newOptions })
                    }} 
                    className="option-input"
                  />
                  <label className="correct-label">
                    <input 
                      type="radio" 
                      name={`correct-${currentQuestionIndex}`}
                      checked={opt.correct} 
                      onChange={() => {
                        const newOptions = currentQuestion.options.map((o, i) => ({ 
                          ...o, 
                          correct: i === oi 
                        }))
                        updateCurrentQuestion({ ...currentQuestion, options: newOptions })
                      }} 
                    /> 
                    Correct
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="question-actions-bottom">
        <button className="btn brutal" onClick={addQuestion}>Add New Question</button>
      </div>
    </Modal>
    </>
  )
}