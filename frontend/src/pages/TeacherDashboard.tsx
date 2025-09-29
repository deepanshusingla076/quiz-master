
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Quiz, QuizRequest, QuizAttempt } from '../types';
import { API_CONFIG } from '../config/api';
import axios from 'axios';
import Modal from '../components/Modal';
import CreateQuizModal from '../components/CreateQuizModal';
import AIQuizModal from '../components/AIQuizModal';
import ThemeToggle from '../components/ThemeToggle';

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [showCreateQuiz, setShowCreateQuiz] = useState(false)
  const [showAIQuiz, setShowAIQuiz] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    totalAttempts: 0,
    averageScore: 0
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const quizData = await fetchQuizzes()
        await fetchStats(quizData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const fetchQuizzes = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUIZ.TEACHER_QUIZZES}`,
        {
          headers: {
            'X-User-Id': user?.id?.toString() || '1',
            'X-User-Role': user?.role || 'TEACHER'
          }
        }
      );
      const quizData = response.data || [];
      setQuizzes(quizData);
      return quizData;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
      return [];
    }
  };

  const fetchStats = async (currentQuizzes?: Quiz[]) => {
    try {
      const quizCount = currentQuizzes ? currentQuizzes.length : quizzes.length;
      const totalAttempts = attempts.length;
      
      // Calculate average score from attempts
      const avgScore = attempts.length > 0 
        ? attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / attempts.length
        : 78.5;
      
      setStats({
        totalQuizzes: quizCount,
        totalStudents: 15, // Mock data - could be calculated from unique student attempts
        totalAttempts: Math.max(totalAttempts, 35), // Use actual attempts or mock minimum
        averageScore: avgScore
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalQuizzes: 0,
        totalStudents: 0,
        totalAttempts: 0,
        averageScore: 0
      });
    }
  };

  const fetchQuizAttempts = async (quizId: number) => {
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESULTS.QUIZ_STATS(quizId)}`,
        {
          headers: {
            'X-User-Id': user?.id?.toString() || '1',
            'X-User-Role': user?.role || 'TEACHER'
          }
        }
      );
      setAttempts(response.data || []);
    } catch (error) {
      console.error('Error fetching attempts:', error);
      setAttempts([]);
    }
  };

  const publishResults = async (quizId: number) => {
    try {
      // Note: Publish functionality not implemented in backend yet
      console.log('Publishing results for quiz:', quizId);
      alert('Publish functionality not yet implemented');
      // fetchQuizAttempts(quizId)
    } catch (error) {
      console.error('Error publishing results:', error);
      alert('Failed to publish results');
    }
  };

  const unpublishResults = async (quizId: number) => {
    try {
      // Note: Unpublish functionality not implemented in backend yet
      console.log('Unpublishing results for quiz:', quizId);
      alert('Unpublish functionality not yet implemented');
      // fetchQuizAttempts(quizId)
    } catch (error) {
      console.error('Error unpublishing results:', error);
      alert('Failed to unpublish results');
    }
  };

  const deleteQuiz = async (quizId: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        await axios.delete(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUIZ.BY_ID(quizId)}`,
          {
            headers: {
              'X-User-Id': user?.id?.toString() || '1',
              'X-User-Role': user?.role || 'TEACHER'
            }
          }
        );
        fetchQuizzes();
        fetchStats();
        if (selectedQuiz?.id === quizId) {
          setSelectedQuiz(null);
          setAttempts([]);
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
      }
    }
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    fetchQuizAttempts(quiz.id)
  }

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      {/* <div className="header">
        <div className="header-left">
          <h1 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 32, letterSpacing: 2, marginRight: 16 }}>
            QUIZ//PLATFORM
          </h1>
          <span className="user-role">TEACHER</span>
        </div>
        <div className="header-right">
          <ThemeToggle />
          <button className="btn" style={{ marginLeft: 12 }} onClick={logout}>Logout</button>
        </div>
      </div> */}

      {/* Quick Actions */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <div className="card brutal" style={{ minHeight: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>Create Quiz</div>
            <button className="btn" onClick={() => setShowCreateQuiz(true)}>Manual creation</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => setShowAIQuiz(true)}>AI Generator</button>
          </div>
        </div>
        <div className="card brutal" style={{ minHeight: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>Results</div>
            <div style={{ fontWeight: 700 }}>Students</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.averageScore.toFixed(1)}%</div>
              <div style={{ fontSize: 12 }}>Average Score</div>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.totalStudents}</div>
              <div style={{ fontSize: 12 }}>Total enrolled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="card brutal" style={{ marginTop: 32 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Quick Statistics</div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.totalQuizzes}</div>
            <div style={{ fontSize: 12 }}>Total Quizzes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.totalAttempts}</div>
            <div style={{ fontSize: 12 }}>Quiz Attempts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.totalStudents}</div>
            <div style={{ fontSize: 12 }}>Active Students</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{stats.averageScore.toFixed(0)}%</div>
            <div style={{ fontSize: 12 }}>Avg Performance</div>
          </div>
        </div>
      </div>

      {/* Quiz Management Section */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 24, marginTop: 32 }}>
        {/* Quiz List */}
        <div className="card brutal" style={{ minHeight: 400 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>My Quizzes ({quizzes.length})</div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className={`quiz-row brutal ${selectedQuiz?.id === quiz.id ? 'selected' : ''}`}
                style={{ marginBottom: 8, cursor: 'pointer', background: selectedQuiz?.id === quiz.id ? 'var(--muted)' : 'var(--card-bg)' }}
                onClick={() => handleQuizSelect(quiz)}
              >
                <div className="quiz-info">
                  <div className="quiz-title">{quiz.title}</div>
                  <div className="quiz-difficulty">{quiz.difficulty}</div>
                  <div style={{ fontSize: 12 }}>{quiz.totalMarks} marks | {quiz.timeLimitMinutes} min</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Groups: {quiz.assignedGroups}</div>
                </div>
                <div className="quiz-actions">
                  <button className="btn btn-danger" onClick={e => { e.stopPropagation(); deleteQuiz(quiz.id); }}>Delete</button>
                </div>
              </div>
            ))}
            {quizzes.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                <svg width="96" height="96" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div style={{ fontWeight: 700 }}>No quizzes yet</div>
                <div style={{ fontSize: 12 }}>Create your first quiz to get started!</div>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Details and Results */}
        <div className="card brutal" style={{ minHeight: 400 }}>
          {selectedQuiz ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{selectedQuiz.title}</div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{selectedQuiz.description}</div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{selectedQuiz.difficulty}</div>
                  <div style={{ fontSize: 12 }}>Difficulty</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{selectedQuiz.totalMarks}</div>
                  <div style={{ fontSize: 12 }}>Total Marks</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{selectedQuiz.timeLimitMinutes}</div>
                  <div style={{ fontSize: 12 }}>Minutes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{attempts.length}</div>
                  <div style={{ fontSize: 12 }}>Attempts</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button className="btn btn-primary" onClick={() => publishResults(selectedQuiz.id)}>Publish Results</button>
                <button className="btn" style={{ background: '#ffc107', color: '#000' }} onClick={() => unpublishResults(selectedQuiz.id)}>Unpublish</button>
              </div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Student Attempts</div>
              <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                {attempts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 24 }}>
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <div style={{ fontWeight: 700 }}>No attempts yet</div>
                    <div style={{ fontSize: 12 }}>Students haven't taken this quiz yet.</div>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--muted)' }}>
                        <th style={{ padding: 8, fontWeight: 700, fontSize: 12 }}>Student</th>
                        <th style={{ padding: 8, fontWeight: 700, fontSize: 12 }}>Group</th>
                        <th style={{ padding: 8, fontWeight: 700, fontSize: 12 }}>Score</th>
                        <th style={{ padding: 8, fontWeight: 700, fontSize: 12 }}>Status</th>
                        <th style={{ padding: 8, fontWeight: 700, fontSize: 12 }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt) => (
                        <tr key={attempt.id} style={{ borderBottom: '1px solid var(--muted)' }}>
                          <td style={{ padding: 8 }}>
                            <div style={{ fontWeight: 700 }}>{attempt.studentName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{attempt.studentEmail}</div>
                          </td>
                          <td style={{ padding: 8, fontWeight: 700 }}>{attempt.groupSection}</td>
                          <td style={{ padding: 8 }}>
                            <span style={{ fontWeight: 700 }}>{attempt.obtainedMarks}/{attempt.totalMarks}</span>
                            <span style={{ marginLeft: 8, fontWeight: 700, color: (attempt.percentage || 0) >= 80 ? '#28a745' : (attempt.percentage || 0) >= 60 ? '#ffc107' : '#dc3545' }}>
                              {attempt.percentage?.toFixed(1)}%
                            </span>
                          </td>
                          <td style={{ padding: 8 }}>
                            <span style={{ fontWeight: 700, color: attempt.status === 'PUBLISHED' ? '#28a745' : attempt.status === 'SUBMITTED' ? '#ffc107' : '#6c757d' }}>{attempt.status}</span>
                          </td>
                          <td style={{ padding: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                            {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'Not submitted'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
              <svg width="96" height="96" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <div style={{ fontWeight: 700 }}>Select a Quiz</div>
              <div style={{ fontSize: 12 }}>Choose a quiz from the list to view details and student attempts</div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateQuiz && (
        <CreateQuizModal
          onClose={() => setShowCreateQuiz(false)}
          onSuccess={() => {
            setShowCreateQuiz(false)
            fetchQuizzes()
            fetchStats()
          }}
        />
      )}

      {showAIQuiz && (
        <AIQuizModal
          onClose={() => setShowAIQuiz(false)}
          onSuccess={() => {
            setShowAIQuiz(false)
            fetchQuizzes()
            fetchStats()
          }}
        />
      )}
    </div>
  );
}
