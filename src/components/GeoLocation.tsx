import { useGeolocation } from '../hooks/useGeolocation'
import type { Geolocalizacao } from '../types/inspecao'

interface GeoLocationCaptureProps {
  value: Geolocalizacao | null
  onCapture: (geo: Geolocalizacao) => void
}

export default function GeoLocationCapture({ value, onCapture }: GeoLocationCaptureProps) {
  const { loading, error, capture } = useGeolocation()

  const handleCapture = async () => {
    try {
      const geo = await capture()
      onCapture(geo)
    } catch {
      // error displayed via hook state
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleCapture()}
        disabled={loading}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 flex items-center justify-center gap-2 disabled:opacity-60 active:bg-gray-50"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
            Obtendo localização...
          </>
        ) : (
          <>
            <span className="text-xl">📍</span>
            {value ? 'Recapturar Localização' : 'Capturar Localização GPS'}
          </>
        )}
      </button>

      {value && (
        <div className="px-3 py-2 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-700">✅ Localização capturada</p>
          <p className="text-xs text-green-600 mt-0.5">
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            {value.accuracy != null && ` · precisão ±${value.accuracy}m`}
          </p>
          <a
            href={`https://maps.google.com/?q=${value.lat},${value.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline mt-0.5 inline-block"
          >
            Ver no mapa ↗
          </a>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 px-1">{error}</p>
      )}
    </div>
  )
}
