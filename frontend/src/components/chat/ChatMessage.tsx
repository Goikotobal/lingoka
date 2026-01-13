import { Bot, User, Volume2 } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-emerald-400 to-cyan-500'
            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : ''}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isUser
              ? 'bg-indigo-500 text-white rounded-br-md'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Metadata for assistant messages */}
        {!isUser && message.metadata && (
          <div className="flex items-center gap-2 px-2">
            {message.metadata.audio_url && (
              <button
                onClick={() => {
                  const audio = new Audio(message.metadata!.audio_url);
                  audio.play();
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                title="Play audio"
              >
                <Volume2 className="w-4 h-4 text-slate-500" />
              </button>
            )}
            {message.metadata.agent_type && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {message.metadata.agent_type}
              </span>
            )}
          </div>
        )}

        {/* Grammar notes */}
        {!isUser &&
          message.metadata?.grammar_notes &&
          message.metadata.grammar_notes.length > 0 && (
            <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg max-w-full">
              <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                Grammar Notes
              </div>
              <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                {message.metadata.grammar_notes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
