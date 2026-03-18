import { useState, useCallback, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Button } from '@/components/ui';
import { clsx } from 'clsx';

interface CodeEditorProps {
  roomId: string;
  onRunCode?: (code: string, language: string) => void;
  isRunning?: boolean;
  output?: string;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', id: 63 },
  { value: 'typescript', label: 'TypeScript', id: 74 },
  { value: 'python', label: 'Python', id: 71 },
  { value: 'java', label: 'Java', id: 62 },
  { value: 'cpp', label: 'C++', id: 54 },
  { value: 'c', label: 'C', id: 50 },
  { value: 'go', label: 'Go', id: 60 },
  { value: 'rust', label: 'Rust', id: 73 },
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: '// Write your solution here\nfunction solve(input) {\n  \n}\n',
  typescript: '// Write your solution here\nfunction solve(input: string): string {\n  \n}\n',
  python: '# Write your solution here\ndef solve(input):\n    pass\n',
  java: '// Write your solution here\nclass Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  c: '// Write your solution here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n',
  go: '// Write your solution here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello")\n}\n',
  rust: '// Write your solution here\nfn main() {\n    \n}\n',
};

export default function CodeEditor({ roomId, onRunCode, isRunning, output }: CodeEditorProps) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
  }, []);

  const handleRun = () => {
    if (onRunCode) {
      onRunCode(code, language);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-10 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-caption font-sans text-text-primary focus:outline-none focus:border-accent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleRun} isLoading={isRunning}>
            ▶ Run
          </Button>
        </div>
      </div>

      {/* Editor + Output split */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Monaco Editor */}
        <div className={clsx('flex-1 min-h-0', output !== undefined && 'h-[70%]')}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 12 },
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              bracketPairColorization: { enabled: true },
              cursorBlinking: 'smooth',
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Output Console */}
        {output !== undefined && (
          <div className="h-[30%] min-h-[100px] bg-[#1e1e1e] border-t border-border-subtle flex flex-col">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#333]">
              <span className="text-caption text-text-muted font-mono">Output</span>
              {isRunning && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] text-text-muted font-mono">Running...</span>
                </div>
              )}
            </div>
            <pre className="flex-1 overflow-auto p-3 font-mono text-caption text-[#d4d4d4] whitespace-pre-wrap">
              {output || 'Run your code to see output here.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
