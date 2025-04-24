import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  isHoverable = false,
  isBordered = true,
  isPadded = true,
  isRounded = true,
}) => {
  const baseStyle = 'bg-white';
  const hoverStyle = isHoverable ? 'transition-shadow duration-200 hover:shadow-lg' : '';
  const borderStyle = isBordered ? 'border border-gray-200' : '';
  const paddingStyle = isPadded ? 'p-4 sm:p-6' : '';
  const roundedStyle = isRounded ? 'rounded-lg' : '';

  const cardClassName = `
    ${baseStyle}
    ${hoverStyle}
    ${borderStyle}
    ${paddingStyle}
    ${roundedStyle}
    ${className}
  `;

  return (
    <div className={cardClassName}>
      {(title || subtitle) && (
        <div className={`${isPadded ? 'mb-4' : 'px-4 pt-4 pb-0'}`}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={!isPadded && (title || subtitle) ? 'px-4 py-4' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className={`${isPadded ? 'mt-4 pt-4 border-t border-gray-200' : 'px-4 pb-4 pt-0'}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
