import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface LayoutProps {
  title: string
  children: ReactNode
  showBack?: boolean
  rightAction?: ReactNode
}

export default function Layout({ title, children, showBack = false, rightAction }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh', backgroundColor: '#f1f5f9' }}>
      <header
        className="sticky top-0 z-20 shadow-md"
        style={{ backgroundColor: '#1a3c6e' }}
      >
        <div className="flex items-center gap-2 px-3" style={{ height: 56 }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-white"
              aria-label="Voltar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {!showBack && (
            <img
              src={`${import.meta.env.BASE_URL}icons/icon.svg`}
              alt=""
              className="w-8 h-8 rounded-md shrink-0"
              aria-hidden="true"
            />
          )}
          <h1 className="flex-1 text-base font-semibold text-white truncate">{title}</h1>
          {rightAction && <div className="shrink-0 text-white">{rightAction}</div>}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
