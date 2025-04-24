import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  errorMessage,
  helpText,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  containerClassName = '',
  icon,
  iconPosition = 'left',
  ...rest
}, ref) => {
  const baseInputClass = 'block w-full rounded-md sm:text-sm focus:outline-none';
  const errorClass = errorMessage ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const readOnlyClass = readOnly ? 'bg-gray-50' : '';
  const iconClass = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  const inputClass = `${baseInputClass} ${errorClass} ${disabledClass} ${readOnlyClass} ${iconClass} ${className}`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClass}
          {...rest}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
      
      {helpText && !errorMessage && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
