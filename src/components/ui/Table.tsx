import React from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index?: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available",
}: TableProps<T>) {
  const renderRows = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-4 text-center text-slate-500 dark:text-gray-400"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }
    return data.map((item, index) => (
      <tr
        key={index}
        onClick={() => onRowClick?.(item)}
        className={`transition-all duration-200 odd:bg-white dark:odd:bg-gray-800 even:bg-slate-50/50 dark:even:bg-gray-700/50 ${
          onRowClick
            ? "cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 dark:hover:from-blue-900/30 hover:to-transparent hover:shadow-sm"
            : "hover:bg-slate-100/50 dark:hover:bg-gray-600/50"
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {columns.map((column) => (
          <td
            key={column.key}
            className={`px-6 py-4 align-top text-sm text-slate-700 dark:text-gray-300 transition-colors duration-200 ${
              column.cellClassName ?? "whitespace-nowrap"
            }`}
          >
            {column.render ? column.render(item, index) : item[column.key]}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-gray-700 animate-fade-in">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
        <thead className="bg-gradient-to-r from-slate-100 via-stone-100 to-slate-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200 ${
                  column.headerClassName ?? ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-200 dark:divide-gray-700">
          {renderRows()}
        </tbody>
      </table>
    </div>
  );
}
