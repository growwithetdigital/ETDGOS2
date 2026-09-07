import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, FileText, Send, Share2, Globe, Sparkles, BarChart2, 
  Terminal, ArrowRight, Play, CheckCircle2, ChevronRight, Lock
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  capabilities: string[];
  metrics: { label: string; value: string; trend?: string }[];
  visualType: 'editor' | 'distribution' | 'seo' | 'authority' | 'analytics' | 'automation';
}

export default function GrowthOSModules() {
  const [activeModuleId, setActiveModuleId] = useState<string>('content-intel');
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const [automationActive, setAutomationActive] = useState(false);
  const [editorText, setEditorText] = useState('Our core methodology focuses on systematic distribution rather than random campaigns. When a partner utilizes a Growth OS, the results scale exponentially because...');

  const modules: Module[] = [
    {
      id: 'content-intel',
      title: 'Content Intelligence',
      description: 'Knowledge capture & intent mapping',
      longDescription: 'Captures and structure-maps founder expertise, industry webinars, and client success transcripts into a central intelligence file. Identifies key executive-level strategic insights.',
      capabilities: [
        'Transcribe & summarize strategic intent',
        'Identify unique corporate narrative pillars',
        'Semantic keyword map translation',
        'Audience interest matrix extraction'
      ],
      metrics: [
        { label: 'Raw Transcripts Filtered', value: '184 Hrs' },
        { label: 'Strategic Pillars Extracted', value: '42 Assets' }
      ],
      visualType: 'editor'
    },
    {
      id: 'distribution-eng',
      title: 'Distribution Engine',
      description: 'Multi-channel assets coordinator',
      longDescription: 'Synthesizes master pillar documents and distributes channel-specific formats across LinkedIn, newsletter directories, industry portals, and customer forums simultaneously.',
      capabilities: [
        'Atomic-to-macro content compiler',
        'Multi-channel asset formatting rules',
        'Coordinated publication timing',
        'Channel resonance tracking'
      ],
      metrics: [
        { label: 'Active Output Channels', value: '6 Channels' },
        { label: 'Successful Placements', value: '1,420 / Mo' }
      ],
      visualType: 'distribution'
    },
    {
      id: 'seo-engine',
      title: 'SEO Engine',
      description: 'Long-term organic authority generator',
      longDescription: 'Creates exhaustive topic clusters, automates internal link structuring, maps high-intent search queries, and manages structural code elements to maximize Google organic visibility.',
      capabilities: [
        'Semantic topic-cluster mapper',
        'Anchor-text link coordinator',
        'Search Intent priority analysis',
        'Automated Schema injection logs'
      ],
      metrics: [
        { label: 'Organic Position Increase', value: '+14 Avg' },
        { label: 'Search Impression Yield', value: '412K / Mo' }
      ],
      visualType: 'seo'
    },
    {
      id: 'authority-engine',
      title: 'Authority Engine',
      description: 'Thought leadership and guest distribution',
      longDescription: 'Integrates expert insights into guest articles, high-authority press mentions, and prominent digital newsletters. Anchors your executive team as trusted voices.',
      capabilities: [
        'Pitch draft generator',
        'High-authority placement database',
        'Quote syndication pipelines',
        'Co-authored strategy modules'
      ],
      metrics: [
        { label: 'Partner Outlets Connected', value: '240+' },
        { label: 'Feature Placements', value: '8 / Mo' }
      ],
      visualType: 'authority'
    },
    {
      id: 'analytics-dash',
      title: 'Analytics Dashboard',
      description: 'Unified operational reporting matrix',
      longDescription: 'Bypasses vanity metrics to map exact revenue-related KPIs. Track lead attribution back to original raw insights, analyzing which strategic pillars generate pipeline growth.',
      capabilities: [
        'Original raw insight attribution tracking',
        'Multi-touch pipeline analysis',
        'Conversion flow audit maps',
        'Executive ROI summary views'
      ],
      metrics: [
        { label: 'Attributed Pipeline', value: '$2.4M' },
        { label: 'Operating Cost Efficiency', value: '+62%' }
      ],
      visualType: 'analytics'
    },
    {
      id: 'ai-automation',
      title: 'AI Workflow Automation',
      description: 'Custom integration agents',
      longDescription: 'Eliminates friction. Triggers automatic drafting, multi-stage approval channels, cross-posting schedules, and instant formatting transformations the moment you log a new idea.',
      capabilities: [
        'Webhook-based workflow triggers',
        'Automatic cross-formatting logic',
        'Multi-channel approval queues',
        'Auto-indexing knowledge base sync'
      ],
      metrics: [
        { label: 'Manual Tasks Automated', value: '18 Tasks' },
        { label: 'Friction Time Reduced', value: '32 Hrs/Mo' }
      ],
      visualType: 'automation'
    }
  ];

  const handleModuleClick = (id: string) => {
    setSimulatedLoading(true);
    setActiveModuleId(id);
    setTimeout(() => setSimulatedLoading(false), 300);
  };

  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];

  return (
    <section id="growth-os" className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan bg-cyan-50 px-3.5 py-1.5 rounded-full inline-block mb-4">
            System Modules
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            The Growth OS™ Workspace
          </h2>
          <p className="font-sans text-lg text-slate-600">
            A software-grade suite designed to replace disorganized marketing agencies. Manage your company’s market growth as a streamlined, high-performance operating system.
          </p>
        </div>

        {/* Main Software Dashboard Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-6xl mx-auto">
          
          {/* Dashboard Left Sidebar (Modules list) - 5 Cols */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4 px-2">
                Active System Modules
              </div>
              
              {modules.map((mod) => {
                const isActive = mod.id === activeModuleId;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-white border-brand-cyan shadow-sm text-slate-950'
                        : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-cyan-50 text-brand-cyan' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                      }`}>
                        {mod.id === 'content-intel' && <FileText className="w-4 h-4" />}
                        {mod.id === 'distribution-eng' && <Send className="w-4 h-4" />}
                        {mod.id === 'seo-engine' && <Globe className="w-4 h-4" />}
                        {mod.id === 'authority-engine' && <Sparkles className="w-4 h-4" />}
                        {mod.id === 'analytics-dash' && <BarChart2 className="w-4 h-4" />}
                        {mod.id === 'ai-automation' && <Cpu className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold tracking-tight">
                          {mod.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-400">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-brand-cyan translate-x-1' : 'text-slate-300'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Status Bar */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All modules synchronized
              </div>
              <div>v2.4-stable</div>
            </div>
          </div>

          {/* Dashboard Right Preview Window (Interactive Sandbox) - 7 Cols */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 flex flex-col justify-between min-h-[500px]">
            
            {/* Header Area */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  {activeModule.title}
                </h3>
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
              </div>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                {activeModule.longDescription}
              </p>
            </div>

            {/* Main Interactive Preview Screen */}
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 shadow-inner relative overflow-hidden flex flex-col justify-between">
              
              {/* Grid Background in Code Simulator */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

              {simulatedLoading ? (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center flex-col gap-2 z-10">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
                  <span className="text-slate-400 font-mono text-[10px]">Loading Workspace Engine...</span>
                </div>
              ) : null}

              {/* Dynamic Content depending on activeModule's visualType */}
              <div className="relative z-10 flex-1 flex flex-col">
                
                {/* Visual: Editor Workspace */}
                {activeModule.visualType === 'editor' && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-slate-500 text-[10px] uppercase">Knowledge Input Parser</span>
                      <span className="text-brand-cyan text-[10px]">ACTIVE COMPILER</span>
                    </div>
                    <div className="flex-1 min-h-[140px]">
                      <textarea
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                        className="w-full h-full bg-transparent border-none text-slate-300 focus:outline-none resize-none font-mono text-xs leading-relaxed"
                      />
                    </div>
                    <div className="bg-slate-900/60 rounded p-2 text-[10px] text-slate-400 flex items-center justify-between border border-slate-800/80">
                      <span>Pillars Count: <strong>3 Detected</strong></span>
                      <span>Readability Index: <strong>92/100</strong></span>
                    </div>
                  </div>
                )}

                {/* Visual: Distribution Console */}
                {activeModule.visualType === 'distribution' && (
                  <div className="flex flex-col h-full justify-between gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-1">
                      <span className="text-slate-500 text-[10px] uppercase">Channel Propagation Queue</span>
                      <span className="text-emerald-400 text-[10px]">SYNC: ACTIVE</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-300">📁 Blog: custom-brand-guide.md</span>
                        <span className="bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">DEPLOYED</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-300">👥 LinkedIn: 3 Thread snippets</span>
                        <span className="bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">DEPLOYED</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-300">✉️ Newsletter: Substack template HTML</span>
                        <span className="bg-cyan-950/50 text-brand-cyan px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">QUEUED (11:00 AM)</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 text-center italic">
                      Deploying assets symmetrically prevents SEO duplication penalties automatically.
                    </div>
                  </div>
                )}

                {/* Visual: SEO Map */}
                {activeModule.visualType === 'seo' && (
                  <div className="flex flex-col h-full justify-between gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-1">
                      <span className="text-slate-500 text-[10px] uppercase">Topic Cluster Architect</span>
                      <span className="text-brand-cyan text-[10px]">CORE GRAPH</span>
                    </div>
                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/40 rounded border border-slate-800">
                      <div className="text-brand-cyan font-bold font-display">[Pillar] Growth Operating System</div>
                      <div className="pl-4 text-slate-400">├── [Cluster] Scalable Marketing System (Search Vol: 4,200)</div>
                      <div className="pl-4 text-slate-400">├── [Cluster] Agency vs OS Model (Search Vol: 1,800)</div>
                      <div className="pl-4 text-slate-400">└── [Cluster] Knowledge-Base Marketing Automation</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-400 flex justify-between">
                      <span>Internal Links Built: <strong>48</strong></span>
                      <span>Target Difficulty Score: <strong>Low-Med</strong></span>
                    </div>
                  </div>
                )}

                {/* Visual: Authority Pipeline */}
                {activeModule.visualType === 'authority' && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-slate-500 text-[10px] uppercase">Guest Placement Tracking</span>
                      <span className="text-brand-cyan text-[10px]">AUTHORITY SCORE: 82</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 justify-center">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">Forbes Tech Council</span>
                        <span className="text-emerald-400">Scheduled (Jul 12)</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">RealEstate Insider</span>
                        <span className="text-emerald-400">Published (DR 74)</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">SaaS Systems Review</span>
                        <span className="text-emerald-400">Published (DR 68)</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 text-center">
                      Author quotes extracted from original audio file to ensure 100% natural compliance.
                    </div>
                  </div>
                )}

                {/* Visual: Analytics Dashboard */}
                {activeModule.visualType === 'analytics' && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-slate-500 text-[10px] uppercase">Client Conversion Funnel</span>
                      <span className="text-emerald-400 text-[10px]">REVENUE METRICS</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 my-2">
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 uppercase block">Visits</span>
                        <span className="text-sm font-bold text-slate-100">18,410</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 uppercase block">MQL Leads</span>
                        <span className="text-sm font-bold text-brand-cyan">342</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 uppercase block">Signups</span>
                        <span className="text-sm font-bold text-emerald-400">28</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Attributed Pipeline Growth: <strong className="text-emerald-400">+$214K</strong></span>
                      <span>Growth Coefficient: <strong className="text-brand-cyan">1.82x</strong></span>
                    </div>
                  </div>
                )}

                {/* Visual: AI Automation node builder */}
                {activeModule.visualType === 'automation' && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-slate-500 text-[10px] uppercase">Workflow Automation Graph</span>
                      <span className="text-brand-cyan text-[10px]">TRIGGERS READY</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200 flex items-center gap-2 text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Capture Transcribed
                      </div>
                      <div className="h-4 w-0.5 bg-slate-800" />
                      <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200 flex items-center gap-2 text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        AI Structure Assets
                      </div>
                      <div className="h-4 w-0.5 bg-slate-800" />
                      <div className="flex gap-4">
                        <div className="bg-slate-900 px-2 py-1.5 rounded border border-slate-800 text-[9px] text-slate-400">
                          Draft Newsletter
                        </div>
                        <div className="bg-slate-900 px-2 py-1.5 rounded border border-slate-800 text-[9px] text-slate-400">
                          Generate Social Threads
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button 
                        onClick={() => {
                          setAutomationActive(true);
                          setTimeout(() => setAutomationActive(false), 2000);
                        }}
                        className="bg-brand-cyan hover:bg-cyan-500 text-slate-950 px-3 py-1.5 rounded font-bold font-mono text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        {automationActive ? 'EXECUTING GRAPH...' : 'TEST WORKFLOW RUN'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Capabilities and Bottom Metrics */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {activeModule.metrics.map((met, idx) => (
                  <div key={idx} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                    <span className="font-sans text-xs text-slate-400 block mb-0.5">
                      {met.label}
                    </span>
                    <span className="font-display text-xl font-extrabold text-slate-900">
                      {met.value}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Core Module Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModule.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
