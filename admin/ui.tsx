import React from 'react';

export const Card: React.FC<{ title?: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  subtitle,
  right,
  children,
}) => (
  <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
    {(title || subtitle || right) && (
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          {title ? <div className="text-2xl font-black text-white">{title}</div> : null}
          {subtitle ? <div className="text-white/30 mt-2">{subtitle}</div> : null}
        </div>
        {right ? <div className="flex flex-wrap gap-3">{right}</div> : null}
      </div>
    )}
    {children}
  </div>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }
> = ({ variant = 'ghost', className = '', ...props }) => {
  const base =
    'px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-white text-black hover:bg-purple-600 hover:text-white'
      : variant === 'danger'
        ? 'bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500/20'
        : 'bg-white/5 border border-white/10 text-white/40 hover:border-purple-500/30 hover:text-white';
  return <button {...props} className={`${base} ${styles} ${className}`} />;
};

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={
      'w-full bg-[#050508] border border-white/10 rounded-2xl px-5 py-4 text-white/90 focus:outline-none focus:border-purple-500/40 transition-all placeholder-white/10 shadow-inner ' +
      (props.className || '')
    }
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={
      'w-full bg-[#050508] border border-white/10 rounded-2xl px-5 py-4 text-white/90 focus:outline-none focus:border-purple-500/40 transition-all placeholder-white/10 shadow-inner min-h-[120px] ' +
      (props.className || '')
    }
  />
);

export const FieldLabel: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="flex flex-col gap-1">
    <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">{title}</div>
    {hint ? <div className="text-xs text-white/20 leading-relaxed">{hint}</div> : null}
  </div>
);

export const Divider: React.FC = () => <div className="h-px w-full bg-white/5" />;

