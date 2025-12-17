import axios, { AxiosError } from 'axios';

<<<<<<< HEAD
/**
 * Dynamic API URL Detection
 * - Development: http://localhost:5000
 * - Production: https://enernova.undiksha.cloud/api
 * - Staging: bisa ditambahkan jika ada
 */
function getAPIBaseURL(): string {
  // 1. Cek environment variable dari Next.js
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Deteksi otomatis berdasarkan window.location (client-side)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production domain
    if (hostname === 'enernova.undiksha.cloud' || hostname === 'www.enernova.undiksha.cloud') {
      return 'https://enernova.undiksha.cloud/api';
    }
    
    // Development lokal
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    
    // Network access (misal dari HP ke PC yang running di 192.168.x.x)
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return `http://${hostname}:5000/api`;
    }
  }

  // 3. Fallback untuk server-side rendering (SSR)
  return process.env.NODE_ENV === 'production' 
    ? 'https://enernova.undiksha.cloud/api'
    : 'http://localhost:5000/api';
}

export const API_URL = getAPIBaseURL();

console.log('🌐 EnerNova API Client initialized:', {
  baseURL: API_URL,
  environment: process.env.NODE_ENV,
  isClient: typeof window !== 'undefined'
});
=======
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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

<<<<<<< HEAD
// Response Interceptor dengan Error Handling yang lebih baik
=======
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
apiClient.interceptors.response.use(
  (response: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Network Error (tidak ada koneksi ke server)
    if (!error.response) {
      console.error('🔴 Network Error:', {
        message: error.message,
        baseURL: API_URL,
        suggestion: 'Cek apakah backend API berjalan dan CORS dikonfigurasi dengan benar'
      });
      
      // Tampilkan error yang user-friendly
      if (typeof window !== 'undefined') {
        const errorMsg = process.env.NODE_ENV === 'production'
          ? 'Tidak dapat terhubung ke server. Silakan coba lagi.'
          : `Network Error: Backend tidak dapat dijangkau di ${API_URL}`;
        
        // Bisa di-uncomment jika ingin tampilkan alert
        // alert(errorMsg);
      }
    }
    
    // 401 Unauthorized
    if (error.response?.status === 401) {
<<<<<<< HEAD
      console.warn('⚠️ Unauthorized - Redirecting to login');
=======
      
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // 403 Forbidden
    if (error.response?.status === 403) {
      console.warn('⚠️ Forbidden - Access denied');
    }
    
    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('🔴 Server Error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

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
