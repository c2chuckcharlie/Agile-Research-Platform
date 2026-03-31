import { SprintDefinition } from "./types";

export const SPRINTS: SprintDefinition[] = [
  {
    id: 1,
    zh: { title: '研究主題與目標', sub: '研究問題定義' },
    en: { title: 'Research Topic & Objectives', sub: 'Define research problem' },
    color: '#0a7d7d',
    icon: '🎯',
    content_fields: [
      { key: 'topic', zh: '研究主題 / 題目', en: 'Research Topic / Title', type: 'text', placeholder_zh: '例：AI輔助學習在台灣高等教育中的效果研究', placeholder_en: 'e.g., AI-Assisted Learning in Taiwan Higher Education' },
      { key: 'problem', zh: '研究問題陳述', en: 'Problem Statement', type: 'textarea', placeholder_zh: '描述你的研究問題、研究缺口、以及研究的重要性...' , placeholder_en: 'Describe the research problem, gap, and significance...' },
      { key: 'objectives', zh: '研究目標（每行一個）', en: 'Research Objectives (one per line)', type: 'textarea', placeholder_zh: '1. 探討...\n2. 分析...\n3. 建立...', placeholder_en: '1. To explore...\n2. To analyze...\n3. To develop...' },
      { key: 'keywords', zh: '關鍵字', en: 'Keywords', type: 'text', placeholder_zh: 'AI, 教育科技, 學習效果', placeholder_en: 'AI, EdTech, Learning Outcomes' }
    ]
  },
  {
    id: 2,
    zh: { title: '文獻回顧', sub: '理論基礎建立' },
    en: { title: 'Literature Review', sub: 'Build theoretical foundation' },
    color: '#4a5fa0',
    icon: '📖',
    content_fields: [
      { key: 'papers', zh: '主要參考文獻（每行一篇）', en: 'Key References (one per line)', type: 'textarea', placeholder_zh: 'Smith, J. (2023). AI in Education. Journal of EdTech, 12(3), 45-67.\nLin, M. (2022). ...', placeholder_en: 'Smith, J. (2023). AI in Education. Journal of EdTech, 12(3), 45-67.' },
      { key: 'themes', zh: '主要文獻主題（分號分隔）', en: 'Key Themes (semicolon separated)', type: 'text', placeholder_zh: 'AI輔助學習; 教育科技; 學習動機; 學習成效', placeholder_en: 'AI-assisted learning; educational technology; motivation; outcomes' },
      { key: 'gap', zh: '研究缺口描述', en: 'Research Gap Description', type: 'textarea', placeholder_zh: '現有文獻尚未充分探討...', placeholder_en: 'Existing literature has not adequately addressed...' }
    ]
  },
  {
    id: 3,
    zh: { title: '研究架構與方法', sub: '概念模型建立' },
    en: { title: 'Framework & Methodology', sub: 'Build conceptual model' },
    color: '#7a4a90',
    icon: '🏗️',
    content_fields: [
      { key: 'framework', zh: '概念架構描述', en: 'Conceptual Framework Description', type: 'textarea', placeholder_zh: '本研究以XXX理論為基礎，建立...', placeholder_en: 'This study is grounded in XXX theory...' },
      { key: 'hypotheses', zh: '研究假設（每行一個）', en: 'Research Hypotheses (one per line)', type: 'textarea', placeholder_zh: 'H1: AI工具的使用頻率正向影響學習動機\nH2: ...', placeholder_en: 'H1: AI tool usage frequency positively affects learning motivation\nH2: ...' },
      { key: 'method', zh: '研究方法', en: 'Research Method', type: 'select', options_zh: ['問卷調查法', '實驗研究法', '個案研究法', '混合方法', '系統性文獻回顧', '質性研究'], options_en: ['Survey', 'Experimental', 'Case Study', 'Mixed Methods', 'Systematic Review', 'Qualitative'] },
      { key: 'sample', zh: '研究對象與抽樣', en: 'Sample & Participants', type: 'textarea', placeholder_zh: '研究對象為...，採用...抽樣方式', placeholder_en: 'Participants are..., using... sampling method' }
    ]
  },
  {
    id: 4,
    zh: { title: '資料分析', sub: '結果解讀與詮釋' },
    en: { title: 'Data Analysis', sub: 'Results interpretation' },
    color: '#a04a30',
    icon: '📊',
    content_fields: [
      { key: 'data_desc', zh: '資料描述', en: 'Data Description', type: 'textarea', placeholder_zh: '本研究共收集N份有效問卷，其中...', placeholder_en: 'This study collected N valid questionnaires...' },
      { key: 'analysis_method', zh: '統計/分析方法', en: 'Statistical/Analysis Method', type: 'text', placeholder_zh: 'SEM結構方程模型, SPSS, 迴歸分析', placeholder_en: 'SEM, ANOVA, Regression Analysis' },
      { key: 'key_findings', zh: '主要研究發現', en: 'Key Findings', type: 'textarea', placeholder_zh: '1. 發現一：...\n2. 發現二：...', placeholder_en: '1. Finding one: ...\n2. Finding two: ...' }
    ]
  },
  {
    id: 5,
    zh: { title: '論文撰寫', sub: '完整草稿生成' },
    en: { title: 'Writing the Paper', sub: 'Full draft generation' },
    color: '#1a8a3a',
    icon: '✍️',
    content_fields: [
      { key: 'abstract_draft', zh: '摘要初稿', en: 'Abstract Draft', type: 'textarea', placeholder_zh: '本研究旨在探討...本研究採用...研究結果顯示...', placeholder_en: 'This study aims to... using... findings indicate...' },
      { key: 'target_journal', zh: '目標期刊', en: 'Target Journal', type: 'text', placeholder_zh: 'SSCI / SCI 期刊名稱', placeholder_en: 'SSCI / SCI Journal Name' },
      { key: 'writing_notes', zh: '撰寫備註', en: 'Writing Notes', type: 'textarea', placeholder_zh: '字數限制、格式要求、特殊說明...', placeholder_en: 'Word count limits, formatting requirements, special notes...' }
    ]
  },
  {
    id: 6,
    zh: { title: '投稿與修訂', sub: '期刊投稿準備' },
    en: { title: 'Submission & Revision', sub: 'Journal submission prep' },
    color: '#b03060',
    icon: '🚀',
    content_fields: [
      { key: 'journal_target', zh: '目標期刊（含ISSN/IF）', en: 'Target Journal (with ISSN/IF)', type: 'text', placeholder_zh: 'Computers & Education, IF=12.4, SSCI', placeholder_en: 'Computers & Education, IF=12.4, SSCI' },
      { key: 'cover_notes', zh: '投稿函重點', en: 'Cover Letter Key Points', type: 'textarea', placeholder_zh: '研究創新點、對期刊的貢獻...', placeholder_en: 'Research novelty, contribution to journal scope...' },
      { key: 'reviewer_concerns', zh: '預期審稿意見（模擬）', en: 'Anticipated Reviewer Concerns (Simulation)', type: 'textarea', placeholder_zh: '預計審稿人可能提出的問題...', placeholder_en: 'Potential reviewer critiques...' }
    ]
  }
];
