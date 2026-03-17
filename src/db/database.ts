import Dexie, { type EntityTable } from 'dexie'
import type { Inspecao, Constatacao, Foto } from '../types/inspecao'

class ONASPDatabase extends Dexie {
  inspecoes!: EntityTable<Inspecao, 'id'>
  constatacoes!: EntityTable<Constatacao, 'id'>
  fotos!: EntityTable<Foto, 'id'>

  constructor() {
    super('onasp_inspecoes')
    this.version(1).stores({
      inspecoes: '++id, status, created_at',
      constatacoes: '++id, inspecao_id',
      fotos: '++id, constatacao_id',
    })
  }
}

export const db = new ONASPDatabase()
