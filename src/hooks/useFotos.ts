import { db } from '../db/database'
import type { Foto } from '../types/inspecao'

export async function addFoto(constatacaoId: number, blob: Blob, nome: string): Promise<number> {
  return (await db.fotos.add({
    constatacao_id: constatacaoId,
    blob,
    nome,
    tamanho: blob.size,
    created_at: new Date().toISOString(),
  } as Foto)) as unknown as number
}

export async function getFotosByConstatacao(constatacaoId: number): Promise<Foto[]> {
  return db.fotos.where('constatacao_id').equals(constatacaoId).toArray()
}
