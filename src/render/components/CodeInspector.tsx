import React, { useState } from 'react';
import { Copy, Check, Download, FileCode2, Layers, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { CODE_TEMPLATES } from '../templates';
import { CodeVariant } from '../types';

interface CodeInspectorProps {
  onCopyNotice: () => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ onCopyNotice }) => {
  const [variant, setVariant] = useState<CodeVariant>('standard');
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const currentCode = CODE_TEMPLATES[variant];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    onCopyNotice();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.ts');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = currentCode.trim().split('\n');

  return (
    <div className="space-y-6">
      {/* Header & Variant Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">index.ts Modern Class Specification</span>
            <span className="text-xs font-mono text-zinc-500">· TypeScript ES2022</span>
          </div>
          <p className="text-xs text-zinc-400">
            Select architecture variant and inspect the class methods, port bindings, and graceful hooks.
          </p>
        </div>

        {/* Variant selector controls */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setVariant('standard')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              variant === 'standard' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Production Standard
          </button>
          <button
            onClick={() => setVariant('minimal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              variant === 'minimal' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Minimal Quick
          </button>
          <button
            onClick={() => setVariant('fullstack')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              variant === 'fullstack' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Full-Stack Vite
          </button>
          <button
            onClick={() => setVariant('worker')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              variant === 'worker' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Background Worker
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="rounded-xl border border-zinc-800 bg-[#07080c] overflow-hidden shadow-2xl">
        {/* Top Code Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileCode2 className="h-4 w-4 text-emerald-400" />
            <span className="text-zinc-200 font-semibold">index.ts</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-500">class {variant === 'standard' ? 'RenderAppServer' : variant === 'minimal' ? 'RenderQuickApp' : variant === 'fullstack' ? 'RenderFullStackApp' : 'RenderWorkerService'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/50 text-[11px]"
            >
              {showLineNumbers ? 'Hide Lines' : 'Show Lines'}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 text-[11px] transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="p-4 overflow-x-auto max-h-[580px] font-mono text-xs leading-relaxed text-zinc-300">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40">
                  {showLineNumbers && (
                    <td className="w-10 pr-4 text-right text-zinc-600 select-none text-[11px] align-top">
                      {idx + 1}
                    </td>
                  )}
                  <td className="whitespace-pre text-zinc-300">
                    {/* Basic syntax colorization */}
                    {line.includes('class ') ? (
                      <span className="text-yellow-300 font-semibold">{line}</span>
                    ) : line.includes('import ') ? (
                      <span className="text-purple-300">{line}</span>
                    ) : line.startsWith(' *') || line.startsWith('/**') || line.startsWith('//') ? (
                      <span className="text-zinc-500 italic">{line}</span>
                    ) : line.includes('private ') || line.includes('public ') ? (
                      <span className="text-sky-300">{line}</span>
                    ) : line.includes('process.env') ? (
                      <span className="text-emerald-400">{line}</span>
                    ) : (
                      line
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Architecture Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-semibold font-mono">
            <CheckCircle2 className="h-4 w-4" />
            0.0.0.0 Host Binding
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Localhost (127.0.0.1) rejects proxy connections from Render's load balancers. Binding to <code className="text-zinc-300 font-mono">0.0.0.0</code> guarantees public routing into the container.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2 text-sky-400 text-xs font-semibold font-mono">
            <ShieldCheck className="h-4 w-4" />
            SIGTERM Graceful Teardown
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            During rolling updates on Render, the old instance receives SIGTERM. The class handles connection drainage without dropping inflight HTTP requests.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2 text-purple-400 text-xs font-semibold font-mono">
            <Cpu className="h-4 w-4" />
            Dynamic $PORT Support
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Render assigns random internal ports during deployment. <code className="text-zinc-300 font-mono">process.env.PORT || 3000</code> ensures seamless compatibility in cloud and local testing.
          </p>
        </div>
      </div>
    </div>
  );
};
