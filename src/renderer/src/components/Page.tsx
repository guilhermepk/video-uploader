import { ReactNode } from "react"

interface PageProps {
  children: ReactNode,
  className?: string
}

export default function Page({
  children, className
}: PageProps): React.JSX.Element {
  return (
    <div
      className={`
        flex flex-col items-center p-10 gap-10 w-full h-screen overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  )
}