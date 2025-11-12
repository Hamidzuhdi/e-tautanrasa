'use client';

import { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    className = '',
    ...props
  }, ref) => {
    const baseInputClasses = `
      block w-full px-3 py-2 border rounded-lg shadow-sm 
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      transition-colors duration-200
    `;

    const errorClasses = error 
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900';

    const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    return (
      <div className={`${containerClassName}`}>
        {label && (
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            className={`${baseInputClasses} ${errorClasses} ${iconPadding} ${inputClassName} ${className}`}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">
                {rightIcon}
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;

// Textarea Component
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({
    label,
    error,
    hint,
    containerClassName = '',
    labelClassName = '',
    textareaClassName = '',
    className = '',
    ...props
  }, ref) => {
    const baseTextareaClasses = `
      block w-full px-3 py-2 border rounded-lg shadow-sm 
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      transition-colors duration-200 resize-vertical
    `;

    const errorClasses = error 
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900';

    return (
      <div className={`${containerClassName}`}>
        {label && (
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`${baseTextareaClasses} ${errorClasses} ${textareaClassName} ${className}`}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// Select Component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({
    label,
    error,
    hint,
    options,
    placeholder,
    containerClassName = '',
    labelClassName = '',
    selectClassName = '',
    className = '',
    ...props
  }, ref) => {
    const baseSelectClasses = `
      block w-full px-3 py-2 border rounded-lg shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      transition-colors duration-200
    `;

    const errorClasses = error 
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900';

    return (
      <div className={`${containerClassName}`}>
        {label && (
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          className={`${baseSelectClasses} ${errorClasses} ${selectClassName} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

// Checkbox Component
interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({
    label,
    error,
    hint,
    containerClassName = '',
    labelClassName = '',
    className = '',
    ...props
  }, ref) => {
    return (
      <div className={`${containerClassName}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label className={`font-medium text-gray-700 ${labelClassName}`}>
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {hint && (
              <p className="text-gray-500">{hint}</p>
            )}
          </div>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';