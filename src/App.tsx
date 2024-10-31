import React, { useState } from 'react';
import { PlusCircle, MoreHorizontal, Search, Zap, ArrowDownUp, Maximize2 } from 'lucide-react';
import TableCell from './components/TableCell';
import ColumnMenu from './components/ColumnMenu';
import { CellType, TableData, Column } from './types';
import ViewOptionsMenu from './components/ViewOptionsMenu';
import initSqlJs from 'sql.js';

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

  const handleImportSQLite = async (file: File) => {
    try {
      console.log('开始导入文件:', file.name);
      
      // 初始化 SQL.js，注意这里使用 await
      const SQL = await initSqlJs({
        // 确保 sql-wasm.wasm 文件可以被正确加载
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      // 读取文件内容
      const fileBuffer = await file.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(fileBuffer));
      
      // 获取所有表名
      const tables = db.exec(`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `);
      
      if (!tables || !tables[0] || !tables[0].values.length) {
        alert('未在SQLite文件中找到任何表');
        return;
      }

      // 获取第一个表名
      const firstTableName = tables[0].values[0][0] as string;
      
      // 获取表数据
      const result = db.exec(`SELECT * FROM "${firstTableName}" LIMIT 1000`);
      
      if (!result || !result[0]) {
        alert('无法读取表数据');
        return;
      }

      const { columns, values } = result[0];

      // 转换列定义
      const newColumns: Column[] = columns.map((colName, index) => ({
        id: `col-${index + 1}`,
        name: colName as string,
        type: 'text'
      }));

      // 转换数据
      const newData: TableData = values.map(row => 
        row.map(cellValue => ({
          type: 'text',
          content: cellValue !== null ? String(cellValue) : ''
        }))
      );

      // 更新状态
      setColumns(newColumns);
      setTableData(newData);
      
    } catch (error) {
      console.error('导入过程错误:', error);
      alert(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
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
                  onImportSQLite={handleImportSQLite}
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
                <th className="border-b border-gray-200 p-2 w-10">
                  <button
                    onClick={addColumn}
                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600"
                  >
                    <PlusCircle size={16} />
                  </button>
                </th>
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
        {/* 在表格下方添加新建行按钮 */}
        <button
          onClick={addRow}
          className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors w-full"
        >
          <PlusCircle size={16} />
          <span>New page</span>
        </button>
      </div>
    </div>
  );
}

export default App;