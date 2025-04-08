'use client';

import { useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export function MonacoEditor({
  value = '',
  onChange,
  language = 'latex',
  readOnly = false,
  height = '100%',
}: MonacoEditorProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const editorRef = useRef<any>(null);

  // Save the editor reference when it's ready
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    setIsLoaded(true);
    
    // Configure specific options for LaTeX
    if (language === 'latex') {
      configureLaTeXLanguage(monaco);
    }
  };

  // Configure specific options for LaTeX
  const configureLaTeXLanguage = (monaco: Monaco) => {
    // Here we can configure syntax highlighting rules for LaTeX
    // This is a simple placeholder, will be improved later
    monaco.languages.register({ id: 'latex' });
    monaco.languages.setMonarchTokensProvider('latex', {
      tokenizer: {
        root: [
          // LaTeX commands (starting with \)
          [/\\[a-zA-Z]+/, 'keyword'],
          // Environments (begin/end)
          [/\\(begin|end)(\{)([^}]*)(\})/, ['keyword', 'delimiter.bracket', 'type', 'delimiter.bracket']],
          // Inline math $...$
          [/\$[^$]*\$/, 'string'],
          // Comments
          [/%.*$/, 'comment'],
          // Braces, parentheses and brackets
          [/[\{\}\[\]\(\)]/, 'delimiter.bracket'],
        ]
      }
    });
  };

  // Handler for editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          readOnly,
          automaticLayout: true,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          lineNumbers: 'on',
          tabSize: 2,
          matchBrackets: 'always',
          renderLineHighlight: 'line',
        }}
        loading={
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      />
    </div>
  );
} 