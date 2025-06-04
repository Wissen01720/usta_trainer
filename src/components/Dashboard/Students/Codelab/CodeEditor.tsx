import React, { useState, useEffect } from 'react';
import { CodeEditorProps } from './types';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  const [localCode, setLocalCode] = useState(code);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setLocalCode(newCode);
    onChange(newCode);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-95"></div>
      <textarea
        value={localCode}
        onChange={handleChange}
        className="relative z-10 w-full h-full resize-none font-mono text-sm p-6 bg-transparent text-emerald-400 placeholder-slate-500 border-0 outline-none selection:bg-emerald-400/20"
        placeholder="# ¡Escribe tu código aquí y crea algo increíble! ✨"
        spellCheck={false}
        style={{
          tabSize: 2,
          lineHeight: '1.6',
          textShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
        }}
      />
      <div className="absolute top-4 right-4 z-20">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;