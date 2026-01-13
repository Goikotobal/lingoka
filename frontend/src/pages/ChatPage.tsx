import { useRef, useEffect, useState } from 'react';
import { BookOpen, Trash2, AlertCircle } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import {
  ChatMessage,
  ChatInput,
  VocabularySidebar,
  TypingIndicator,
} from '../components/chat';

export function ChatPage() {
  const {
    messages,
    isLoading,
    error,
    currentVocabulary,
    sendMessage,
    clearChat,
    setError,
  } = useChat();

  const [showVocab, setShowVocab] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="font-semibold text-slate-900 dark:text-white">
              Hiligaynon Practice
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chat with your AI tutor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVocab(!showVocab)}
              className={`p-2 rounded-lg transition-colors ${
                showVocab
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500'
              }`}
              title="Toggle vocabulary"
            >
              <BookOpen className="w-5 h-5" />
              {currentVocabulary.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center">
                  {currentVocabulary.length}
                </span>
              )}
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <WelcomeMessage onSuggestionClick={sendMessage} />
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          placeholder="Say something in Hiligaynon or English..."
        />
      </div>

      {/* Vocabulary sidebar */}
      <VocabularySidebar
        vocabulary={currentVocabulary}
        isOpen={showVocab}
        onClose={() => setShowVocab(false)}
      />
    </div>
  );
}

function WelcomeMessage({
  onSuggestionClick,
}: {
  onSuggestionClick: (msg: string) => void;
}) {
  const suggestions = [
    'Teach me how to say hello',
    'How do I count to ten?',
    'What are common greetings?',
    'Teach me about Hiligaynon culture',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-3xl">👋</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Kumusta! Welcome to LingoKa
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
        I'm your AI tutor for learning Hiligaynon. Start a conversation and I'll
        help you practice speaking, learn vocabulary, and understand the culture.
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
