"use client";

import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import Link from "next/link";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function LoadingLink({ children, href, className, ...props }: Props) {
  const { isLoading, startLoading } = useNavigationLoading();

  return (
    <Link
      href={href}
      className={`${className} ${isLoading ? "pointer-events-none" : ""}`}
      onClick={startLoading}
      {...props}
    >
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      )}
    </Link>
  );
}
