import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const labelClass = "block text-sm font-semibold text-ink";
const inputClass =
  "mt-2 w-full rounded-sm border border-forest/20 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-leaf";

export function TextField({
  label,
  name,
  ...props
}: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} name={name} {...props} />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  ...props
}: { label: string; name: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={labelClass}>
      {label}
      <textarea className={`${inputClass} min-h-28 resize-y`} name={name} {...props} />
    </label>
  );
}
