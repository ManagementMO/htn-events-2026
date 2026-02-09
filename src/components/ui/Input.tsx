"use client";

import clsx from "clsx";

interface InputProps {
  label?: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export default function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className,
  required = false,
  autoFocus = false,
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoFocus={autoFocus}
        className={clsx(
          "w-full px-4 py-3 bg-[#141929] border rounded-lg text-slate-100 placeholder:text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
          error ? "border-red-500" : "border-[#1e293b]"
        )}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
