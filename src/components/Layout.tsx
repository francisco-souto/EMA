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
    <div className="flex flex-col" style={{ minHeight: '100dvh', backgroundColor: '#f0f2f5' }}>
      <header className="sticky top-0 z-20 gradient-header shadow-lg">
        <div className="flex items-center gap-3 px-4" style={{ height: 60 }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 flex items-center justify-center w-9 h-9 -ml-1 rounded-lg text-white/80 active:text-white active:bg-white/10 transition-colors"
              aria-label="Voltar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            <div className="shrink-0 w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}icons/icon.svg`}
                alt=""
                className="w-6 h-6"
                aria-hidden="true"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[0.9375rem] font-semibold text-white truncate tracking-tight">{title}</h1>
          </div>
          {rightAction && <div className="shrink-0 text-white/80">{rightAction}</div>}
        </div>
      </header>

      <main className="flex-1 fade-in">{children}</main>
    </div>
  )
}
