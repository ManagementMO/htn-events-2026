"use client";

import clsx from "clsx";
import Link from "next/link";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  as?: "div" | "article";
  href?: string;
}

const cardStyles =
  "bg-[#141929] border border-[#1e293b] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#1c2238] hover:border-[#2a3454] hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function Card({
  children,
  className,
  onClick,
  as = "article",
  href,
}: CardProps) {
  const combinedClassName = clsx(cardStyles, className);

  if (href) {
    return (
      <Link href={href} className={clsx(combinedClassName, "block")}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx(combinedClassName, "w-full text-left")}
      >
        {children}
      </button>
    );
  }

  const Component = as;

  return <Component className={combinedClassName}>{children}</Component>;
}
