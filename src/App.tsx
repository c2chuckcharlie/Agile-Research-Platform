import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  FileText, 
  Package, 
  Globe, 
  Home,
  CheckCircle,
  Lock,
  X,
  Download,
  AlertCircle
} from 'lucide-react';
import { AppState, Language, SprintData, Version } from './types';
import { SPRINTS } from './constants';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SprintPage } from './components/SprintPage';
import { generateResearchContent } from './services/geminiService';
import { cn } from './lib/utils';

const INITIAL_SPRINT_DATA: SprintData = {
  planning: { goal: '', tasks: '', aiOutput: '' },
  dailyScrum: [],
  review: { summary: '', aiOutput: '', qa: [3, 3, 3, 3, 3] },
  retro: { worked: '', didnt: '', improvements: '', aiOutput: '' },
  backlog: { items: [], aiOutput: '' },
  content: {},
  versions: []
};

const INITIAL_STATE: AppState = {
  researchTitle: '',
  completedSprints: [],
  sprints: SPRINTS.reduce((acc, sp) => ({ ...acc, [sp.id]: { ...INITIAL_SPRINT_DATA } }), {})
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('agile_research_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  const [language, setLanguage] = useState<Language>('zh');
  const [currentSprintId, setCurrentSprintId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: 'report' | 'all' | 'paper', sprintId?: number } | null>(null);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('agile_research_state', JSON.stringify(state));
  }, [state]);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateSprint = (sprintId: number, update: Partial<SprintData>) => {
    setState(prev => ({
      ...prev,
      sprints: {
        ...prev.sprints,
        [sprintId]: { ...prev.sprints[sprintId], ...update }
      }
    }));
  };

  const handleSaveSnapshot = (sprintId: number, label: string) => {
    const sData = state.sprints[sprintId];
    const now = new Date();
    const version: Version = {
      time: now.toLocaleTimeString(),
      label: label || t('手動儲存', 'Manual save'),
      snapshot: JSON.stringify({
        planning: sData.planning,
        review: sData.review,
        retro: sData.retro,
        content: sData.content
      })
    };
    const newVersions = [...sData.versions, version].slice(-10);
    handleUpdateSprint(sprintId, { versions: newVersions });
  };

  const handleRestoreVersion = (sprintId: number, idx: number) => {
    const version = state.sprints[sprintId].versions[idx];
    if (!version) return;
    const snap = JSON.parse(version.snapshot);
    handleUpdateSprint(sprintId, {
      planning: snap.planning,
      review: snap.review,
      retro: snap.retro,
      content: snap.content
    });
    showToast(t('版本已還原', 'Version restored'), 'success');
  };

  const handleGenerateAI = async (sprintId: number, type: string) => {
    const sp = SPRINTS[sprintId - 1];
    const sData = state.sprints[sprintId];
    setIsGenerating(type);

    try {
      let prompt = "";
      if (type === 'planning') {
        prompt = `Sprint: ${sp.id} - ${sp.en.title}\nResearch Title: ${state.researchTitle || 'Research paper'}\nSprint Goal: ${sData.planning.goal}\nUser's Tasks: ${sData.planning.tasks}\n\nPlease provide: 1. A refined sprint goal statement. 2. A prioritized task breakdown. 3. Time estimates. 4. Risks. 5. Definition of Done.`;
      } else if (type === 'content') {
        const contentVals = sp.content_fields.map(f => `${f.en}: ${sData.content[f.key] || 'Not specified'}`).join('\n');
        prompt = `Sprint ${sp.id} Content Generation. Research Title: ${state.researchTitle}\nInputs:\n${contentVals}\n\nPlease help me develop this research section further. Provide academic insights, structure, and content suggestions.`;
      } else if (type === 'daily') {
        const lastLog = sData.dailyScrum[sData.dailyScrum.length - 1];
        prompt = `Daily Scrum Log Analysis. Done: ${lastLog.done}, Plan: ${lastLog.plan}, Blockers: ${lastLog.block}. Provide 3-4 concise coaching insights.`;
      } else if (type === 'review') {
        prompt = `Sprint Review Evaluation. Summary: ${sData.review.summary}. Evaluate output quality, alignment with standards, and gaps.`;
      } else if (type === 'retro') {
        prompt = `Retrospective Analysis. Worked: ${sData.retro.worked}, Didn't: ${sData.retro.didnt}, Improvements: ${sData.retro.improvements}. Suggest improvement strategies.`;
      } else if (type === 'backlog') {
        prompt = `Backlog Refinement. Current items: ${sData.backlog.items.map(i => i.text).join('; ')}. Suggest 5-7 prioritized tasks for the next phase.`;
      }

      const result = await generateResearchContent(prompt, language);
      
      if (type === 'daily') {
        const newLogs = [...sData.dailyScrum];
        newLogs[newLogs.length - 1].aiInsight = result;
        handleUpdateSprint(sprintId, { dailyScrum: newLogs });
      } else {
        const key = type === 'content' ? 'content' : type;
        handleUpdateSprint(sprintId, { [key]: { ...sData[key as keyof SprintData], aiOutput: result } } as any);
      }
      
      handleSaveSnapshot(sprintId, `AI ${type} ${t('生成', 'Generation')}`);
      showToast(t('AI 生成成功！', 'AI Generation successful!'), 'success');
    } catch (error) {
      showToast(t('AI 生成失敗', 'AI Generation failed'), 'error');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleCompleteSprint = (id: number) => {
    if (!state.completedSprints.includes(id)) {
      setState(prev => ({ ...prev, completedSprints: [...prev.completedSprints, id] }));
    }
    showToast(t(`衝刺 ${id} 已完成！`, `Sprint ${id} completed!`), 'success');
    if (id < 6) setCurrentSprintId(id + 1);
  };

  const buildReportText = (sprintId: number) => {
    const sp = SPRINTS[sprintId - 1];
    const sData = state.sprints[sprintId];
    const title = language === 'zh' ? sp.zh.title : sp.en.title;
    const hr = '═'.repeat(60);
    const lines = [
      hr,
      `SPRINT ${sp.id} REPORT: ${title.toUpperCase()}`,
      hr,
      `Research: ${state.researchTitle || 'N/A'}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '─── SPRINT PLANNING ───────────────────────────────────',
      `Goal: ${sData.planning.goal || 'N/A'}`,
      `Tasks:\n${sData.planning.tasks || 'N/A'}`,
      sData.planning.aiOutput ? `AI Suggestions:\n${sData.planning.aiOutput}` : '',
      '',
      '─── RESEARCH CONTENT ──────────────────────────────────',
      ...sp.content_fields.map(f => `${f.en}: ${sData.content[f.key] || 'N/A'}`),
      sData.content.aiOutput ? `AI Content:\n${sData.content.aiOutput}` : '',
      '',
      '─── DAILY SCRUM LOGS ──────────────────────────────────',
      ...sData.dailyScrum.map((log, i) => `Day ${i+1} (${log.date}):\n  Done: ${log.done}\n  Plan: ${log.plan}\n  Block: ${log.block}\n  AI: ${log.aiInsight}`),
      '',
      '─── SPRINT REVIEW ─────────────────────────────────────',
      `Summary: ${sData.review.summary || 'N/A'}`,
      sData.review.aiOutput ? `AI Review:\n${sData.review.aiOutput}` : '',
      '',
      '─── RETROSPECTIVE ─────────────────────────────────────',
      `Worked: ${sData.retro.worked || 'N/A'}`,
      `Didn't: ${sData.retro.didnt || 'N/A'}`,
      `Improvements: ${sData.retro.improvements || 'N/A'}`,
      sData.retro.aiOutput ? `AI Retro:\n${sData.retro.aiOutput}` : '',
      '',
      '─── BACKLOG ───────────────────────────────────────────',
      ...sData.backlog.items.map(item => `[${item.priority.toUpperCase()}] ${item.text}`),
      sData.backlog.aiOutput ? `AI Backlog:\n${sData.backlog.aiOutput}` : '',
      '',
      hr,
      'END OF REPORT'
    ];
    return lines.join('\n');
  };

  const handleDownload = (sprintId: number) => {
    const text = buildReportText(sprintId);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-${sprintId}-report.txt`;
    a.click();
    showToast(t('報告已下載', 'Report downloaded'), 'success');
  };

  const handleDownloadAll = () => {
    let combined = `AGILE RESEARCH WRITING PLATFORM\nCOMPLETE RESEARCH JOURNAL\n${'═'.repeat(60)}\nResearch: ${state.researchTitle || 'N/A'}\nGenerated: ${new Date().toLocaleString()}\n\n`;
    for (let i = 1; i <= 6; i++) {
      combined += buildReportText(i) + '\n\n';
    }
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complete-research-journal.txt';
    a.click();
    showToast(t('完整研究日誌已下載', 'Complete research journal downloaded'), 'success');
  };

  const progressPct = Math.round((state.completedSprints.length / 6) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header h-16 bg-ink text-cream flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal to-amber rounded-lg flex items-center justify-center text-lg">📚</div>
          <div>
            <div className="text-lg font-display tracking-wide">{t('敏捷研究寫作平台', 'Agile Research Writing Platform')}</div>
            <div className="text-[10px] opacity-60 uppercase tracking-widest">Agile Research Writing Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-1 rounded-full flex gap-1">
            <button 
              onClick={() => setLanguage('zh')}
              className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-all", language === 'zh' ? "bg-amber text-ink" : "text-cream/60 hover:text-cream")}
            >中文</button>
            <button 
              onClick={() => setLanguage('en')}
              className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-all", language === 'en' ? "bg-amber text-ink" : "text-cream/60 hover:text-cream")}
            >EN</button>
          </div>
          <button onClick={() => setCurrentSprintId(null)} className="btn btn-ghost btn-sm text-cream border-white/20 hover:bg-white/10">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t('總覽', 'Overview')}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-ink-mid fixed top-16 bottom-0 left-0 overflow-y-auto py-6 hidden md:block z-40">
          <div className="px-4 mb-6">
            <div className="text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-3 px-2">{t('研究衝刺', 'Research Sprints')}</div>
            <div className="space-y-1">
              {SPRINTS.map((sp, idx) => {
                const isUnlocked = idx === 0 || state.completedSprints.includes(idx);
                const isActive = currentSprintId === sp.id;
                const isDone = state.completedSprints.includes(sp.id);
                return (
                  <button
                    key={sp.id}
                    disabled={!isUnlocked}
                    onClick={() => setCurrentSprintId(sp.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left group",
                      isActive ? "bg-white/10 text-cream" : isUnlocked ? "text-cream/60 hover:bg-white/5 hover:text-cream" : "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: isUnlocked ? sp.color : 'rgba(255,255,255,0.1)', color: 'white' }}>
                      {sp.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">S{sp.id} · {language === 'zh' ? sp.zh.title : sp.en.title}</div>
                      <div className="text-[9px] opacity-50 truncate">{language === 'zh' ? sp.zh.sub : sp.en.sub}</div>
                    </div>
                    {isDone ? <CheckCircle className="w-3 h-3 text-sage shrink-0" /> : !isUnlocked && <Lock className="w-3 h-3 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5">
            <div className="flex justify-between text-[10px] text-cream/40 mb-2">
              <span>{t('整體進度', 'Overall Progress')}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal to-amber transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="px-4 mt-4">
            <div className="text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-3 px-2">{t('工具', 'Tools')}</div>
            <div className="space-y-1">
              <button onClick={() => setModal({ type: 'paper' })} className="w-full flex items-center gap-3 p-2 rounded-lg text-cream/60 hover:bg-white/5 hover:text-cream transition-all text-left">
                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-xs">📄</div>
                <div className="flex-1">
                  <div className="text-xs font-medium">{t('論文預覽', 'Paper Preview')}</div>
                  <div className="text-[9px] opacity-50">{t('查看當前草稿', 'View current draft')}</div>
                </div>
              </button>
              <button onClick={() => setModal({ type: 'all' })} className="w-full flex items-center gap-3 p-2 rounded-lg text-cream/60 hover:bg-white/5 hover:text-cream transition-all text-left">
                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-xs">📦</div>
                <div className="flex-1">
                  <div className="text-xs font-medium">{t('匯出全部', 'Export All')}</div>
                  <div className="text-[9px] opacity-50">{t('下載所有報告', 'Download all reports')}</div>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-8 bg-cream min-h-full">
          {currentSprintId === null ? (
            <WelcomeScreen 
              language={language}
              researchTitle={state.researchTitle}
              onTitleChange={(title) => setState(prev => ({ ...prev, researchTitle: title }))}
              onStart={() => setCurrentSprintId(1)}
              onSprintSelect={setCurrentSprintId}
              completedSprints={state.completedSprints}
            />
          ) : (
            <SprintPage 
              sprint={SPRINTS[currentSprintId - 1]}
              data={state.sprints[currentSprintId]}
              language={language}
              researchTitle={state.researchTitle}
              isGenerating={isGenerating}
              onUpdate={(update) => handleUpdateSprint(currentSprintId, update)}
              onComplete={() => handleCompleteSprint(currentSprintId)}
              onPrev={() => setCurrentSprintId(prev => prev && prev > 1 ? prev - 1 : null)}
              onGenerateAI={(type) => handleGenerateAI(currentSprintId, type)}
              onPreview={() => setModal({ type: 'report', sprintId: currentSprintId })}
              onDownload={() => handleDownload(currentSprintId)}
              onSaveSnapshot={(label) => handleSaveSnapshot(currentSprintId, label)}
              onRestore={(idx) => handleRestoreVersion(currentSprintId, idx)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="h-16 border-b border-black/5 flex items-center justify-between px-6 shrink-0">
              <h3 className="text-lg font-display text-ink">
                {modal.type === 'report' && `${t('報告預覽', 'Report Preview')}: Sprint ${modal.sprintId}`}
                {modal.type === 'paper' && t('論文當前草稿', 'Current Paper Draft')}
                {modal.type === 'all' && t('匯出所有衝刺報告', 'Export All Sprint Reports')}
              </h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-cream-dark rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-cream/30">
              {modal.type === 'report' && modal.sprintId && (
                <div className="space-y-6">
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => handleDownload(modal.sprintId!)} className="btn btn-primary">
                      <Download className="w-4 h-4" /> {t('下載 TXT', 'Download TXT')}
                    </button>
                  </div>
                  <div className="bg-white p-12 rounded-xl shadow-lg font-serif text-sm leading-relaxed whitespace-pre-wrap border border-black/5">
                    {buildReportText(modal.sprintId)}
                  </div>
                </div>
              )}

              {modal.type === 'paper' && (
                <div className="bg-white p-12 rounded-xl shadow-lg border border-black/5">
                  <div className="text-center mb-12 border-b-2 border-ink pb-8">
                    <h2 className="text-3xl font-display text-ink mb-2">{state.researchTitle || t('（未設定題目）', '(No title set)')}</h2>
                    <div className="text-xs text-ink-light opacity-60">{new Date().toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-8">
                    {[
                      { key: 'topic', s: 1, zh: '研究題目', en: 'Title' },
                      { key: 'problem', s: 1, zh: '研究問題', en: 'Problem Statement' },
                      { key: 'objectives', s: 1, zh: '研究目標', en: 'Objectives' },
                      { key: 'gap', s: 2, zh: '研究缺口', en: 'Research Gap' },
                      { key: 'framework', s: 3, zh: '研究架構', en: 'Framework' },
                      { key: 'hypotheses', s: 3, zh: '研究假設', en: 'Hypotheses' },
                      { key: 'key_findings', s: 4, zh: '研究發現', en: 'Key Findings' },
                      { key: 'abstract_draft', s: 5, zh: '摘要', en: 'Abstract' },
                    ].map(sec => {
                      const val = state.sprints[sec.s]?.content[sec.key];
                      if (!val) return null;
                      return (
                        <div key={sec.key} className="border-l-4 border-teal/20 pl-6">
                          <h4 className="text-xs font-bold text-teal uppercase tracking-widest mb-2">{t(sec.zh, sec.en)}</h4>
                          <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{val}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {modal.type === 'all' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {SPRINTS.map(sp => (
                      <div key={sp.id} className="card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${sp.color}15`, color: sp.color }}>{sp.icon}</div>
                          <div>
                            <div className="text-sm font-bold">Sprint {sp.id}: {language === 'zh' ? sp.zh.title : sp.en.title}</div>
                            <div className="text-[10px] text-ink-light">{state.completedSprints.includes(sp.id) ? `✓ ${t('已完成', 'Completed')}` : t('進行中', 'In Progress')}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleDownload(sp.id)} className="btn btn-ghost btn-sm">TXT</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleDownloadAll} className="btn btn-teal w-full py-4 mt-4">
                    <Download className="w-5 h-5" />
                    {t('下載全部 TXT 報告', 'Download All TXT Reports')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-8 right-8 z-[200] px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-right-4 duration-300",
          toast.type === 'success' ? "bg-ink text-sage-light border-l-4 border-sage" : 
          toast.type === 'error' ? "bg-ink text-rose-light border-l-4 border-rose" : "bg-ink text-teal-light border-l-4 border-teal"
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
