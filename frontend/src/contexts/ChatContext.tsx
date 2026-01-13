import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { ChatMessage, VocabularyItem } from '../types';
import * as api from '../services/api';

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentVocabulary: VocabularyItem[];
  sessionId: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setError: (error: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVocabulary, setCurrentVocabulary] = useState<VocabularyItem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendMessage({
        message: content.trim(),
        user_id: 'demo-user',
        session_id: sessionId || undefined,
        language: 'hiligaynon',
      });

      // Update session ID if this is a new session
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        metadata: {
          agent_type: response.agent_type,
          confidence: response.confidence,
          vocabulary: response.vocabulary,
          grammar_notes: response.grammar_notes,
          audio_url: response.audio_url,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update vocabulary if provided
      if (response.vocabulary && response.vocabulary.length > 0) {
        setCurrentVocabulary((prev) => {
          const existingWords = new Set(prev.map((v) => v.word));
          const newVocab = response.vocabulary!.filter(
            (v) => !existingWords.has(v.word)
          );
          return [...prev, ...newVocab];
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentVocabulary([]);
    setSessionId(null);
    setError(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        currentVocabulary,
        sessionId,
        sendMessage,
        clearChat,
        setError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
