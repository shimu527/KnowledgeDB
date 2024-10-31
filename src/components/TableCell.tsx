import React, { useState } from 'react';
import { CellType } from '../types';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Register languages
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c++', cpp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('rust', rust);

interface TableCellProps {
  value: string;
  type: CellType;
  onChange: (value: string) => void;
}

const TableCell: React.FC<TableCellProps> = ({ value, type, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return; // Allow new lines with Shift+Enter
    }
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const parseCodeBlock = (content: string) => {
    const codeBlockRegex = /^```([\w+]+)?\n([\s\S]*?)```$/;
    const match = content.match(codeBlockRegex);
    
    if (match) {
      let language = match[1]?.toLowerCase() || 'text';
      if (['c++', 'cpp'].includes(language)) {
        language = 'cpp';
      }
      return {
        language,
        code: match[2]
      };
    }
    
    return {
      language: 'text',
      code: content
    };
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-1 rounded min-h-[32px] resize-y font-sans text-sm bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onBlur={() => setIsEditing(false)}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder={
            type === 'code' 
              ? 'Enter code with ```language\ncode\n```\nSupported: cpp/c++, python, js, ts, java, rust'
              : type === 'markdown'
              ? 'Enter Markdown content (supports GFM)'
              : `Enter ${type} content`
          }
        />
      );
    }

    switch (type) {
      case 'latex':
        return value ? (
          <div className="whitespace-pre-wrap">
            <Latex>{value}</Latex>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Empty</span>
        );
      case 'markdown':
        return value ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Empty</span>
        );
      case 'code': {
        if (!value) {
          return <span className="text-gray-400 text-sm">Empty</span>;
        }
        const { language, code } = parseCodeBlock(value);
        return (
          <div className="relative font-mono text-sm">
            {language !== 'text' && (
              <div className="absolute top-0 right-0 text-xs text-gray-300 px-2 py-1 bg-gray-800 rounded-bl">
                {language}
              </div>
            )}
            <SyntaxHighlighter 
              language={language}
              style={vs2015}
              wrapLines
              wrapLongLines
              customStyle={{ 
                margin: 0,
                borderRadius: '4px',
                padding: '1rem'
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }
      case 'number':
        return value || <span className="text-gray-400 text-sm">Empty</span>;
      default:
        return value ? (
          <div className="whitespace-pre-wrap text-sm">{value}</div>
        ) : (
          <span className="text-gray-400 text-sm">Empty</span>
        );
    }
  };

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="min-h-[32px] cursor-text py-0.5"
    >
      {renderContent()}
    </div>
  );
};

export default TableCell;