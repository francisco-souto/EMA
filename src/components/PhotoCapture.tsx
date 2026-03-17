import { useState, useRef, useEffect } from 'react'

interface PhotoFile {
  file: File
  url: string
}

interface PhotoCaptureProps {
  onChange: (files: File[]) => void
}

export default function PhotoCapture({ onChange }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const photosRef = useRef<PhotoFile[]>([])

  useEffect(() => {
    return () => {
      photosRef.current.forEach(p => URL.revokeObjectURL(p.url))
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? [])
    if (newFiles.length === 0) return

    const newPhotos = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }))

    const updated = [...photos, ...newPhotos]
    photosRef.current = updated
    setPhotos(updated)
    onChange(updated.map(p => p.file))

    if (inputRef.current) inputRef.current.value = ''
  }

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index].url)
    const updated = photos.filter((_, i) => i !== index)
    photosRef.current = updated
    setPhotos(updated)
    onChange(updated.map(p => p.file))
  }

  return (
    <div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((photo, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden bg-gray-200" style={{ aspectRatio: '1' }}>
              <img
                src={photo.url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md"
                style={{ backgroundColor: '#dc2626' }}
                aria-label={`Remover foto ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 flex items-center justify-center gap-2 active:bg-gray-50"
      >
        <span className="text-xl">📷</span>
        {photos.length === 0 ? 'Tirar / Adicionar Fotos' : `+ Mais fotos (${photos.length} adicionada${photos.length !== 1 ? 's' : ''})`}
      </button>
    </div>
  )
}
