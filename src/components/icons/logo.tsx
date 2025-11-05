import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M16 23V19M16 19H12.5C11.1193 19 10 17.8807 10 16.5V13.5C10 12.1193 11.1193 11 12.5 11H19.5C20.8807 11 22 12.1193 22 13.5V16.5C22 17.8807 20.8807 19 19.5 19H16Z"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
