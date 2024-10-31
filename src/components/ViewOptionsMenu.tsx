import React, { useState, useRef, useEffect } from 'react';
import { 
  Table2, 
  FileText, 
  Layout, 
  ListFilter,
  ArrowUpDown,
  Grid,
  Zap,
  Download,
  Settings2,
  Lock,
  Link,
  Copy
} from 'lucide-react';

interface ViewOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSQLite: (file: File) => void;
}

const ViewOptionsMenu: React.FC<ViewOptionsMenuProps> = ({ isOpen, onClose, onImportSQLite }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportSQLite(file);
      onClose();
    }
  };

  const handleSourceClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
          <span className="p-1 bg-white rounded">
            <Table2 size={16} className="text-gray-600" />
          </span>
          <input
            type="text"
            placeholder="View name"
            className="flex-1 bg-transparent border-none text-sm focus:ring-0 p-0"
          />
        </div>
      </div>

      <div className="h-px bg-gray-200 my-1" />

      <input
        type="file"
        ref={fileInputRef}
        accept=".sqlite,.db,.sqlite3,.db3"
        onChange={handleFileSelect}
        className="hidden"
      />
      <MenuItem 
        icon={<FileText size={16} />} 
        label="Source" 
        value="Untitled"
        onClick={handleSourceClick} 
      />
      <MenuItem icon={<Layout size={16} />} label="Layout" value="Table" />
      <MenuItem icon={<ListFilter size={16} />} label="Properties" value="2 shown" />
      <MenuItem icon={<ListFilter size={16} />} label="Filter" value="None" />
      <MenuItem icon={<ArrowUpDown size={16} />} label="Sort" value="None" />
      <MenuItem icon={<Grid size={16} />} label="Group" value="None" />
      <MenuItem icon={<Zap size={16} />} label="Automations" value="None" />
      <MenuItem icon={<Download size={16} />} label="Load limit" value="50 pages" />

      <div className="h-px bg-gray-200 my-1" />

      <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
        <Settings2 size={16} className="text-gray-400" />
        <div className="flex-1">
          <div>Customize database</div>
          <div className="text-xs text-gray-500">Change settings, add new features</div>
        </div>
      </button>

      <div className="h-px bg-gray-200 my-1" />

      <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
        <Lock size={16} className="text-gray-400" />
        <span>Lock views</span>
      </button>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
        <Link size={16} className="text-gray-400" />
        <span>Copy link to view</span>
      </button>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
        <Copy size={16} className="text-gray-400" />
        <span>Duplicate view</span>
      </button>
    </div>
  );
};

const MenuItem = ({ 
  icon, 
  label, 
  value,
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  onClick?: () => void;
}) => (
  <button 
    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center"
    onClick={onClick}
  >
    <span className="text-gray-400 w-6">{icon}</span>
    <span className="flex-1">{label}</span>
    <span className="text-gray-500">{value}</span>
  </button>
);

export default ViewOptionsMenu; 