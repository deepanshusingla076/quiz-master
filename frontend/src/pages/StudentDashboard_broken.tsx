import React, { useState, u      // Fetch available quizzes for student's group
      const quizzesResponse = await axios.get(API_CONFIG.ENDPOINTS.QUIZ.BY_GROUP(user.groupSection))
      setAvailableQuizzes(quizzesResponse.data)

      // Fetch student's attempts (only visible ones)
      const attemptsResponse = await axios.get(API_CONFIG.ENDPOINTS.RESULTS.STUDENT_ATTEMPTS)ct } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Quiz, QuizAttempt, Question, QuizSubmissionRequest } from '../types'
import { API_CONFIG } from '../config/api'
import axios from 'axios'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])
  const [myAttempts, setMyAttempts] = useState<QuizAttempt[]>([])
  const [takingQuiz, setTakingQuiz] = useState<{ quiz: Quiz; questions: Question[] } | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      if (!user?.groupSection) {
        console.error('User group section not found')
        return
      }

      // Fetch available quizzes for student's group
      const quizzesResponse = await axios.get(`/api/questionbank/quizzes/student?groupSection=${user.groupSection}`)
      setAvailableQuizzes(quizzesResponse.data)

      // Fetch student's attempts (only visible ones)
      const attemptsResponse = await axios.get('/api/results/attempts/student?visibleOnly=true')
      setMyAttempts(attemptsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startQuizAttempt = async (quiz: Quiz) => {
    try {
      // Check if already attempted
      const existingAttempt = myAttempts.find(attempt => attempt.quizId === quiz.id)
      if (existingAttempt) {
        alert('You have already attempted this quiz. Only one attempt is allowed.')
        return
      }

      // Start attempt
      await axios.post(`/api/results/attempts/start/${quiz.id}?studentName=${user?.name}&groupSection=${user?.groupSection}`)
      
      // Fetch quiz questions
      const questionsResponse = await axios.get(`/api/questionbank/quizzes/${quiz.id}/questions`)
      
      setTakingQuiz({ quiz, questions: questionsResponse.data })
      setAnswers({})
      setStartTime(new Date())
    } catch (error) {
      console.error('Error starting quiz:', error)
      alert('Failed to start quiz. Please try again.')
    }
  }

  const submitQuiz = async () => {
    if (!takingQuiz || !startTime) return

    try {
      setSubmitting(true)

      const timeTakenMinutes = Math.floor((new Date().getTime() - startTime.getTime()) / (1000 * 60))

      const submission: QuizSubmissionRequest = {
        quizId: takingQuiz.quiz.id,
        answers: takingQuiz.questions.map(q => ({
          questionId: q.id!,
          answer: answers[q.id!] || ''
        })),
        timeTakenMinutes
      }

      await axios.post('/api/results/attempts/submit', submission)
      
      alert('Quiz submitted successfully! Results will be visible once published by your teacher.')
      setTakingQuiz(null)
      setAnswers({})
      setStartTime(null)
      
      // Refresh dashboard data
      fetchDashboardData()
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Failed to submit quiz. Please try again.')
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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  }

  if (takingQuiz) {
    return <QuizAttemptView 
      quiz={takingQuiz.quiz}
      questions={takingQuiz.questions}
      answers={answers}
      onAnswerChange={handleAnswerChange}
      onSubmit={submitQuiz}
      onCancel={() => {
        if (window.confirm('Are you sure you want to cancel this quiz attempt?')) {
          setTakingQuiz(null)
          setAnswers({})
          setStartTime(null)
        }
      }}
      submitting={submitting}
      startTime={startTime}
    />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.name} ({user?.groupSection})</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Quizzes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Available Quizzes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {availableQuizzes.map((quiz) => {
                const hasAttempted = myAttempts.some(attempt => attempt.quizId === quiz.id)
                return (
                  <div key={quiz.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Difficulty: {quiz.difficulty}</span>
                          <span>Time: {quiz.timeLimitMinutes} min</span>
                          <span>Marks: {quiz.totalMarks}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {hasAttempted ? (
                          <span className="inline-flex px-3 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md">
                            Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => startQuizAttempt(quiz)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Start Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {availableQuizzes.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No quizzes available for your group yet.
                </div>
              )}
            </div>
          </div>

          {/* Quiz History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quiz History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {myAttempts.map((attempt) => {
                const quiz = availableQuizzes.find(q => q.id === attempt.quizId)
                return (
                  <div key={attempt.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Quiz #{attempt.quizId} {quiz?.title && `- ${quiz.title}`}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'In Progress'}
                        </p>
                        {attempt.timeTakenMinutes && (
                          <p className="text-sm text-gray-500">
                            Time taken: {attempt.timeTakenMinutes} minutes
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {attempt.visibleToStudent && (
                          <div className="text-lg font-semibold text-gray-900">
                            {attempt.obtainedMarks}/{attempt.totalMarks}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {attempt.visibleToStudent ? `${attempt.percentage?.toFixed(1)}%` : 'Results pending'}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attempt.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800'
                            : attempt.status === 'SUBMITTED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {attempt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {myAttempts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No quiz attempts yet. Start with your first quiz!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quiz Attempt Component
function QuizAttemptView({ 
  quiz, 
  questions, 
  answers, 
  onAnswerChange, 
  onSubmit, 
  onCancel, 
  submitting,
  startTime
}: {
  quiz: Quiz
  questions: Question[]
  answers: Record<number, string>
  onAnswerChange: (questionId: number, answer: string) => void
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
  startTime: Date | null
}) {
  const [timeLeft, setTimeLeft] = useState<number>(quiz.timeLimitMinutes! * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        const remaining = Math.max(0, (quiz.timeLimitMinutes! * 60) - elapsed)
        setTimeLeft(remaining)
        
        if (remaining === 0) {
          onSubmit() // Auto-submit when time runs out
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, quiz.timeLimitMinutes, onSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                {answeredCount} of {totalQuestions} questions answered
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-500">Time remaining</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Question {index + 1} ({question.marks} marks)
                </h3>
                <p className="text-gray-700 mt-2">{question.text}</p>
              </div>

              {question.type === 'MULTIPLE_CHOICE' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.text}
                        checked={answers[question.id!] === option.text}
                        onChange={(e) => onAnswerChange(question.id!, e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'TRUE_FALSE' && (
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="True"
                      checked={answers[question.id!] === 'True'}
                      onChange={(e) => onAnswerChange(question.id!, e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">True</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="False"
                      checked={answers[question.id!] === 'False'}
                      onChange={(e) => onAnswerChange(question.id!, e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">False</span>
                  </label>
                </div>
              )}

              {question.type === 'FILL_IN_BLANK' && (
                <input
                  type="text"
                  value={answers[question.id!] || ''}
                  onChange={(e) => onAnswerChange(question.id!, e.target.value)}
                  placeholder="Enter your answer"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Questions answered: {answeredCount} of {totalQuestions}
              </p>
              {answeredCount < totalQuestions && (
                <p className="text-sm text-yellow-600">
                  ⚠️ You have unanswered questions
                </p>
              )}
            </div>
            <div className="space-x-4">
              <button
                onClick={onCancel}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}