import { FormFieldProps } from "../types/settings";

export default function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  optional,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
          {label}
        </label>
        {optional && (
          <span className="text-xs text-text-muted bg-slate-100 px-1.5 py-0.5 rounded">
            optional
          </span>
        )}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent"
      />
    </div>
  );
}
