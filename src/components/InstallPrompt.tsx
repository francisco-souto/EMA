import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (sessionStorage.getItem('install-dismissed')) {
      setDismissed(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isIos && !isStandalone) setShowIosHint(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setDismissed(true)
    setDeferredPrompt(null)
    setShowIosHint(false)
    sessionStorage.setItem('install-dismissed', '1')
  }

  if (dismissed || (!deferredPrompt && !showIosHint)) return null

  return (
    <div className="bottom-bar z-50">
      <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-3">
        <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="w-10 h-10 rounded-xl shrink-0 shadow-sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Instalar ONASP</p>
          {showIosHint ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Compartilhar <span className="font-medium">□↑</span> → Adicionar à Tela de Início
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">
              Use offline sem depender do navegador
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {deferredPrompt && (
            <button
              onClick={() => void handleInstall()}
              className="btn-primary px-3.5 py-1.5 text-sm rounded-lg"
            >
              Instalar
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="btn-secondary px-3 py-1.5 text-sm rounded-lg text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
