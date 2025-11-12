// 'use client';

// import { useState } from 'react';
// import LoadingSpinner from './LoadingSpinner';

// interface Column<T> {
//   key: keyof T | string;
//   header: string;
//   width?: string;
//   sortable?: boolean;
//   render?: (item: T, index: number) => React.ReactNode;
//   className?: string;
//   headerClassName?: string;
// }

// interface TableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   loading?: boolean;
//   emptyMessage?: string;
//   className?: string;
//   headerClassName?: string;
//   rowClassName?: string | ((item: T, index: number) => string);
//   onRowClick?: (item: T, index: number) => void;
//   sortable?: boolean;
//   pagination?: {
//     currentPage: number;
//     totalPages: number;
//     pageSize: number;
//     totalItems: number;
//     onPageChange: (page: number) => void;
//     onPageSizeChange?: (size: number) => void;
//   };
// }

// type SortDirection = 'asc' | 'desc' | null;

// export default function Table<T extends Record<string, any>>({
//   data,
//   columns,
//   loading = false,
//   emptyMessage = 'No data available',
//   className = '',
//   headerClassName = '',
//   rowClassName = '',
//   onRowClick,
//   sortable = true,
//   pagination
// }: TableProps<T>) {
//   const [sortKey, setSortKey] = useState<string | null>(null);
//   const [sortDirection, setSortDirection] = useState<SortDirection>(null);

//   const handleSort = (key: string, columnSortable: boolean = true) => {
//     if (!sortable || !columnSortable) return;

//     if (sortKey === key) {
//       if (sortDirection === 'asc') {
//         setSortDirection('desc');
//       } else if (sortDirection === 'desc') {
//         setSortDirection(null);
//         setSortKey(null);
//       } else {
//         setSortDirection('asc');
//       }
//     } else {
//       setSortKey(key);
//       setSortDirection('asc');
//     }
//   };

//   const sortedData = [...data].sort((a, b) => {
//     if (!sortKey || !sortDirection) return 0;

//     const aValue = a[sortKey];
//     const bValue = b[sortKey];

//     if (aValue === null || aValue === undefined) return 1;
//     if (bValue === null || bValue === undefined) return -1;

//     if (typeof aValue === 'string' && typeof bValue === 'string') {
//       return sortDirection === 'asc' 
//         ? aValue.localeCompare(bValue)
//         : bValue.localeCompare(aValue);
//     }

//     if (typeof aValue === 'number' && typeof bValue === 'number') {
//       return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
//     }

//     // For dates
//     if (aValue instanceof Date && bValue instanceof Date) {
//       return sortDirection === 'asc' 
//         ? aValue.getTime() - bValue.getTime()
//         : bValue.getTime() - aValue.getTime();
//     }

//     // For other types, convert to string
//     const aStr = String(aValue);
//     const bStr = String(bValue);
//     return sortDirection === 'asc' 
//       ? aStr.localeCompare(bStr)
//       : bStr.localeCompare(aStr);
//   });

//   const getSortIcon = (columnKey: string, columnSortable: boolean = true) => {
//     if (!sortable || !columnSortable) return null;

//     if (sortKey !== columnKey) {
//       return (
//         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
//         </svg>
//       );
//     }

//     if (sortDirection === 'asc') {
//       return (
//         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//         </svg>
//       );
//     }

//     if (sortDirection === 'desc') {
//       return (
//         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       );
//     }

//     return null;
//   };

//   const getRowClassName = (item: T, index: number) => {
//     const baseClasses = 'hover:bg-gray-50 transition-colors duration-200';
//     const clickableClasses = onRowClick ? 'cursor-pointer' : '';
    
//     if (typeof rowClassName === 'function') {
//       return `${baseClasses} ${clickableClasses} ${rowClassName(item, index)}`;
//     }
    
//     return `${baseClasses} ${clickableClasses} ${rowClassName}`;
//   };

//   const renderCellContent = (column: Column<T>, item: T, index: number) => {
//     if (column.render) {
//       return column.render(item, index);
//     }

//     const value = item[column.key as keyof T];
//     if (value === null || value === undefined) {
//       return <span className="text-gray-400">-</span>;
//     }

//     if (typeof value === 'boolean') {
//       return (
//         <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//           value 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {value ? 'Yes' : 'No'}
//         </span>
//       );
//     }

//     if (value instanceof Date) {
//       return value.toLocaleDateString();
//     }

//     return String(value);
//   };

//   return (
//     <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
//           <thead className={`bg-gray-50 ${headerClassName}`}>
//             <tr>
//               {columns.map((column, index) => (
//                 <th
//                   key={String(column.key) + index}
//                   className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                     sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
//                   } ${column.headerClassName || ''}`}
//                   style={{ width: column.width }}
//                   onClick={() => handleSort(String(column.key), column.sortable)}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>{column.header}</span>
//                     {getSortIcon(String(column.key), column.sortable)}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={columns.length} className="px-6 py-12 text-center">
//                   <div className="flex items-center justify-center">
//                     <LoadingSpinner size="lg" />
//                     <span className="ml-2 text-gray-500">Loading...</span>
//                   </div>
//                 </td>
//               </tr>
//             ) : sortedData.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} className="px-6 py-12 text-center">
//                   <div className="flex flex-col items-center">
//                     <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <p className="text-gray-500">{emptyMessage}</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               sortedData.map((item, index) => (
//                 <tr
//                   key={index}
//                   className={getRowClassName(item, index)}
//                   onClick={() => onRowClick?.(item, index)}
//                 >
//                   {columns.map((column, colIndex) => (
//                     <td
//                       key={String(column.key) + colIndex}
//                       className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
//                     >
//                       {renderCellContent(column, item, index)}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {pagination && (
//         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
//               disabled={pagination.currentPage === 1}
//               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
//               disabled={pagination.currentPage === pagination.totalPages}
//               className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
          
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div className="flex items-center">
//               <p className="text-sm text-gray-700">
//                 Showing{' '}
//                 <span className="font-medium">
//                   {((pagination.currentPage - 1) * pagination.pageSize) + 1}
//                 </span>{' '}
//                 to{' '}
//                 <span className="font-medium">
//                   {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
//                 </span>{' '}
//                 of{' '}
//                 <span className="font-medium">{pagination.totalItems}</span> results
//               </p>
              
//               {pagination.onPageSizeChange && (
//                 <div className="ml-4">
//                   <select
//                     value={pagination.pageSize}
//                     onChange={(e) => pagination.onPageSizeChange!(parseInt(e.target.value))}
//                     className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value={10}>10 per page</option>
//                     <option value={25}>25 per page</option>
//                     <option value={50}>50 per page</option>
//                     <option value={100}>100 per page</option>
//                   </select>
//                 </div>
//               )}
//             </div>
            
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                 <button
//                   onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
//                   disabled={pagination.currentPage === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="sr-only">Previous</span>
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
                
//                 {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => pagination.onPageChange(page)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       page === pagination.currentPage
//                         ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
                
//                 <button
//                   onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="sr-only">Next</span>
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }