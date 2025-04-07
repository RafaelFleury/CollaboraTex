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

  // Salvar a referência do editor quando estiver pronto
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    setIsLoaded(true);
    
    // Configurar opções específicas para LaTeX
    if (language === 'latex') {
      configureLaTeXLanguage(monaco);
    }
  };

  // Configurar opções específicas para LaTeX
  const configureLaTeXLanguage = (monaco: Monaco) => {
    // Aqui podemos configurar regras de syntax highlighting para LaTeX
    // Este é um placeholder simples, depois será aprimorado
    monaco.languages.register({ id: 'latex' });
    monaco.languages.setMonarchTokensProvider('latex', {
      tokenizer: {
        root: [
          // Comandos LaTeX (iniciando com \)
          [/\\[a-zA-Z]+/, 'keyword'],
          // Ambientes (begin/end)
          [/\\(begin|end)(\{)([^}]*)(\})/, ['keyword', 'delimiter.bracket', 'type', 'delimiter.bracket']],
          // Matemática inline $...$
          [/\$[^$]*\$/, 'string'],
          // Comentários
          [/%.*$/, 'comment'],
          // Chaves, parênteses e colchetes
          [/[\{\}\[\]\(\)]/, 'delimiter.bracket'],
        ]
      }
    });
  };

  // Handler para mudanças no editor
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