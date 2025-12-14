import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { journalAPI, handleAPIError } from './api-client';

interface Journal {
  id: string;
  filename: string;
  title: string;
  detectedAuthor: string;
  authorInstitution?: string;
  publicationYear?: string;
  journalSource?: string;
  doi?: string;
  pdfUrl: string;
  uploadDate: string;
  status: string;
  fileSize: string;
  contentPreview?: string;
  uploader?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  uploaderId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AppState {
  
  journals: Journal[];
  isLoadingJournals: boolean;
  journalsError: string | null;
  fetchJournals: (params?: { status?: string; search?: string }) => Promise<void>;
  addJournal: (journal: Partial<Journal>) => Promise<{ success: boolean; error?: string }>;
  updateJournalStatus: (id: string, status: string) => Promise<{ success: boolean; error?: string }>;
  deleteJournal: (id: string) => Promise<{ success: boolean; error?: string }>;

  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      
      journals: [],
      isLoadingJournals: false,
      journalsError: null,
      
      chatHistory: [],
      sidebarOpen: true,

      fetchJournals: async (params) => {
        set({ isLoadingJournals: true, journalsError: null });
        try {
          const response = await journalAPI.getAll(params);
          
          const journals = response.data?.journals || [];
          console.log('📚 Fetched journals from API:', journals.length);
          set({ 
            journals, 
            isLoadingJournals: false 
          });
        } catch (error) {
          console.error('❌ Error fetching journals:', error);
          set({ 
            journalsError: handleAPIError(error), 
            isLoadingJournals: false,
            journals: [] 
          });
        }
      },
      
      addJournal: async (journal) => {
        try {
          const data = await journalAPI.create(journal as any);
          if (data.success) {
            set((state) => ({ 
              journals: [...state.journals, data.data] 
            }));
            return { success: true };
          }
          return { success: false, error: 'Failed to create journal' };
        } catch (error) {
          return { success: false, error: handleAPIError(error) };
        }
      },
      
      updateJournalStatus: async (id, status) => {
        try {
          const data = await journalAPI.updateStatus(id, status as any);
          if (data.success) {
            set((state) => ({
              journals: state.journals.map(j => 
                j.id === id ? { ...j, status } : j
              )
            }));
            return { success: true };
          }
          return { success: false, error: 'Failed to update status' };
        } catch (error) {
          return { success: false, error: handleAPIError(error) };
        }
      },
      
      deleteJournal: async (id) => {
        try {
          const data = await journalAPI.delete(id);
          if (data.success) {
            set((state) => ({
              journals: state.journals.filter(j => j.id !== id)
            }));
            return { success: true };
          }
          return { success: false, error: 'Failed to delete journal' };
        } catch (error) {
          return { success: false, error: handleAPIError(error) };
        }
      },
      
      addChatMessage: (message) => 
        set((state) => ({ 
          chatHistory: [...state.chatHistory, message] 
        })),
      
      clearChatHistory: () => 
        set({ chatHistory: [] }),
      
      toggleSidebar: () => 
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
    }),
    {
      name: 'enernova-storage',
      partialize: (state) => ({ 
        chatHistory: state.chatHistory,
        sidebarOpen: state.sidebarOpen
        
      }),
    }
  )
);
