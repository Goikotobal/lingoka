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
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  currentVocabulary: VocabularyItem[];
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setError: (error: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVocabulary, setCurrentVocabulary] = useState<VocabularyItem[]>(
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
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
          session_id: sessionId || undefined,
          language: 'hiligaynon',
        });

        // Update session ID if new
        if (!sessionId && response.session_id) {
          setSessionId(response.session_id);
        }

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
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

        // Update vocabulary sidebar
        if (response.vocabulary && response.vocabulary.length > 0) {
          setCurrentVocabulary((prev) => {
            const newVocab = response.vocabulary!.filter(
              (v) => !prev.some((p) => p.word === v.word)
            );
            return [...newVocab, ...prev].slice(0, 20);
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        // Remove the user message if failed
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  const clearChat = useCallback(() => {
    if (sessionId) {
      api.endSession(sessionId).catch(console.error);
    }
    setMessages([]);
    setSessionId(null);
    setCurrentVocabulary([]);
    setError(null);
  }, [sessionId]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessionId,
        isLoading,
        error,
        currentVocabulary,
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
