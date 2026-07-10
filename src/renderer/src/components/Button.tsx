import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode,
  onClick: () => void,
  disabled?: boolean,
  className?: string,
  transparentBg?: boolean
}

export default function Button({
  children, disabled = false, onClick, className, transparentBg = false
}: ButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center gap-3
        text-white
        border border-transparent
        rounded-[10px]
        py-3 px-4
        ${transparentBg
          ? 'bg-transparent'
          : 'bg-[#1b1b1f] shadow-black shadow-sm'
        }
        ${disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer opacity-100 hover:text-blue-600 hover:shadow-md'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}