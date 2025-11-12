// interface StatusBadgeProps {
//   status: string;
//   variant?: 'default' | 'dot' | 'pill';
//   size?: 'xs' | 'sm' | 'md' | 'lg';
//   className?: string;
//   customColors?: Record<string, string>;
// }

// export default function StatusBadge({
//   status,
//   variant = 'default',
//   size = 'sm',
//   className = '',
//   customColors = {}
// }: StatusBadgeProps) {
//   // Default status color mappings
//   const defaultStatusColors: Record<string, string> = {
//     // Order statuses
//     PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
//     SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
//     DELIVERED: 'bg-green-100 text-green-800 border-green-200',
//     CANCELLED: 'bg-red-100 text-red-800 border-red-200',
//     RETURNED: 'bg-gray-100 text-gray-800 border-gray-200',
    
//     // User statuses
//     ACTIVE: 'bg-green-100 text-green-800 border-green-200',
//     INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
//     SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
//     VERIFIED: 'bg-green-100 text-green-800 border-green-200',
//     UNVERIFIED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    
//     // Product statuses
//     IN_STOCK: 'bg-green-100 text-green-800 border-green-200',
//     LOW_STOCK: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     OUT_OF_STOCK: 'bg-red-100 text-red-800 border-red-200',
//     DISCONTINUED: 'bg-gray-100 text-gray-800 border-gray-200',
    
//     // Payment statuses
//     PAID: 'bg-green-100 text-green-800 border-green-200',
//     UNPAID: 'bg-red-100 text-red-800 border-red-200',
//     REFUNDED: 'bg-blue-100 text-blue-800 border-blue-200',
//     PARTIAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    
//     // General statuses
//     SUCCESS: 'bg-green-100 text-green-800 border-green-200',
//     ERROR: 'bg-red-100 text-red-800 border-red-200',
//     WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     INFO: 'bg-blue-100 text-blue-800 border-blue-200',
    
//     // Boolean-like statuses
//     TRUE: 'bg-green-100 text-green-800 border-green-200',
//     FALSE: 'bg-red-100 text-red-800 border-red-200',
//     YES: 'bg-green-100 text-green-800 border-green-200',
//     NO: 'bg-red-100 text-red-800 border-red-200',
//     ENABLED: 'bg-green-100 text-green-800 border-green-200',
//     DISABLED: 'bg-gray-100 text-gray-800 border-gray-200',
    
//     // Priority levels
//     HIGH: 'bg-red-100 text-red-800 border-red-200',
//     MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     LOW: 'bg-green-100 text-green-800 border-green-200',
//     URGENT: 'bg-red-100 text-red-800 border-red-200',
//     NORMAL: 'bg-blue-100 text-blue-800 border-blue-200'
//   };

//   // Merge custom colors with defaults
//   const statusColors = { ...defaultStatusColors, ...customColors };

//   // Get color classes for the status
//   const getStatusColors = (status: string) => {
//     const upperStatus = status.toUpperCase();
//     return statusColors[upperStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   // Size classes
//   const sizeClasses = {
//     xs: 'px-2 py-0.5 text-xs',
//     sm: 'px-2.5 py-1 text-xs',
//     md: 'px-3 py-1 text-sm',
//     lg: 'px-4 py-2 text-sm'
//   };

//   // Variant classes
//   const variantClasses = {
//     default: 'inline-flex items-center font-medium rounded-full border',
//     dot: 'inline-flex items-center font-medium',
//     pill: 'inline-flex items-center font-medium rounded-full border px-3 py-1'
//   };

//   // Format status text for display
//   const formatStatusText = (status: string) => {
//     return status
//       .toLowerCase()
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   const colorClasses = getStatusColors(status);
//   const baseClasses = variantClasses[variant];
//   const sizeClass = sizeClasses[size];

//   if (variant === 'dot') {
//     return (
//       <span className={`${baseClasses} ${sizeClass} ${className}`}>
//         <svg 
//           className={`w-2 h-2 mr-1.5 fill-current ${colorClasses.split(' ')[1]}`} 
//           viewBox="0 0 8 8"
//         >
//           <circle cx={4} cy={4} r={3} />
//         </svg>
//         <span className="text-gray-900">{formatStatusText(status)}</span>
//       </span>
//     );
//   }

//   return (
//     <span className={`${baseClasses} ${sizeClass} ${colorClasses} ${className}`}>
//       {formatStatusText(status)}
//     </span>
//   );
// }

// // Specialized badge components
// export function OrderStatusBadge({ status, ...props }: Omit<StatusBadgeProps, 'status'> & { status: string }) {
//   const orderStatusLabels: Record<string, string> = {
//     PENDING: 'Menunggu Konfirmasi',
//     PROCESSING: 'Sedang Diproses',
//     SHIPPED: 'Dalam Pengiriman',
//     DELIVERED: 'Telah Diterima',
//     CANCELLED: 'Dibatalkan',
//     RETURNED: 'Dikembalikan'
//   };

//   const displayText = orderStatusLabels[status.toUpperCase()] || status;

//   return (
//     <StatusBadge 
//       status={status} 
//       {...props}
//     >
//       {displayText}
//     </StatusBadge>
//   );
// }

// export function PaymentStatusBadge({ status, ...props }: Omit<StatusBadgeProps, 'status'> & { status: string }) {
//   const paymentStatusLabels: Record<string, string> = {
//     PAID: 'Lunas',
//     UNPAID: 'Belum Dibayar',
//     REFUNDED: 'Dikembalikan',
//     PARTIAL: 'Sebagian'
//   };

//   const displayText = paymentStatusLabels[status.toUpperCase()] || status;

//   return (
//     <StatusBadge 
//       status={status} 
//       {...props}
//     >
//       {displayText}
//     </StatusBadge>
//   );
// }

// export function StockStatusBadge({ status, quantity }: { status: string; quantity?: number }) {
//   const getStockStatus = () => {
//     if (quantity !== undefined) {
//       if (quantity === 0) return 'OUT_OF_STOCK';
//       if (quantity < 10) return 'LOW_STOCK';
//       return 'IN_STOCK';
//     }
//     return status;
//   };

//   const stockLabels: Record<string, string> = {
//     IN_STOCK: 'Tersedia',
//     LOW_STOCK: 'Stok Menipis',
//     OUT_OF_STOCK: 'Habis',
//     DISCONTINUED: 'Dihentikan'
//   };

//   const actualStatus = getStockStatus();
//   const displayText = stockLabels[actualStatus.toUpperCase()] || actualStatus;

//   return (
//     <StatusBadge status={actualStatus} variant="pill" size="sm">
//       {displayText}
//       {quantity !== undefined && (
//         <span className="ml-1 text-xs opacity-75">({quantity})</span>
//       )}
//     </StatusBadge>
//   );
// }

// // Role badge
// export function RoleBadge({ role }: { role: string }) {
//   const roleColors: Record<string, string> = {
//     ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
//     CUSTOMER: 'bg-blue-100 text-blue-800 border-blue-200',
//     MODERATOR: 'bg-green-100 text-green-800 border-green-200',
//     STAFF: 'bg-yellow-100 text-yellow-800 border-yellow-200'
//   };

//   const roleLabels: Record<string, string> = {
//     ADMIN: 'Administrator',
//     CUSTOMER: 'Customer',
//     MODERATOR: 'Moderator',
//     STAFF: 'Staff'
//   };

//   return (
//     <StatusBadge 
//       status={role}
//       customColors={roleColors}
//       variant="pill"
//       size="sm"
//     >
//       {roleLabels[role.toUpperCase()] || role}
//     </StatusBadge>
//   );
// }