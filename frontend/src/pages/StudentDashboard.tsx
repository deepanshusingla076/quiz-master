import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Quiz, QuizAttempt, Question, QuizSubmissionRequest } from '../types'
import { API_CONFIG } from '../config/api'
import axios from 'axios'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])
  const [myAttempts, setMyAttempts] = useState<QuizAttempt[]>([])
  const [takingQuiz, setTakingQuiz] = useState<{ quiz: Quiz; questions: Question[] } | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    pendingResults: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      if (!user?.groupSection) {
        console.error('User group section not found')
        setLoading(false)
        return
      }

      // Fetch available quizzes for student's group
      const quizzesResponse = await axios.get(API_CONFIG.ENDPOINTS.QUIZ.BY_GROUP(user.groupSection))
      setAvailableQuizzes(quizzesResponse.data)

      // Fetch student's attempts (only visible ones)
      const attemptsResponse = await axios.get(API_CONFIG.ENDPOINTS.RESULTS.MY_ATTEMPTS)
      const attempts = attemptsResponse.data
      setMyAttempts(attempts)

      // Calculate statistics
      const completedAttempts = attempts.filter((attempt: QuizAttempt) => attempt.status === 'SUBMITTED' || attempt.status === 'PUBLISHED')
      const visibleResults = attempts.filter((attempt: QuizAttempt) => attempt.visibleToStudent && attempt.percentage !== undefined)
      const pendingResults = attempts.filter((attempt: QuizAttempt) => !attempt.visibleToStudent && attempt.status === 'SUBMITTED')
      const averageScore = visibleResults.length > 0 
        ? visibleResults.reduce((sum: number, attempt: QuizAttempt) => sum + (attempt.percentage || 0), 0) / visibleResults.length
        : 0

      setStats({
        totalQuizzes: quizzesResponse.data.length,
        completedQuizzes: completedAttempts.length,
        averageScore,
        pendingResults: pendingResults.length
      })
    } catch (backendError) {
      console.error('Error fetching dashboard data from backend:', backendError);
      setAvailableQuizzes([]);
      setMyAttempts([]);
      setStats({
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        pendingResults: 0
      });
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = async (quiz: Quiz) => {
    try {
      // Check if already attempted using backend API
      const checkResponse = await axios.get(API_CONFIG.ENDPOINTS.RESULTS.CHECK_ATTEMPTED(quiz.id!))
      if (checkResponse.data.attempted) {
        alert('You have already attempted this quiz! Multiple attempts are not allowed.')
        return
      }

      // Fetch quiz questions
      const response = await axios.get(API_CONFIG.ENDPOINTS.QUIZ.QUESTIONS(quiz.id))
      setTakingQuiz({ quiz, questions: response.data })
      setAnswers({})
      setStartTime(new Date())
    } catch (error) {
      console.error('Error starting quiz:', error)
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        alert('You have already attempted this quiz! Multiple attempts are not allowed.')
      } else {
        alert('Failed to start quiz. Please try again.')
      }
    }
  }

  const submitQuiz = async () => {
    if (!takingQuiz || !startTime || !takingQuiz.quiz.id) return

    setSubmitting(true)
    try {
      const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / (1000 * 60))
      const submission: QuizSubmissionRequest = {
        quizId: takingQuiz.quiz.id,
        timeTakenMinutes: timeTaken,
        answers: takingQuiz.questions.map(q => ({
          questionId: q.id!,
          answer: answers[q.id!] || ''
        }))
      }

      const response = await axios.post(API_CONFIG.ENDPOINTS.RESULTS.SUBMIT, submission)
      
      if (response.status === 200) {
        alert('Quiz submitted successfully!')
        setTakingQuiz(null)
        setAnswers({})
        setStartTime(null)
        fetchDashboardData() // Refresh attempts
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('You have already attempted this quiz! Multiple submissions are not allowed.')
        } else if (error.response?.data?.error) {
          alert(`Submission failed: ${error.response.data.error}`)
        } else {
          alert('Failed to submit quiz. Please try again.')
        }
      } else {
        alert('Failed to submit quiz. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  // Timer component
  const Timer = ({ quiz, startTime, onTimeUp }: { quiz: Quiz; startTime: Date; onTimeUp: () => void }) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => {
      const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      return Math.max(0, (quiz.timeLimitMinutes || 60) * 60 - elapsed)
    })

    useEffect(() => {
      if (timeLeft <= 0) {
        onTimeUp()
        return
      }

      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }, [timeLeft, onTimeUp])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
      <div className={`flex items-center px-4 py-2 rounded-lg font-medium ${
        timeLeft < 300 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-blue-100 text-blue-800'
      }`}>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Time Left: {minutes}:{seconds.toString().padStart(2, '0')}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <div className="text-xl font-medium text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (takingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Quiz Header */}
        <div className="bg-white shadow-lg border-b sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{takingQuiz.quiz.title}</h1>
                <p className="text-gray-600 mt-1">{takingQuiz.quiz.description}</p>
              </div>
              {startTime && (
                <Timer 
                  quiz={takingQuiz.quiz} 
                  startTime={startTime} 
                  onTimeUp={submitQuiz}
                />
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {takingQuiz.questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Question {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">{question.marks} marks</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.text}</h3>
                
                {question.type === 'MULTIPLE_CHOICE' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-300">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.text}
                          checked={answers[question.id!] === option.text}
                          onChange={(e) => handleAnswerChange(question.id!, e.target.value)}
                          className="mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-gray-900 flex-1">{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === 'TRUE_FALSE' && (
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-300">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="true"
                        checked={answers[question.id!] === 'true'}
                        onChange={(e) => handleAnswerChange(question.id!, e.target.value)}
                        className="mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900 flex-1">True</span>
                    </label>
                    <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-300">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="false"
                        checked={answers[question.id!] === 'false'}
                        onChange={(e) => handleAnswerChange(question.id!, e.target.value)}
                        className="mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900 flex-1">False</span>
                    </label>
                  </div>
                )}
                
                {question.type === 'FILL_IN_BLANK' && (
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your answer here..."
                    value={answers[question.id!] || ''}
                    onChange={(e) => handleAnswerChange(question.id!, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              className="px-8 py-4 text-lg font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header
      <div className="header">
        <div className="header-left">
          <h1 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 32, letterSpacing: 2, marginRight: 16 }}>
            QUIZ//PLATFORM
          </h1>
          <span className="user-role">STUDENT</span>
          <div style={{ marginLeft: 16, fontSize: 12, fontWeight: 600 }}>
            Group: {user?.groupSection}
          </div>
        </div>
        <div className="header-right">
          <button className="btn btn-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="btn" style={{ marginLeft: 12 }} onClick={logout}>Logout</button>
        </div>
      </div> */}

      {/* Statistics Cards */}
      <div className="card brutal" style={{ marginTop: 32 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Your Statistics</div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.totalQuizzes}</div>
            <div style={{ fontSize: 12 }}>Available Quizzes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.completedQuizzes}</div>
            <div style={{ fontSize: 12 }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.averageScore.toFixed(1)}%</div>
            <div style={{ fontSize: 12 }}>Average Score</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.pendingResults}</div>
            <div style={{ fontSize: 12 }}>Pending Results</div>
          </div>
        </div>
      </div>

      {/* Quiz Management Section */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
        {/* Available Quizzes */}
        <div className="card brutal" style={{ minHeight: 400 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Available Quizzes ({availableQuizzes.length})</div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {availableQuizzes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>No quizzes available</div>
                <div style={{ fontSize: 12 }}>No quizzes assigned to your group yet.</div>
              </div>
            ) : (
              availableQuizzes.map((quiz) => {
                const attemptExists = myAttempts.some(attempt => attempt.quizId === quiz.id)
                return (
                  <div
                    key={quiz.id}
                    className="quiz-row brutal"
                    style={{ marginBottom: 8 }}
                  >
                    <div className="quiz-info">
                      <div className="quiz-title">{quiz.title}</div>
                      <div className="quiz-difficulty">{quiz.difficulty}</div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>{quiz.totalMarks} points | {quiz.timeLimitMinutes} min</div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{quiz.description}</p>
                    </div>
                    <div className="quiz-actions">
                      {attemptExists ? (
                        <span style={{ 
                          fontSize: 14, 
                          fontWeight: 700, 
                          color: '#28a745',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <button className="btn btn-primary" onClick={() => startQuiz(quiz)}>
                          Start Quiz
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Quiz History */}
        <div className="card brutal" style={{ minHeight: 400 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>My Quiz History ({myAttempts.length})</div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {myAttempts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>No quiz attempts yet</div>
                <div style={{ fontSize: 12 }}>Your completed quizzes will appear here.</div>
              </div>
            ) : (
              myAttempts.map((attempt) => {
                const quiz = availableQuizzes.find(q => q.id === attempt.quizId)
                return (
                  <div key={attempt.id} className="quiz-row brutal" style={{ marginBottom: 8 }}>
                    <div className="quiz-info">
                      <div className="quiz-title">{quiz?.title || 'Unknown Quiz'}</div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>
                        {new Date(attempt.submittedAt || attempt.startedAt).toLocaleDateString()}
                        {attempt.timeTakenMinutes && ` • ${attempt.timeTakenMinutes} min`}
                      </div>
                      {attempt.visibleToStudent ? (
                        <div style={{ fontSize: 14, fontWeight: 700 }}>
                          {attempt.obtainedMarks}/{attempt.totalMarks} ({attempt.percentage?.toFixed(1)}%)
                        </div>
                      ) : attempt.status === 'SUBMITTED' ? (
                        <div style={{ fontSize: 12, color: '#ffc107' }}>Results pending publication</div>
                      ) : null}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: 12, 
                        color: attempt.status === 'PUBLISHED' ? '#28a745' : attempt.status === 'SUBMITTED' ? '#ffc107' : '#6c757d' 
                      }}>
                        {attempt.status}
                      </div>
                      {attempt.visibleToStudent && (
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: 14, 
                          color: (attempt.percentage || 0) >= 80 ? '#28a745' : (attempt.percentage || 0) >= 60 ? '#ffc107' : '#dc3545' 
                        }}>
                          {getGrade(attempt.percentage || 0)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for grading
function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B+'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C+'
  if (percentage >= 40) return 'C'
  return 'F'
}

function getGradeClass(percentage: number): string {
  if (percentage >= 80) return 'bg-green-100 text-green-800'
  if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
  if (percentage >= 40) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}