import React from "react";
import clsx from "clsx";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = "md",
  ...rest
}) => (
  <div
    className={clsx(
      "animate-pulse bg-slate-200 dark:bg-slate-700",
      roundedMap[rounded],
      className
    )}
    {...rest}
  />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={clsx("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={clsx("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => (
  <Skeleton
    rounded="full"
    className={clsx("shrink-0", className)}
    style={{ width: size, height: size }}
  />
);
