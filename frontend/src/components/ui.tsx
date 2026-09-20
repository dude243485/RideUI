import { ChevronRight, Loader2, CheckCircle2, XCircle, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── Wordmark ─────────────────────────────────────────────────────────────────

export function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cfg = {
    sm: { box: 'w-8 h-8', icon: 18, text: 'text-xl' },
    md: { box: 'w-10 h-10', icon: 22, text: 'text-2xl' },
    lg: { box: 'w-12 h-12', icon: 26, text: 'text-3xl' },
  }[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${cfg.box} bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <ChevronRight size={cfg.icon} strokeWidth={2.5} className="text-white" />
      </div>
      <span className={`font-bold text-ink ${cfg.text} tracking-tight`}>RideUI</span>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'danger';
type BtnSize = 'rider' | 'driver-md' | 'driver-lg';

export function Button({
  children,
  variant = 'primary',
  size = 'rider',
  disabled,
  loading,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const heights = { rider: 'h-12 text-base', 'driver-md': 'h-16 text-2xl', 'driver-lg': 'h-24 text-4xl' };
  const variants: Record<BtnVariant, string> = {
    primary:
      'bg-brand-600 text-white active:bg-brand-700 disabled:bg-border disabled:text-muted',
    secondary:
      'bg-white text-brand-600 border border-brand-600 active:bg-brand-50 disabled:border-border disabled:text-muted',
    danger:
      'bg-white text-danger-light border border-danger-light active:bg-red-50 disabled:border-border disabled:text-muted',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        w-full rounded-xl font-bold flex items-center justify-center gap-2
        transition-colors duration-100 select-none
        ${heights[size]} ${variants[variant]} ${className}
      `}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

// ─── StopChip ─────────────────────────────────────────────────────────────────

export function StopChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-11 px-4 rounded-xl border text-sm font-medium transition-colors duration-100 whitespace-nowrap flex-shrink-0
        ${selected
          ? 'bg-brand-50 border-brand-600 text-brand-600 border-2'
          : 'bg-white border-border text-ink'
        }`}
    >
      {label}
    </button>
  );
}

// ─── DriverCard ───────────────────────────────────────────────────────────────

export function DriverCard({
  rank,
  name,
  initials,
  vehicle,
  eta,
  selected,
  onSelect,
}: {
  rank: number;
  name: string;
  initials: string;
  vehicle: string;
  eta: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-xl p-4 flex items-center gap-3 transition-colors duration-100 text-left
        ${selected
          ? 'bg-brand-50 border-2 border-brand-600'
          : 'bg-white border border-border'
        }`}
    >
      {/* rank */}
      <div className="w-6 flex-shrink-0 text-center">
        <span className="text-sm font-bold text-muted">#{rank}</span>
      </div>

      {/* avatar */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
        ${selected ? 'bg-brand-600 text-white' : 'bg-surface text-ink'}`}>
        {initials}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-ink truncate">{name}</p>
        <p className="text-sm text-muted truncate">{vehicle} · {eta}</p>
      </div>

      {/* badge */}
      {rank === 1 && (
        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-accent text-ink text-xs font-bold">
          Best match
        </span>
      )}
    </button>
  );
}

// ─── CountdownRing ────────────────────────────────────────────────────────────

export function CountdownRing({
  total = 20,
  onExpire,
}: {
  total?: number;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(total);
  const R = 44;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - remaining / total);

  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="-rotate-90 absolute inset-0" width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={R} fill="none" stroke="#D5E3DA" strokeWidth="6" />
        <circle
          cx="56" cy="56" r={R}
          fill="none"
          stroke="#0B7A4B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="text-3xl font-bold text-ink z-10">{remaining}</span>
    </div>
  );
}

// ─── StatusBanner ─────────────────────────────────────────────────────────────

export function StatusBanner({
  type,
  message,
}: {
  type: 'success' | 'error' | 'reconnecting';
  message: string;
}) {
  const cfg = {
    success: {
      bg: 'bg-brand-50 border-brand-600',
      icon: <CheckCircle2 size={18} className="text-brand-600 flex-shrink-0" />,
      text: 'text-brand-600',
    },
    error: {
      bg: 'bg-red-50 border-danger',
      icon: <XCircle size={18} className="text-danger flex-shrink-0" />,
      text: 'text-danger',
    },
    reconnecting: {
      bg: 'bg-surface border-border',
      icon: <WifiOff size={18} className="text-muted flex-shrink-0" />,
      text: 'text-muted',
    },
  }[type];

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${cfg.bg}`}>
      {cfg.icon}
      <span className={`text-sm font-medium ${cfg.text}`}>{message}</span>
    </div>
  );
}

// ─── OfflineBanner ────────────────────────────────────────────────────────────

export function OfflineBanner() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-border">
      <WifiOff size={14} className="text-muted" />
      <span className="text-xs text-muted">Reconnecting…</span>
      <span className="ml-auto">
        <span className="inline-block w-2 h-2 rounded-full bg-accent" />
      </span>
    </div>
  );
}

// ─── BottomSheet ──────────────────────────────────────────────────────────────

export function BottomSheet({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-t-[20px] px-4 pt-5 pb-safe-bottom"
      style={{ boxShadow: '0 -8px 32px rgba(11,31,23,0.10)' }}
    >
      <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
      {children}
    </div>
  );
}

// ─── SkeletonBlock ────────────────────────────────────────────────────────────

export function SkeletonBlock({ h = 'h-4', w = 'w-full', className = '' }: { h?: string; w?: string; className?: string }) {
  return <div className={`skeleton ${h} ${w} rounded-lg ${className}`} />;
}

export function SkeletonDriverCard() {
  return (
    <div className="w-full rounded-xl p-4 flex items-center gap-3 bg-white border border-border">
      <SkeletonBlock h="h-5" w="w-5" />
      <SkeletonBlock h="h-11" w="w-11" className="rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock h="h-4" w="w-32" />
        <SkeletonBlock h="h-3" w="w-24" />
      </div>
    </div>
  );
}

// ─── OnlineToggle ─────────────────────────────────────────────────────────────

export function OnlineToggle({
  online,
  onChange,
}: {
  online: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!online)}
      className={`w-full rounded-2xl py-8 flex flex-col items-center gap-3 transition-colors duration-200 border-2
        ${online ? 'bg-brand-50 border-brand-600' : 'bg-white border-border'}`}
    >
      {/* pill toggle */}
      <div className={`relative w-20 h-10 rounded-full transition-colors duration-200
        ${online ? 'bg-brand-600' : 'bg-border'}`}>
        <span className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow transition-all duration-200
          ${online ? 'left-11' : 'left-1'}`} />
      </div>
      <span className={`text-4xl font-bold tracking-wide ${online ? 'text-brand-600' : 'text-muted'}`}>
        {online ? 'ONLINE' : 'OFFLINE'}
      </span>
      <span className="text-sm text-muted">
        {online ? (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            Ready to accept rides
          </span>
        ) : 'Tap to go online'}
      </span>
    </button>
  );
}


// ─── NumericKeypad ────────────────────────────────────────────────────────────

export function NumericKeypad({
  onKey,
  onDelete,
}: {
  onKey: (k: string) => void;
  onDelete: () => void;
}) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((k, i) => (
        <button
          key={i}
          onClick={() => {
            if (k === '⌫') onDelete();
            else if (k) onKey(k);
          }}
          disabled={!k}
          className={`h-16 rounded-xl text-2xl font-bold transition-colors duration-100
            ${!k ? 'invisible' : 'bg-white border border-border text-ink active:bg-brand-50 active:border-brand-600'}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

// ─── PinDots ──────────────────────────────────────────────────────────────────

export function PinDots({ length, filled }: { length: number; filled: number }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-150
            ${i < filled ? 'bg-brand-600 border-brand-600' : 'bg-white border-border'}`}
        />
      ))}
    </div>
  );
}

// ─── ScreenShell ──────────────────────────────────────────────────────────────

export function ScreenShell({
  children,
  showOffline,
  className = '',
}: {
  children: React.ReactNode;
  showOffline?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col min-h-screen bg-surface ${className}`}>
      {showOffline && <OfflineBanner />}
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 px-4 rounded-xl border border-border bg-white text-ink text-base
          placeholder:text-muted focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20
          transition-colors duration-100"
      />
    </div>
  );
}
