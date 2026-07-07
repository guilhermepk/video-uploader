import { ReactNode } from "react";

interface CardProps {
  children: ReactNode,
  onClick?: () => void
}

export default function Card({
  children, onClick
}: CardProps): React.JSX.Element {
  return (
    <div
      className={`
          p-4
          bg-[#1b1b1f]
          shadow-sm shadow-black
          rounded-[10px]
          h-full w-[350px]
          text-center
          flex flex-col items-center justify-center gap-5
          ${onClick ? `
            cursor-pointer
            border border-transparent hover:border-blue-600
          ` : ``}
        `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}