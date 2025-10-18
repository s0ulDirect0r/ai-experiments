import React from 'react';

export interface TraceTableColumn {
  key: string;
  label: string;
}

export interface TraceTableRow {
  [key: string]: string | number | boolean | null | undefined;
}

interface TraceTableProps {
  columns: TraceTableColumn[];
  rows: TraceTableRow[];
  highlightRow?: number;
  changedCells?: Set<string>;
}

export const TraceTable: React.FC<TraceTableProps> = ({
  columns,
  rows,
  highlightRow,
  changedCells
}) => {
  return (
    <div className="w-full overflow-x-auto my-5">
      <table className="w-full border-collapse font-mono shadow-lg">
        <thead className="bg-slate-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-semibold border border-slate-600 w-20 text-center bg-slate-200 text-slate-900">
              Step
            </th>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold border border-slate-600">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 transition-colors ${
                highlightRow === index ? 'bg-yellow-100 font-semibold' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <td className="px-4 py-2.5 border border-gray-300 font-semibold bg-gray-100 text-center">
                {index + 1}
              </td>
              {columns.map((col) => {
                const isChanged = highlightRow === index && changedCells?.has(col.key);
                const cellClasses = isChanged
                  ? "px-4 py-2.5 border-2 border-green-500 bg-green-200 font-bold"
                  : "px-4 py-2.5 border border-gray-300";

                return (
                  <td key={col.key} className={cellClasses}>
                    {row[col.key] !== undefined && row[col.key] !== null
                      ? String(row[col.key])
                      : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
