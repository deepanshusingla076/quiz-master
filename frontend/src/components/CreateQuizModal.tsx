import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { API_CONFIG } from '../config/api';
import axios from 'axios';
import Modal from './Modal';

type CreateQuizModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateQuizModal({ onClose, onSuccess }: CreateQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    timeLimitMinutes: 30,
    assignedGroups: '',
    questions: [
      {
        questionText: '',
        marks: 1,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]
  });

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          marks: 1,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? {
              ...q,
              options: q.options.map((opt, oi) => 
                oi === optionIndex ? { ...opt, [field]: value } : opt
              )
            }
          : q
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform form data to match backend expected format
      const quizData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        timeLimitMinutes: formData.timeLimitMinutes,
        totalMarks: formData.questions.reduce((sum, q) => sum + q.marks, 0),
        assignedGroups: formData.assignedGroups ? [formData.assignedGroups] : [],
        questions: formData.questions.map(q => ({
          text: q.questionText,
          type: 'MULTIPLE_CHOICE',
          marks: q.marks,
          options: q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        }))
      };

      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUIZ.CREATE}`,
        quizData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user?.id?.toString() || '1',
            'X-User-Role': user?.role || 'TEACHER'
          }
        }
      );

      if (response.data) {
        alert('Quiz created successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} title="Create New Quiz" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ maxHeight: '60vh', overflow: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Quiz Title</label>
          <input 
            className="input brutal"
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Description</label>
          <textarea 
            className="input brutal"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            style={{ width: '100%' }}
          />
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Difficulty</label>
            <select 
              className="input brutal"
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Time Limit (min)</label>
            <input 
              className="input brutal"
              type="number" 
              value={formData.timeLimitMinutes}
              onChange={(e) => setFormData(prev => ({ ...prev, timeLimitMinutes: parseInt(e.target.value) }))}
              min="1"
            />
          </div>
          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Assigned Groups</label>
            <input 
              className="input brutal"
              type="text" 
              value={formData.assignedGroups}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedGroups: e.target.value }))}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ fontWeight: 700 }}>Questions</label>
            <button type="button" className="btn" onClick={addQuestion}>Add Question</button>
          </div>

          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="card brutal" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Question {qIndex + 1}</label>
                <textarea 
                  className="input brutal"
                  value={question.questionText}
                  onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                  placeholder="Enter question text..."
                  rows={2}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Marks</label>
                <input 
                  className="input brutal"
                  type="number" 
                  value={question.marks}
                  onChange={(e) => updateQuestion(qIndex, 'marks', parseInt(e.target.value))}
                  min="1"
                  style={{ width: 100 }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>Options</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <input 
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={option.isCorrect}
                      onChange={() => {
                        // Set all options to false, then set this one to true
                        const newOptions = question.options.map((opt, i) => ({ ...opt, isCorrect: i === oIndex }));
                        updateQuestion(qIndex, 'options', newOptions);
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <input 
                      className="input brutal"
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      style={{ flex: 1 }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </Modal>
  );
}