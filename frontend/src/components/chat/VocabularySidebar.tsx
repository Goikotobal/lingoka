import { Volume2, BookOpen, X } from 'lucide-react';
import type { VocabularyItem } from '../../types';

interface VocabularySidebarProps {
  vocabulary: VocabularyItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function VocabularySidebar({
  vocabulary,
  isOpen,
  onClose,
}: VocabularySidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 xl:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed xl:static right-0 top-0 h-full z-50
          w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Vocabulary
            </span>
            <span className="text-sm text-slate-500">({vocabulary.length})</span>
          </div>
          <button
            onClick={onClose}
            className="xl:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Vocabulary list */}
        <div className="flex-1 overflow-y-auto p-4">
          {vocabulary.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">
                Words from your conversation will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {vocabulary.map((item, index) => (
                <VocabularyCard key={`${item.word}-${index}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function VocabularyCard({ item }: { item: VocabularyItem }) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="font-semibold text-slate-900 dark:text-white">
            {item.word}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {item.translation}
          </div>
        </div>
        <button
          onClick={() => {
            const utterance = new SpeechSynthesisUtterance(item.word);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
          }}
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
          title="Pronounce"
        >
          <Volume2 className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {item.pronunciation && (
        <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 italic">
          /{item.pronunciation}/
        </div>
      )}

      {item.part_of_speech && (
        <div className="mt-1">
          <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded">
            {item.part_of_speech}
          </span>
        </div>
      )}

      {item.example && (
        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic border-l-2 border-indigo-300 dark:border-indigo-600 pl-2">
          "{item.example}"
        </div>
      )}
    </div>
  );
}
