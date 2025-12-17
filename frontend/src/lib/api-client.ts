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
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
<<<<<<< HEAD
  withCredentials: true,
  timeout: 30000, // 30 detik timeout
});

// Request Interceptor
=======
  withCredentials: true, 
});

>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error: any) => {
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
  (error: AxiosError) => {
    // Network Error
    if (!error.response) {
      console.error('🔴 Network Error:', {
        message: error.message,
        baseURL: API_URL,
      });
    }

    // HTTP Error Responses
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn('⚠️ Unauthorized - Redirecting to login');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.warn('⚠️ Forbidden - Access denied');
      }

      if (status >= 500) {
        console.error('🔴 Server Error:', error.response.data);
      }
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
    // Network Error (tidak ada response dari server)
    if (!error.response) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }
    
    // Error dari server
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.message;
    
    // Custom error messages
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
