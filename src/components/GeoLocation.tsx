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
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 flex items-center justify-center gap-2 disabled:opacity-60 active:bg-gray-50 transition-colors"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
            Obtendo localização...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            {value ? 'Recapturar Localização' : 'Capturar Localização GPS'}
          </>
        )}
      </button>

      {value && (
        <div className="px-3 py-2.5 bg-green-50 rounded-xl border border-green-200">
          <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Localização capturada
          </p>
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
