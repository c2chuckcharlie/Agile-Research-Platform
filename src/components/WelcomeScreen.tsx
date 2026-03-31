import React from 'react';
import { BookOpen, Rocket, ArrowRight } from 'lucide-react';
import { SPRINTS } from '../constants';
import { Language } from '../types';

interface WelcomeScreenProps {
  researchTitle: string;
  onTitleChange: (title: string) => void;
  onStart: () => void;
  onSprintSelect: (id: number) => void;
  language: Language;
  completedSprints: number[];
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  researchTitle,
  onTitleChange,
  onStart,
  onSprintSelect,
  language,
  completedSprints
}) => {
  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-12 max-w-3xl w-full shadow-lg text-center border border-black/5">
        <div className="w-20 h-20 bg-gradient-to-br from-teal to-amber rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-6">
          <BookOpen className="text-white w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-display text-ink mb-2">
          {t('敏捷研究寫作平台', 'Agile Research Writing Platform')}
        </h1>
        
        <p className="text-ink-light mb-8 max-w-lg mx-auto">
          {t(
            '以 Scrum 框架引導博士生完成學術論文撰寫的全程 AI 輔助學習系統。從研究主題到期刊投稿，六個衝刺帶你逐步完成高品質研究論文。',
            'An AI-powered learning system guiding doctoral students through academic paper writing using the Scrum framework. Six sprints from research topic to journal submission.'
          )}
        </p>

        <div className="text-left mb-8">
          <label className="block text-xs font-bold text-ink-light uppercase tracking-widest mb-2">
            🎓 {t('研究題目（用於所有衝刺）', 'Research Title (used across all sprints)')}
          </label>
          <input
            type="text"
            className="form-input text-lg py-3"
            placeholder={t('輸入你的研究題目...', 'Enter your research title...')}
            value={researchTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-left">
          {SPRINTS.map((sp) => (
            <button
              key={sp.id}
              onClick={() => onSprintSelect(sp.id)}
              className="p-4 rounded-xl border-2 border-black/5 hover:border-teal/20 hover:bg-teal/5 transition-all text-left group"
            >
              <div className="font-mono text-[10px] font-bold mb-1 flex items-center justify-between" style={{ color: sp.color }}>
                <span>{sp.icon} SPRINT {sp.id}</span>
                {completedSprints.includes(sp.id) && <span className="text-sage">✓</span>}
              </div>
              <div className="text-sm font-bold text-ink group-hover:text-teal transition-colors">
                {language === 'zh' ? sp.zh.title : sp.en.title}
              </div>
              <div className="text-[10px] text-ink-light line-clamp-1">
                {language === 'zh' ? sp.zh.sub : sp.en.sub}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn btn-teal w-full py-4 text-lg group"
        >
          <Rocket className="w-5 h-5" />
          {t('開始研究之旅', 'Begin Research Journey')}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
