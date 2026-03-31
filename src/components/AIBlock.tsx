import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Edit2, Save, Trash2, Sparkles, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Language } from '../types';

interface AIBlockProps {
  content: string;
  onSave: (newContent: string) => void;
  onDelete: () => void;
  onSnapshot: () => void;
  language: Language;
  isLoading?: boolean;
}

export const AIBlock: React.FC<AIBlockProps> = ({
  content,
  onSave,
  onDelete,
  onSnapshot,
  language,
  isLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="ai-block mt-4">
        <div className="flex items-center gap-2 text-teal font-mono text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4 animate-pulse" />
          {t('AI 生成中...', 'AI Generating...')}
        </div>
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-teal rounded-full animate-dot-bounce" />
          <div className="w-2 h-2 bg-teal rounded-full animate-dot-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-teal rounded-full animate-dot-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="ai-block mt-4 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-teal font-mono text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          {t('AI 生成內容', 'AI Generated Content')}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="p-1.5 hover:bg-black/5 rounded-md text-ink-light transition-colors"
            title={isEditing ? t('儲存', 'Save') : t('編輯', 'Edit')}
          >
            {isEditing ? <Check className="w-4 h-4 text-sage" /> : <Edit2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onSnapshot}
            className="p-1.5 hover:bg-black/5 rounded-md text-ink-light transition-colors"
            title={t('儲存版本', 'Save Version')}
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-rose/10 rounded-md text-rose transition-colors"
            title={t('刪除', 'Delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="form-textarea min-h-[200px] text-sm leading-relaxed"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          autoFocus
        />
      ) : (
        <div className="prose prose-sm max-w-none text-ink leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
