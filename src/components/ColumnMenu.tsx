import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ArrowUpDown,
  Eye,
  Copy,
  Lock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Filter,
  Bot,
  Type,
  Info,
  Hash,
  Calculator,
  Code2,
  FileText,
  Tags,
  ListChecks,
  Calendar,
  Link2
} from 'lucide-react';
import { CellType } from '../types';

interface ColumnMenuProps {
  type: CellType;
  name: string;
  onTypeChange: (type: CellType) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onNameChange: (name: string) => void;
  canDelete: boolean;
}

interface TypeConfig {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const typeConfigs: Record<CellType, TypeConfig> = {
  text: {
    label: 'Text',
    icon: Type
  },
  number: {
    label: 'Number',
    icon: Calculator
  },
  latex: {
    label: 'LaTeX',
    icon: Hash
  },
  markdown: {
    label: 'Markdown',
    icon: FileText
  },
  code: {
    label: 'Code',
    icon: Code2
  },
  select: {
    label: 'Select',
    icon: Tags
  },
  multiSelect: {
    label: 'Multi-select',
    icon: ListChecks
  },
  date: {
    label: 'Date',
    icon: Calendar
  },
  url: {
    label: 'URL',
    icon: Link2
  }
};

const ColumnMenu: React.FC<ColumnMenuProps> = ({
  type,
  name,
  onTypeChange,
  onDelete,
  onDuplicate,
  onNameChange,
  canDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target as Node)) {
        setShowTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const typeLabels: Record<CellType, string> = Object.fromEntries(
    Object.entries(typeConfigs).map(([key, config]) => [key, config.label])
  );

  return (
    <div className="relative" ref={menuRef}>
      <div 
        className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex-1 text-left text-sm text-gray-600 truncate">{name}</span>
        <ChevronDown size={14} className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100" />
      </div>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {/* Name input at the top */}
          <div className="px-3 py-2 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Property name"
            />
            <button className="p-1 text-gray-400 hover:bg-gray-100 rounded">
              <Info size={14} />
            </button>
          </div>

          <div className="h-px bg-gray-200 my-1" />

          {/* Property type */}
          <button
            onClick={() => {
              setShowTypeMenu(true);
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
          >
            <Type size={14} className="text-gray-400" />
            Edit property type
          </button>

          {/* AI Autofill */}
          <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
            <Bot size={14} className="text-gray-400" />
            Set up AI autofill
            <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-1.5 rounded">New</span>
          </button>

          <div className="h-px bg-gray-200 my-1" />

          {/* Sort options */}
          <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
            <ArrowUp size={14} className="text-gray-400" />
            Sort ascending
          </button>
          <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
            <ArrowDown size={14} className="text-gray-400" />
            Sort descending
          </button>
          <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            Filter
          </button>

          <div className="h-px bg-gray-200 my-1" />

          {/* View options */}
          <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
            <Eye size={14} className="text-gray-400" />
            Hide in view
          </button>
          <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
            <Lock size={14} className="text-gray-400" />
            Freeze up to column
          </button>

          <div className="h-px bg-gray-200 my-1" />

          {/* Column actions */}
          <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
          >
            <Copy size={14} className="text-gray-400" />
            Duplicate property
          </button>
          {canDelete && (
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
            >
              <Trash2 size={14} className="text-red-400" />
              Delete property
            </button>
          )}

          <div className="h-px bg-gray-200 my-1" />

          {/* Wrap column toggle */}
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-sm">Wrap column</span>
            <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-gray-200">
              <div className="h-3 w-3 transform rounded-full bg-white shadow-sm transition ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {showTypeMenu && (
        <div 
          ref={typeMenuRef}
          className="absolute z-20 top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Property Type</div>
          {Object.entries(typeConfigs).map(([value, config]) => (
            <button
              key={value}
              onClick={() => {
                onTypeChange(value as CellType);
                setShowTypeMenu(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${
                type === value ? 'text-blue-600 bg-blue-50 hover:bg-blue-50' : ''
              }`}
            >
              <config.icon size={14} className="text-gray-400" />
              {config.label}
              {type === value && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnMenu;