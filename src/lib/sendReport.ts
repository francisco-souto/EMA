export interface ShareResult {
  success: boolean
  method: 'webshare' | 'download'
  cancelled?: boolean
}

/**
 * Primary: Web Share API (native OS share sheet — picks email, WhatsApp, etc.)
 * Fallback: triggers browser download of the ZIP file.
 */
export async function shareOrDownloadZip(
  zipBlob: Blob,
  filename: string,
  title: string,
): Promise<ShareResult> {
  const file = new File([zipBlob], filename, { type: 'application/zip' })

  if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title,
        text: `Relatório de inspeção gerado pelo app ONASP em ${new Date().toLocaleDateString('pt-BR')}.`,
      })
      return { success: true, method: 'webshare' }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, method: 'webshare', cancelled: true }
      }
      // Fall through to download
    }
  }

  // Fallback: trigger file download
  const url = URL.createObjectURL(zipBlob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  setTimeout(() => URL.revokeObjectURL(url), 30_000)

  return { success: true, method: 'download' }
}

export function buildZipFilename(inspecao: {
  unidade_prisional: string
  data_inspecao: string
}): string {
  const date = inspecao.data_inspecao.slice(0, 10)
  const unit = inspecao.unidade_prisional
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 30)
  return `ONASP_Inspecao_${unit}_${date}.zip`
}
