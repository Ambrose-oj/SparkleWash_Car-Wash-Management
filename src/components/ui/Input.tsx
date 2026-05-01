import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-white/70 font-body"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30',
            'font-body transition-all duration-200',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-white/10 focus:border-gold/50 focus:ring-gold/20',
            className
          )}
          {...rest}
        />
        {error && (
          <p className="text-xs text-red-400 font-body" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-white/70 font-body"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full rounded-lg border bg-brand-card px-4 py-3 text-sm text-white',
            'font-body transition-all duration-200 appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-white/10 focus:border-gold/50 focus:ring-gold/20',
            className
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled className="bg-brand-card">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-brand-card">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-400 font-body" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
