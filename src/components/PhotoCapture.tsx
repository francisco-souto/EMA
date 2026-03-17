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
                className="absolute top-1 right-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg transition-transform active:scale-90"
                style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}
                aria-label={`Remover foto ${i + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
        {photos.length === 0 ? 'Tirar / Adicionar Fotos' : `+ Mais fotos (${photos.length} adicionada${photos.length !== 1 ? 's' : ''})`}
      </button>
    </div>
  )
}
