import { useState, useEffect, useCallback } from 'react'
import { db } from '../db/database'
import type { Inspecao, StatusInspecao } from '../types/inspecao'

export function useInspecoes() {
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const all = await db.inspecoes.orderBy('created_at').reverse().toArray()
    setInspecoes(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { inspecoes, loading, refresh: load }
}

export function useInspecao(id: number) {
  const [inspecao, setInspecao] = useState<Inspecao | undefined>()
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const item = await db.inspecoes.get(id)
    setInspecao(item)
    setLoading(false)
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  return { inspecao, loading, refresh: load }
}

export async function createInspecao(data: Omit<Inspecao, 'id'>): Promise<number> {
  return (await db.inspecoes.add(data as Inspecao)) as unknown as number
}

export async function updateInspecao(id: number, data: Partial<Omit<Inspecao, 'id'>>): Promise<void> {
  await db.inspecoes.update(id, { ...data, updated_at: new Date().toISOString() })
}

export async function deleteInspecao(id: number): Promise<void> {
  const constatacoes = await db.constatacoes.where('inspecao_id').equals(id).toArray()
  const ids = constatacoes.map(c => c.id)
  if (ids.length > 0) {
    await db.fotos.where('constatacao_id').anyOf(ids).delete()
    await db.constatacoes.where('inspecao_id').equals(id).delete()
  }
  await db.inspecoes.delete(id)
}

export async function setInspecaoStatus(id: number, status: StatusInspecao): Promise<void> {
  const updates: Partial<Inspecao> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === 'Enviado') {
    updates.enviado_em = new Date().toISOString()
  }
  await db.inspecoes.update(id, updates)
}
