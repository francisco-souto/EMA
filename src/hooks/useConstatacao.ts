import { useState, useEffect, useCallback } from 'react'
import { db } from '../db/database'
import type { Constatacao } from '../types/inspecao'

export function useConstatacoes(inspecaoId: number) {
  const [constatacoes, setConstatacoes] = useState<Constatacao[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const all = await db.constatacoes
      .where('inspecao_id')
      .equals(inspecaoId)
      .toArray()
    all.sort((a, b) => a.created_at.localeCompare(b.created_at))
    setConstatacoes(all)
    setLoading(false)
  }, [inspecaoId])

  useEffect(() => {
    void load()
  }, [load])

  return { constatacoes, loading, refresh: load }
}

export async function createConstatacao(data: Omit<Constatacao, 'id'>): Promise<number> {
  return (await db.constatacoes.add(data as Constatacao)) as unknown as number
}

export async function deleteConstatacao(id: number): Promise<void> {
  await db.fotos.where('constatacao_id').equals(id).delete()
  await db.constatacoes.delete(id)
}
