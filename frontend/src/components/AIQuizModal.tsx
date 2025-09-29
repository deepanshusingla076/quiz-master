import React, { useState } from 'react';
import { API_CONFIG } from '../config/api';
import axios from 'axios';
import Modal from './Modal';

type AIQuizModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AIQuizModal({ onClose, onSuccess }: AIQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'MEDIUM',
    numberOfQuestions: 5,
    timeLimitMinutes: 30,
    assignedGroups: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform form data to match backend expected format
      const aiRequestData = {
        subject: formData.topic,
        difficulty: formData.difficulty,
        numberOfQuestions: formData.numberOfQuestions
      };

      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AI.GENERATE}`,
        aiRequestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user?.id?.toString() || '1',
            'X-User-Role': user?.role || 'TEACHER'
          }
        }
      );

      if (response.data) {
        alert('AI Quiz generated successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error generating AI quiz:', error);
      alert('Error generating AI quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} title="AI Quiz Generator" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Topic</label>
          <input 
            className="input brutal"
            type="text" 
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g., JavaScript, Mathematics, History..."
            required
            style={{ width: '100%' }}
          />
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
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
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Number of Questions</label>
            <input 
              className="input brutal"
              type="number" 
              value={formData.numberOfQuestions}
              onChange={(e) => setFormData(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
              min="1"
              max="20"
            />
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
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
              placeholder="e.g., Group A, Class 101..."
            />
          </div>
        </div>

        <div className="card brutal" style={{ marginBottom: 24, padding: 16, background: 'var(--muted)' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>🤖 AI Generation Info</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Our AI will generate {formData.numberOfQuestions} {formData.difficulty.toLowerCase()} questions 
            about "{formData.topic || 'your topic'}" with multiple choice answers. 
            Each question will be automatically reviewed for quality and accuracy.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !formData.topic}>
            {loading ? 'Generating...' : 'Generate Quiz with AI'}
          </button>
        </div>
      </form>
    </Modal>
  );
}