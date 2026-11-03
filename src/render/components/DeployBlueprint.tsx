import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { RENDER_YAML_SPEC } from '../templates';

export const DeployBlueprint: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RENDER_YAML_SPEC);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: '01',
      title: 'Push index.ts to GitHub or GitLab',
      desc: 'Commit index.ts along with your package.json into your repository root.',
    },
    {
      num: '02',
      title: 'Create Web Service on Render',
      desc: 'In your Render.com dashboard, click New + -> Web Service and link your repository.',
    },
    {
      num: '03',
      title: 'Configure Runtime & Commands',
      desc: 'Runtime: Node · Build Command: npm install · Start Command: npx tsx index.ts',
    },
    {
      num: '04',
      title: 'Attach Zero-Downtime Health Check',
      desc: 'Set Health Check Path to /healthz. Render will verify response before routing live traffic.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Blueprint Top Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>render.yaml — Infrastructure as Code Blueprint</span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
              Declarative Spec
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Render Blueprints allow 1-click synchronized deployment of web services, databases, and cron workers.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
          <span>{copied ? 'Copied YAML' : 'Copy render.yaml'}</span>
        </button>
      </div>

      {/* YAML Code Viewer */}
      <div className="rounded-xl border border-zinc-800 bg-[#07080c] overflow-hidden">
        <div className="px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between">
          <span className="text-zinc-200">render.yaml</span>
          <span className="text-[11px] text-zinc-500">Render Cloud Manifest</span>
        </div>
        <pre className="p-4 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
          {RENDER_YAML_SPEC}
        </pre>
      </div>

      {/* 4-Step Walkthrough */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-4">
          Render.com Deployment Sequence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.num} className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/90">
              <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
                {step.num}
              </span>
              <h5 className="text-sm font-semibold text-white mb-1.5">{step.title}</h5>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Render Pitfalls Avoided */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-white">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Why this Modern Class Architecture solves Render Pitfalls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-rose-400 font-mono font-semibold block mb-1">
              Common Mistake: Binding to 127.0.0.1
            </span>
            <p className="text-zinc-400 leading-relaxed">
              If an index file listens on <code>127.0.0.1</code> or <code>localhost</code>, Render's edge proxy cannot reach your container, causing repeated <code>Port check failed</code> errors. Our class binds strictly to <code>0.0.0.0</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-rose-400 font-mono font-semibold block mb-1">
              Common Mistake: Hardcoding Port 8080 or 3000
            </span>
            <p className="text-zinc-400 leading-relaxed">
              Render dynamically assigns an environment variable <code>PORT</code> at container boot time. Our class prioritizes <code>process.env.PORT</code>, ensuring zero deployment collision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
