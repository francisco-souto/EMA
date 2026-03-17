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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-xl">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="w-10 h-10 rounded-lg shrink-0" />
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
              className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg"
              style={{ backgroundColor: '#1a3c6e' }}
            >
              Instalar
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
