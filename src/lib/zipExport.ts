import JSZip from 'jszip'
import { db } from '../db/database'
import type { Inspecao } from '../types/inspecao'

export async function generateInspecaoZip(inspecao: Inspecao): Promise<Blob> {
  const zip = new JSZip()

  const constatacoes = await db.constatacoes
    .where('inspecao_id')
    .equals(inspecao.id)
    .toArray()
  constatacoes.sort((a, b) => a.created_at.localeCompare(b.created_at))

  const fotosFolder = zip.folder('fotos')!

  const constatacoesSerialized = await Promise.all(
    constatacoes.map(async (c) => {
      const fotos = await db.fotos.where('constatacao_id').equals(c.id).toArray()

      fotos.forEach((foto, i) => {
        const filename = `c${c.id}_${String(i + 1).padStart(2, '0')}.jpg`
        fotosFolder.file(filename, foto.blob)
      })

      return {
        ...c,
        fotos: fotos.map((f, i) => ({
          arquivo_zip: `fotos/c${c.id}_${String(i + 1).padStart(2, '0')}.jpg`,
          tamanho_bytes: f.tamanho,
        })),
      }
    }),
  )

  const report = {
    sistema: 'ONASP — Sistema de Inspeções em Estabelecimentos Penais',
    versao_app: '1.0.0',
    gerado_em: new Date().toISOString(),
    inspecao: {
      ...inspecao,
      constatacoes: constatacoesSerialized,
    },
  }

  zip.file('inspecao.json', JSON.stringify(report, null, 2))

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })
}
