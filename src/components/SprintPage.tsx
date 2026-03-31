import React, { useState } from 'react';
import { 
  Target, 
  ClipboardList, 
  Search, 
  BarChart3, 
  RotateCcw, 
  Plus, 
  Trash2, 
  AlertCircle,
  Calendar,
  History,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye,
  Sparkles
} from 'lucide-react';
import { SprintDefinition, SprintData, Language, DailyLog, BacklogItem } from '../types';
import { AIBlock } from './AIBlock';
import { cn } from '@/src/lib/utils';

interface SprintPageProps {
  sprint: SprintDefinition;
  data: SprintData;
  language: Language;
  researchTitle: string;
  onUpdate: (data: Partial<SprintData>) => void;
  onComplete: () => void;
  onPrev: () => void;
  onGenerateAI: (type: string) => Promise<void>;
  isGenerating: string | null;
  onPreview: () => void;
  onDownload: () => void;
  onSaveSnapshot: (label: string) => void;
  onRestore: (idx: number) => void;
}

export const SprintPage: React.FC<SprintPageProps> = ({
  sprint,
  data,
  language,
  researchTitle,
  onUpdate,
  onComplete,
  onPrev,
  onGenerateAI,
  isGenerating,
  onPreview,
  onDownload,
  onSaveSnapshot,
  onRestore
}) => {
  const [activeTab, setActiveTab] = useState<'planning' | 'daily' | 'review' | 'retro' | 'backlog'>('planning');
  
  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const tabs = [
    { id: 'planning', zh: '衝刺規劃', en: 'Planning', icon: Target, color: 'text-teal' },
    { id: 'daily', zh: '每日 Scrum', en: 'Daily Scrum', icon: Calendar, color: 'text-amber' },
    { id: 'review', zh: '衝刺評估', en: 'Review', icon: Search, color: 'text-sage' },
    { id: 'retro', zh: '回顧改善', en: 'Retro', icon: RotateCcw, color: 'text-rose' },
    { id: 'backlog', zh: '待辦精化', en: 'Backlog', icon: ClipboardList, color: 'text-ink-mid' },
  ] as const;

  const handleUpdateContent = (key: string, value: string) => {
    onUpdate({ content: { ...data.content, [key]: value } });
  };

  const handleAddDaily = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const log: DailyLog = {
      date: new Date().toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US'),
      done: formData.get('done') as string,
      plan: formData.get('plan') as string,
      block: formData.get('block') as string,
      aiInsight: ''
    };
    onUpdate({ dailyScrum: [...data.dailyScrum, log] });
    e.currentTarget.reset();
  };

  const handleAddBacklog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item: BacklogItem = {
      text: formData.get('text') as string,
      priority: formData.get('priority') as 'high' | 'med' | 'low'
    };
    onUpdate({ backlog: { ...data.backlog, items: [...data.backlog.items, item] } });
    e.currentTarget.reset();
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="card border-l-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderLeftColor: sprint.color }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${sprint.color}15`, color: sprint.color }}>
              {sprint.icon} SPRINT {sprint.id}
            </span>
          </div>
          <h2 className="text-2xl font-display text-ink leading-tight">
            {language === 'zh' ? sprint.zh.title : sprint.en.title}
          </h2>
          <div className="text-xs text-ink-light mt-1 flex items-center gap-2">
            <span>{language === 'zh' ? sprint.en.title : sprint.zh.title}</span>
            {researchTitle && <span className="flex items-center gap-1 opacity-60">| 📝 {researchTitle}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPreview} className="btn btn-ghost btn-sm">
            <Eye className="w-4 h-4" />
            {t('預覽', 'Preview')}
          </button>
          <button onClick={onDownload} className="btn btn-primary btn-sm">
            <Download className="w-4 h-4" />
            {t('下載', 'Download')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-md mb-6 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id 
                ? "bg-ink text-cream shadow-sm" 
                : "text-ink-light hover:bg-cream-dark"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-cream" : tab.color)} />
            {language === 'zh' ? tab.zh : tab.en}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'planning' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
                <h3 className="card-title">
                  <Target className="w-5 h-5 text-teal" />
                  {t('衝刺目標', 'Sprint Goal')}
                </h3>
                <button 
                  onClick={() => onGenerateAI('planning')} 
                  disabled={!!isGenerating}
                  className="btn btn-ghost btn-sm text-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  {t('AI 建議', 'AI Suggest')}
                </button>
              </div>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">{t('本次衝刺目標', 'Sprint Goal')}</label>
                  <textarea 
                    className="form-textarea" 
                    value={data.planning.goal}
                    onChange={(e) => onUpdate({ planning: { ...data.planning, goal: e.target.value } })}
                    placeholder={t('本次衝刺將完成...', 'This sprint will achieve...')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('任務清單', 'Task List')}</label>
                  <textarea 
                    className="form-textarea h-32" 
                    value={data.planning.tasks}
                    onChange={(e) => onUpdate({ planning: { ...data.planning, tasks: e.target.value } })}
                    placeholder={t('任務 1\n任務 2...', 'Task 1\nTask 2...')}
                  />
                </div>
                <AIBlock 
                  content={data.planning.aiOutput}
                  isLoading={isGenerating === 'planning'}
                  language={language}
                  onSave={(val) => onUpdate({ planning: { ...data.planning, aiOutput: val } })}
                  onDelete={() => onUpdate({ planning: { ...data.planning, aiOutput: '' } })}
                  onSnapshot={() => onSaveSnapshot(t('AI 規劃建議', 'AI Planning Suggestion'))}
                />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
                <h3 className="card-title">
                  <div className="p-1 rounded bg-teal/10 text-teal">{sprint.icon}</div>
                  {t('研究內容', 'Research Content')}
                </h3>
                <button 
                  onClick={() => onGenerateAI('content')} 
                  disabled={!!isGenerating}
                  className="btn btn-teal btn-sm text-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  {t('AI 輔助生成', 'AI Generate')}
                </button>
              </div>
              <div className="space-y-4">
                {sprint.content_fields.map((f) => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{language === 'zh' ? f.zh : f.en}</label>
                    {f.type === 'select' ? (
                      <select 
                        className="form-select"
                        value={data.content[f.key] || ''}
                        onChange={(e) => handleUpdateContent(f.key, e.target.value)}
                      >
                        <option value="">{t('請選擇...', 'Select...')}</option>
                        {(language === 'zh' ? f.options_zh : f.options_en)?.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea 
                        className="form-textarea"
                        value={data.content[f.key] || ''}
                        onChange={(e) => handleUpdateContent(f.key, e.target.value)}
                        placeholder={language === 'zh' ? f.placeholder_zh : f.placeholder_en}
                      />
                    ) : (
                      <input 
                        type="text"
                        className="form-input"
                        value={data.content[f.key] || ''}
                        onChange={(e) => handleUpdateContent(f.key, e.target.value)}
                        placeholder={language === 'zh' ? f.placeholder_zh : f.placeholder_en}
                      />
                    )}
                  </div>
                ))}
                <AIBlock 
                  content={data.content.aiOutput || ''}
                  isLoading={isGenerating === 'content'}
                  language={language}
                  onSave={(val) => onUpdate({ content: { ...data.content, aiOutput: val } })}
                  onDelete={() => onUpdate({ content: { ...data.content, aiOutput: '' } })}
                  onSnapshot={() => onSaveSnapshot(t('AI 研究內容', 'AI Research Content'))}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="card-title mb-4 border-b border-black/5 pb-3">
                <Plus className="w-5 h-5 text-amber" />
                {t('新增每日 Scrum', 'Add Daily Scrum Log')}
              </h3>
              <form onSubmit={handleAddDaily} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">✅ {t('昨天完成了什麼？', 'What did you complete?')}</label>
                  <textarea name="done" required className="form-textarea h-20" />
                </div>
                <div className="form-group">
                  <label className="form-label">🎯 {t('今天計劃做什麼？', 'What will you do today?')}</label>
                  <textarea name="plan" required className="form-textarea h-20" />
                </div>
                <div className="form-group">
                  <label className="form-label">🚧 {t('有什麼阻礙？', 'Any blockers?')}</label>
                  <textarea name="block" className="form-textarea h-20" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary flex-1">
                    {t('記錄', 'Log')}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onGenerateAI('daily')}
                    disabled={!!isGenerating || data.dailyScrum.length === 0}
                    className="btn btn-teal px-6"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t('AI 分析', 'AI Insights')}
                  </button>
                </div>
              </form>
            </div>
            <div className="card">
              <h3 className="card-title mb-4 border-b border-black/5 pb-3">
                <Calendar className="w-5 h-5 text-amber" />
                {t('Scrum 記錄', 'Scrum Logs')}
                <span className="text-xs font-normal text-ink-light ml-auto">({data.dailyScrum.length})</span>
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {data.dailyScrum.length === 0 ? (
                  <div className="text-center py-12 text-ink-light opacity-40">
                    <ClipboardList className="w-12 h-12 mx-auto mb-2" />
                    {t('尚無記錄', 'No logs yet')}
                  </div>
                ) : (
                  data.dailyScrum.slice().reverse().map((log, i) => (
                    <div key={i} className="p-4 bg-cream/50 rounded-lg border-l-4 border-teal relative group">
                      <button 
                        onClick={() => {
                          const newLogs = [...data.dailyScrum];
                          newLogs.splice(data.dailyScrum.length - 1 - i, 1);
                          onUpdate({ dailyScrum: newLogs });
                        }}
                        className="absolute top-2 right-2 p-1 text-rose opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="font-mono text-[10px] font-bold text-teal mb-2">
                        {log.date}
                      </div>
                      <div className="text-sm space-y-2">
                        <p><strong>✅</strong> {log.done}</p>
                        <p><strong>🎯</strong> {log.plan}</p>
                        {log.block && <p><strong>🚧</strong> {log.block}</p>}
                        {log.aiInsight && (
                          <div className="mt-3 p-3 bg-teal/5 rounded border border-teal/10">
                            <div className="text-[10px] font-bold text-teal uppercase tracking-widest mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> AI INSIGHT
                            </div>
                            <div className="text-xs leading-relaxed text-ink-mid italic">
                              {log.aiInsight}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
                <h3 className="card-title">
                  <Search className="w-5 h-5 text-sage" />
                  {t('衝刺回顧評估', 'Sprint Review')}
                </h3>
                <button 
                  onClick={() => onGenerateAI('review')} 
                  disabled={!!isGenerating}
                  className="btn btn-teal btn-sm text-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  {t('AI 評估', 'AI Evaluate')}
                </button>
              </div>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">{t('本次衝刺產出摘要', 'Sprint Output Summary')}</label>
                  <textarea 
                    className="form-textarea h-40" 
                    value={data.review.summary}
                    onChange={(e) => onUpdate({ review: { ...data.review, summary: e.target.value } })}
                    placeholder={t('本次衝刺完成了...', 'This sprint produced...')}
                  />
                </div>
                <AIBlock 
                  content={data.review.aiOutput}
                  isLoading={isGenerating === 'review'}
                  language={language}
                  onSave={(val) => onUpdate({ review: { ...data.review, aiOutput: val } })}
                  onDelete={() => onUpdate({ review: { ...data.review, aiOutput: '' } })}
                  onSnapshot={() => onSaveSnapshot(t('AI 品質評估', 'AI Quality Review'))}
                />
              </div>
            </div>
            <div className="card">
              <h3 className="card-title mb-4 border-b border-black/5 pb-3">
                <BarChart3 className="w-5 h-5 text-sage" />
                {t('品質檢核', 'Quality Check')}
              </h3>
              <div className="space-y-6">
                {[
                  { zh: '研究問題清晰度', en: 'Research Question Clarity' },
                  { zh: '文獻支撐度', en: 'Literature Support' },
                  { zh: '方法論嚴謹度', en: 'Methodological Rigor' },
                  { zh: '論述一致性', en: 'Argumentative Consistency' },
                  { zh: '學術寫作品質', en: 'Academic Writing Quality' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-ink-light uppercase tracking-widest">{t(item.zh, item.en)}</label>
                      <span className="font-mono text-xs text-teal font-bold">{(data.review.qa?.[i] || 3)}/5</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={data.review.qa?.[i] || 3}
                      onChange={(e) => {
                        const newQa = [...(data.review.qa || [3,3,3,3,3])];
                        newQa[i] = parseInt(e.target.value);
                        onUpdate({ review: { ...data.review, qa: newQa } });
                      }}
                      className="w-full h-1.5 bg-cream-dark rounded-lg appearance-none cursor-pointer accent-teal"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'retro' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
                <h3 className="card-title">
                  <RotateCcw className="w-5 h-5 text-rose" />
                  {t('回顧反思', 'Retrospective')}
                </h3>
                <button 
                  onClick={() => onGenerateAI('retro')} 
                  disabled={!!isGenerating}
                  className="btn btn-amber btn-sm text-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  {t('AI 改進建議', 'AI Improvements')}
                </button>
              </div>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">🌟 {t('哪些做法有效？', 'What worked well?')}</label>
                  <textarea 
                    className="form-textarea h-24" 
                    value={data.retro.worked}
                    onChange={(e) => onUpdate({ retro: { ...data.retro, worked: e.target.value } })}
                    placeholder={t('例：每日寫作 500 字的習慣...', 'e.g., The daily 500-word writing habit...')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🔧 {t('哪些需要改進？', 'What needs improvement?')}</label>
                  <textarea 
                    className="form-textarea h-24" 
                    value={data.retro.didnt}
                    onChange={(e) => onUpdate({ retro: { ...data.retro, didnt: e.target.value } })}
                    placeholder={t('例：文獻整理效率不足...', 'e.g., Literature organization was inefficient...')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">💡 {t('下次改善計劃', 'Improvement Plan')}</label>
                  <textarea 
                    className="form-textarea h-24" 
                    value={data.retro.improvements}
                    onChange={(e) => onUpdate({ retro: { ...data.retro, improvements: e.target.value } })}
                    placeholder={t('下次衝刺我將...', 'Next sprint I will...')}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card">
                <h3 className="card-title mb-4 border-b border-black/5 pb-3">
                  <Sparkles className="w-5 h-5 text-rose" />
                  {t('AI 改進策略', 'AI Improvement Strategies')}
                </h3>
                <AIBlock 
                  content={data.retro.aiOutput}
                  isLoading={isGenerating === 'retro'}
                  language={language}
                  onSave={(val) => onUpdate({ retro: { ...data.retro, aiOutput: val } })}
                  onDelete={() => onUpdate({ retro: { ...data.retro, aiOutput: '' } })}
                  onSnapshot={() => onSaveSnapshot(t('AI 回顧策略', 'AI Retro Strategy'))}
                />
                {!data.retro.aiOutput && !isGenerating && (
                  <div className="text-center py-12 text-ink-light opacity-40">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    {t('填寫反思後點擊 AI 建議', 'Fill in reflections then click AI Improvements')}
                  </div>
                )}
              </div>
              <div className="card">
                <h3 className="card-title mb-4 border-b border-black/5 pb-3">
                  <History className="w-5 h-5 text-ink-mid" />
                  {t('版本歷史', 'Version History')}
                </h3>
                <div className="space-y-2">
                  {data.versions.length === 0 ? (
                    <div className="text-center py-8 text-ink-light opacity-40 text-xs">
                      {t('尚無版本', 'No versions yet')}
                    </div>
                  ) : (
                    data.versions.slice().reverse().map((v, i) => (
                      <button 
                        key={i} 
                        onClick={() => onRestore(data.versions.length - 1 - i)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-cream-dark rounded-md transition-colors text-left group"
                      >
                        <span className="font-mono text-[10px] text-ink-light">{v.time}</span>
                        <span className="text-xs flex-1 truncate">{v.label}</span>
                        <RotateCcw className="w-3 h-3 text-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backlog' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
                <h3 className="card-title">
                  <ClipboardList className="w-5 h-5 text-ink-mid" />
                  {t('待辦事項精化', 'Backlog Refinement')}
                </h3>
                <button 
                  onClick={() => onGenerateAI('backlog')} 
                  disabled={!!isGenerating}
                  className="btn btn-teal btn-sm text-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  {t('AI 建議任務', 'AI Suggest Tasks')}
                </button>
              </div>
              <form onSubmit={handleAddBacklog} className="flex gap-2 mb-6">
                <input 
                  name="text" 
                  required 
                  type="text" 
                  className="form-input flex-1" 
                  placeholder={t('新增任務...', 'Add task...')} 
                />
                <select name="priority" className="form-select w-24">
                  <option value="high">{t('高', 'High')}</option>
                  <option value="med">{t('中', 'Med')}</option>
                  <option value="low">{t('低', 'Low')}</option>
                </select>
                <button type="submit" className="btn btn-primary px-4">+</button>
              </form>
              <div className="space-y-2">
                {data.backlog.items.length === 0 ? (
                  <div className="text-center py-12 text-ink-light opacity-40">
                    <ClipboardList className="w-12 h-12 mx-auto mb-2" />
                    {t('尚無待辦事項', 'No backlog items')}
                  </div>
                ) : (
                  data.backlog.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-cream/50 rounded-lg border border-black/5 group">
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold",
                        item.priority === 'high' ? "bg-rose/10 text-rose" : 
                        item.priority === 'med' ? "bg-amber/10 text-amber" : "bg-sage/10 text-sage"
                      )}>
                        {item.priority === 'high' ? '!' : item.priority === 'med' ? '~' : '↓'}
                      </div>
                      <div className="text-sm flex-1">{item.text}</div>
                      <button 
                        onClick={() => {
                          const newItems = [...data.backlog.items];
                          newItems.splice(i, 1);
                          onUpdate({ backlog: { ...data.backlog, items: newItems } });
                        }}
                        className="p-1 text-rose opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="card">
              <h3 className="card-title mb-4 border-b border-black/5 pb-3">
                <Sparkles className="w-5 h-5 text-teal" />
                {t('AI 補充建議', 'AI Suggestions')}
              </h3>
              <AIBlock 
                content={data.backlog.aiOutput}
                isLoading={isGenerating === 'backlog'}
                language={language}
                onSave={(val) => onUpdate({ backlog: { ...data.backlog, aiOutput: val } })}
                onDelete={() => onUpdate({ backlog: { ...data.backlog, aiOutput: '' } })}
                onSnapshot={() => onSaveSnapshot(t('AI 待辦建議', 'AI Backlog Suggestion'))}
              />
              {!data.backlog.aiOutput && !isGenerating && (
                <div className="text-center py-12 text-ink-light opacity-40">
                  <Target className="w-12 h-12 mx-auto mb-2" />
                  {t('點擊 AI 建議任務以獲得補充', 'Click AI Suggest Tasks for recommendations')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-black/10 flex items-center justify-between">
        <button 
          onClick={onPrev}
          className="btn btn-ghost"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('上一個衝刺', 'Previous Sprint')}
        </button>
        <button 
          onClick={onComplete}
          className="btn btn-teal px-8"
        >
          <CheckCircle2 className="w-4 h-4" />
          {t(`完成衝刺 ${sprint.id}`, `Complete Sprint ${sprint.id}`)}
          {sprint.id < 6 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
