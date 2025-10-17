// src/ui/SkeletonPresets.tsx
import React from "react";
import { Skeleton, SkeletonAvatar, SkeletonText } from "./skeleton";

export const ListSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
    {Array.from({ length: rows }).map((_, i) => (
      <li key={i} className="flex items-center gap-3 py-3">
        <SkeletonAvatar />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-8 w-16" />
      </li>
    ))}
  </ul>
);

export const CardGridSkeleton: React.FC<{ cards?: number }> = ({ cards = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: cards }).map((_, i) => (
      <div key={i} className="rounded-lg border border-slate-100 dark:border-slate-800 p-4">
        <Skeleton className="h-40 w-full mb-4 rounded-md" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <SkeletonText lines={2} />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 8, cols = 5 }) => (
  <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
    <div className="min-w-full">
      <div className="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))]" style={{ ["--cols" as any]: cols }}>
        {/* header */}
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40">
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
        {/* rows */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => (
            <div key={`${r}-${c}`} className="px-4 py-3">
              <Skeleton className="h-3 w-full" />
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
