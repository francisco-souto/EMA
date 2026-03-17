/**
 * Compresses an image file using canvas API.
 * Resizes to max 1920px wide, JPEG quality 0.75.
 */
export async function compressImage(
  file: File,
  maxWidthPx = 1920,
  quality = 0.75,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { naturalWidth: w, naturalHeight: h } = img
      if (w > maxWidthPx) {
        h = Math.round((h * maxWidthPx) / w)
        w = maxWidthPx
      }

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable.'))
        return
      }

      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Falha ao comprimir imagem.'))
          }
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Falha ao carregar imagem.'))
    }

    img.src = objectUrl
  })
}
