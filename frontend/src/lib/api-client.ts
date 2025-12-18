import axios, { AxiosError } from 'axios';

/**
 * API URL Configuration
 * Priority: NEXT_PUBLIC_API_URL env var > fallback to localhost
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('🌐 EnerNova API Client initialized:', {
  baseURL: API_URL,
  environment: process.env.NODE_ENV,
});

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,

  timeout: 30000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Debug log untuk development
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  (error: AxiosError<any>) => {
    if (!error.response) {
      console.error('🔴 Network Error:', {
        message: error.message,
        baseURL: API_URL,
      });
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      // Don't redirect if we are already on the login page or if this is a login attempt
      // This allows the login component to handle the error and show it to the user
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

      if (!isLoginRequest && !isLoginPage) {
        console.warn('⚠️ Unauthorized - Redirecting to login');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }

    if (status === 403) {
      console.warn('⚠️ Forbidden - Access denied');
    }

    if (status >= 500) {
      console.error('🔴 Server Error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { data } = response.data;
    if (typeof window !== 'undefined' && data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
  checkAuth: async () => {
    const response = await apiClient.get('/auth/check');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

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

export const chatAPI = {
  sendMessage: async (message: string, conversationHistory?: any[]) => {
    const response = await apiClient.post('/chat', {
      message,
      conversationHistory
    });
    return response.data;
  },
};

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

export const handleAPIError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }

    const message = error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;

    switch (error.response?.status) {
      case 400:
        return `Data tidak valid: ${message}`;
      case 401:
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
      case 403:
        return 'Anda tidak memiliki akses ke resource ini.';
      case 404:
        return 'Data tidak ditemukan.';
      case 500:
        return 'Terjadi kesalahan pada server. Silakan coba lagi.';
      default:
        return message || 'Terjadi kesalahan tidak terduga.';
    }
  }

  return 'Terjadi kesalahan tidak terduga.';
};
