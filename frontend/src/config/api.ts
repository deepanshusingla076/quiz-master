// API configuration for microservices (restored)
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      VALIDATE: '/api/auth/validate',
      PROFILE: '/api/auth/me',
    },
    QUIZ: {
      BASE: '/api/questionbank/quizzes',
      CREATE: '/api/questionbank/quizzes',
      TEACHER_QUIZZES: '/api/questionbank/quizzes/teacher',
      STUDENT_QUIZZES: '/api/questionbank/quizzes/student',
      BY_ID: (id: number) => `/api/questionbank/quizzes/${id}`,
      BY_GROUP: (group: string) => `/api/questionbank/quizzes/student?groupSection=${group}`,
      QUESTIONS: (id: number) => `/api/questionbank/quizzes/${id}/questions`,
      DELETE: (id: number) => `/api/questionbank/quizzes/${id}`,
    },
    AI: {
      GENERATE: '/api/ai/generate',
    },
    RESULTS: {
      MY_RESULTS: '/api/results/my',
      QUIZ_STATS: (quizId: number) => `/api/results/quiz/${quizId}`,
      LEADERBOARD: '/api/results/leaderboard',
      SUBMIT: '/api/attempt',
      CHECK_ATTEMPTED: (quizId: number) => `/api/attempt/check/${quizId}`,
      MY_ATTEMPTS: '/api/attempt/my',
    },
    ANALYTICS: {
      SUMMARY: '/api/analytics/summary',
      STUDENTS: '/api/analytics/students',
      ATTEMPTS: '/api/analytics/attempts',
      LEADERBOARD: '/api/analytics/leaderboard',
    }
  }
}

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Invalid input data.',
}

// Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const