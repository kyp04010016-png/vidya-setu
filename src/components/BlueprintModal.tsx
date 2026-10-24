import React, { useState } from 'react';
import { X, Copy, Check, FileCode2 } from 'lucide-react';
import { BLUEPRINT_FILES } from '../data/blueprintFiles';

interface BlueprintModalProps {
  open: boolean;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ open, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const activeFile = BLUEPRINT_FILES[selectedIndex] || BLUEPRINT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 animate-page-transition">
      <div className="bg-white border border-slate-200 rounded-xl max-w-5xl w-full h-[82vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-5 h-5 text-blue-800" />
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Full-Stack Architecture & Master Blueprint Explorer (Steps 1–7)
              </h2>
              <p className="text-xs text-slate-500">
                Inspect & copy the Prisma Schema, Express Backend, Next.js Static Export Config, and Hostinger/Render Deployment Blueprint.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          <div className="border-r border-slate-200 bg-slate-50 overflow-y-auto p-3 space-y-1.5">
            {BLUEPRINT_FILES.map((file, idx) => (
              <button
                key={file.path}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedIndex === idx
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <p
                  className={`text-[11px] font-medium ${
                    selectedIndex === idx ? 'text-blue-300' : 'text-slate-500'
                  }`}
                >
                  {file.step}
                </p>
                <p className="font-mono text-xs font-semibold truncate mt-0.5">{file.path}</p>
              </button>
            ))}
          </div>

          <div className="md:col-span-2 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-xs text-blue-400 truncate">{activeFile.path}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{activeFile.description}</p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-md shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy File'}</span>
              </button>
            </div>
            <pre className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-slate-200">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
