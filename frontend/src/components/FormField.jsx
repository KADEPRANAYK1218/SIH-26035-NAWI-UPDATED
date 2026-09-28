import React from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  options = [],
  rows = 3
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className={`form-select ${error ? 'border-red-500' : ''}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`form-textarea ${error ? 'border-red-500' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error ? 'border-red-500' : ''}`}
        />
      )}

      {helpText && !error && (
        <p className="text-[11px] text-slate-500 mt-1 m-0">{helpText}</p>
      )}

      {error && (
        <p className="text-[11px] text-red-600 font-semibold mt-1 m-0">
          {error}
        </p>
      )}
    </div>
  );
}
