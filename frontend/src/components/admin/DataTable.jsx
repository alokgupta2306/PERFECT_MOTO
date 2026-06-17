import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DataTable = ({ columns = [], data = [], rowsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const activePaginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-medium text-xs">
          <thead>
            <tr className="bg-deep-black border-b border-border-dark font-heading font-bold uppercase tracking-wider text-muted-gray text-[10px]">
              {columns.map((col, idx) => (
                <th key={idx} className="p-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark/40 text-pure-white">
            {activePaginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-muted-gray italic">
                  No active entry records present inside data grid matrix nodes.
                </td>
              </tr>
            ) : (
              activePaginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-deep-black/20 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-4 font-mono text-[11px]">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Action Dock */}
      <div className="p-4 border-t border-border-dark bg-deep-black/20 flex justify-between items-center text-[11px] font-heading font-bold uppercase tracking-wider text-muted-gray">
        <span>Logged indices {startIndex + 1}-{Math.min(startIndex + rowsPerPage, data.length)} of {data.length} entries</span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="h-7 w-7 bg-deep-black hover:bg-card-dark border border-border-dark rounded flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-pure-white font-mono">{currentPage}/{totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="h-7 w-7 bg-deep-black hover:bg-card-dark border border-border-dark rounded flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;