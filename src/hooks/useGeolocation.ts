import { useState } from 'react'
import type { Geolocalizacao } from '../types/inspecao'

interface GeolocationHook {
  loading: boolean
  error: string | null
  capture: () => Promise<Geolocalizacao>
}

export function useGeolocation(): GeolocationHook {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const capture = (): Promise<Geolocalizacao> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocalização não suportada neste dispositivo.'
        setError(msg)
        reject(new Error(msg))
        return
      }

      setLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoading(false)
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          })
        },
        (err) => {
          const messages: Record<number, string> = {
            1: 'Permissão de localização negada. Verifique as configurações do navegador.',
            2: 'Localização indisponível no momento.',
            3: 'Tempo de espera esgotado. Tente novamente.',
          }
          const msg = messages[err.code] ?? 'Erro ao obter localização.'
          setLoading(false)
          setError(msg)
          reject(new Error(msg))
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      )
    })
  }

  return { loading, error, capture }
}
