import axios, { AxiosError } from 'axios';

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for JWT
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { data } = response.data; // Extract nested data
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Journal API
export const journalAPI = {
  getAll: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/journals', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/journals/${id}`);
    return response.data;
  },

  create: async (journalData: {
    filename: string;
    title: string;
    detectedAuthor: string;
    authorInstitution?: string;
    publicationYear?: string;
    journalSource?: string;
    doi?: string;
    pdfUrl: string;
    fileSize: string;
    contentPreview?: string;
  }) => {
    const response = await apiClient.post('/journals', journalData);
    return response.data;
  },

  update: async (id: string, journalData: Partial<any>) => {
    const response = await apiClient.patch(`/journals/${id}`, journalData);
    return response.data;
  },

  updateStatus: async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    const response = await apiClient.patch(`/journals/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/journals/${id}`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message: string, conversationHistory?: any[]) => {
    const response = await apiClient.post('/chat', { 
      message, 
      conversationHistory 
    });
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadJournal: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/journal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Helper function to handle API errors
export const handleAPIError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};
