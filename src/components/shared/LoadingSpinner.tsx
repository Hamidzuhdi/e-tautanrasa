interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'gray' | 'white' | 'green' | 'red';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
    green: 'border-green-600',
    red: 'border-red-600'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  );
}

// Full page loading component
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}

// Overlay loading component
export function OverlayLoading({ message = 'Processing...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Button loading component
export function ButtonLoading({ 
  children, 
  loading = false,
  disabled = false,
  ...props 
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  [key: string]: any;
}) {
  return (
    <button 
      disabled={loading || disabled}
      {...props}
      className={`${props.className} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" className="mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}