import React from "react";
import clsx from "clsx";

type LoadingProps = {
  show?: boolean;
  label?: string;
  overlay?: boolean;
  fullscreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const Loading: React.FC<LoadingProps> = ({
  show = false,
  label = "Cargando…",
  overlay = false,
  fullscreen = false,
  size = "md",
  className,
}) => {
  if (!show) return null;

  const containerClasses = clsx(
    overlay && "absolute inset-0",
    fullscreen && "fixed inset-0",
    (overlay || fullscreen) && "z-50 grid place-items-center bg-white/60 dark:bg-slate-900/40 backdrop-blur-[1px]"
  );

  const spinner = (
    <div className={clsx("flex items-center gap-3", className)} role="status" aria-live="polite">
      <svg
        className={clsx("animate-spin text-slate-600 dark:text-slate-300", sizeMap[size])}
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/>
      </svg>
      {label && <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>}
    </div>
  );

  if (overlay || fullscreen) return <div className={containerClasses}>{spinner}</div>;
  return spinner;
};
