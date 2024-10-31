import React, { useState } from 'react';
import { PlusCircle, MoreHorizontal, Search, Zap, ArrowDownUp, Maximize2 } from 'lucide-react';
import TableCell from './components/TableCell';
import ColumnMenu from './components/ColumnMenu';
import { CellType, TableData, Column } from './types';
import ViewOptionsMenu from './components/ViewOptionsMenu';

function App() {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', name: 'Name', type: 'text' }
  ]);
  const [tableData, setTableData] = useState<TableData>([[{ type: 'text', content: '' }]]);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  const addRow = () => {
    setTableData([...tableData, columns.map(col => ({ type: col.type, content: '' }))]);
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: String(columns.length + 1),
      name: `Column ${columns.length + 1}`,
      type: 'text'
    };
    setColumns([...columns, newColumn]);
    setTableData(prev => prev.map(row => [...row, { type: 'text', content: '' }]));
  };

  const deleteRow = (rowIndex: number) => {
    if (tableData.length > 1) {
      setTableData(prev => prev.filter((_, index) => index !== rowIndex));
    }
  };

  const deleteColumn = (colIndex: number) => {
    if (columns.length > 1) {
      setColumns(prev => prev.filter((_, index) => index !== colIndex));
      setTableData(prev => prev.map(row => row.filter((_, index) => index !== colIndex)));
    }
  };

  const duplicateColumn = (colIndex: number) => {
    const columnToDuplicate = columns[colIndex];
    const newColumn: Column = {
      ...columnToDuplicate,
      id: String(columns.length + 1),
      name: `${columnToDuplicate.name} copy`
    };
    
    setColumns(prev => [
      ...prev.slice(0, colIndex + 1),
      newColumn,
      ...prev.slice(colIndex + 1)
    ]);

    setTableData(prev => prev.map(row => [
      ...row.slice(0, colIndex + 1),
      { ...row[colIndex] },
      ...row.slice(colIndex + 1)
    ]));
  };

  const updateCell = (rowIndex: number, colIndex: number, content: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex].content = content;
    setTableData(newData);
  };

  const updateColumnType = (colIndex: number, type: CellType) => {
    setColumns(prev => prev.map((col, index) => 
      index === colIndex ? { ...col, type } : col
    ));
    
    setTableData(prev => prev.map(row => row.map((cell, index) => 
      index === colIndex ? { ...cell, type } : cell
    )));
  };

  const updateColumnName = (colIndex: number, name: string) => {
    setColumns(prev => prev.map((col, index) => 
      index === colIndex ? { ...col, name } : col
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Notion-style header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[90%] mx-auto py-3 px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl font-medium text-gray-800">Untitled</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <ArrowDownUp size={18} className="text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <Search size={18} className="text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <Zap size={18} className="text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <Maximize2 size={18} className="text-gray-500" />
              </button>
              <div className="relative">
                <button 
                  className="p-1.5 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                >
                  <MoreHorizontal size={18} className="text-gray-500" />
                </button>
                <ViewOptionsMenu 
                  isOpen={isViewMenuOpen}
                  onClose={() => setIsViewMenuOpen(false)}
                />
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto py-6 px-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
          >
            <PlusCircle size={16} />
            Add Row
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
          >
            <PlusCircle size={16} />
            Add Column
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 min-h-[600px]">
          <table className="w-full h-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((column, colIndex) => (
                  <th key={column.id} className="border-b border-gray-200 p-2 text-left font-normal">
                    <ColumnMenu
                      type={column.type}
                      name={column.name}
                      onTypeChange={(type) => updateColumnType(colIndex, type)}
                      onDelete={() => deleteColumn(colIndex)}
                      onDuplicate={() => duplicateColumn(colIndex)}
                      onNameChange={(name) => updateColumnName(colIndex, name)}
                      canDelete={columns.length > 1}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="border-t border-gray-100 p-2">
                      <TableCell
                        value={cell.content}
                        type={cell.type}
                        onChange={(value) => updateCell(rowIndex, colIndex, value)}
                      />
                    </td>
                  ))}
                  <td className="border-t border-gray-100 p-2 w-10">
                    {tableData.length > 1 && (
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                      >
                        <PlusCircle size={14} className="rotate-45" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;