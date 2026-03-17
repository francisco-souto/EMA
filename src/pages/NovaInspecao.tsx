import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { createInspecao } from '../hooks/useInspecao'
import type { TipoInspecao } from '../types/inspecao'

const TIPOS: TipoInspecao[] = ['Ordinária', 'Extraordinária', 'Correicional']

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

type FormData = {
  unidade_prisional: string
  municipio: string
  uf: string
  inspetor_nome: string
  equipe: string
  tipo_inspecao: TipoInspecao
  observacoes_gerais: string
  data_inspecao: string
}

const inputClass =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export default function NovaInspecao() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>({
    unidade_prisional: '',
    municipio: '',
    uf: 'GO',
    inspetor_nome: '',
    equipe: '',
    tipo_inspecao: 'Ordinária',
    observacoes_gerais: '',
    data_inspecao: new Date().toISOString().slice(0, 16),
  })

  const set = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const now = new Date().toISOString()
      const id = await createInspecao({
        ...form,
        data_inspecao: new Date(form.data_inspecao).toISOString(),
        status: 'Rascunho',
        enviado_em: null,
        created_at: now,
        updated_at: now,
      })
      navigate(`/inspecao/${id}/constatacoes`, { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout title="Nova Inspeção" showBack>
      <form onSubmit={e => void handleSubmit(e)} className="p-4 space-y-4 pb-8">
        <div>
          <label className={labelClass}>
            Unidade Prisional <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.unidade_prisional}
            onChange={e => set('unidade_prisional', e.target.value)}
            placeholder="Ex: Penitenciária Central do Estado"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className={labelClass}>Município</label>
            <input
              type="text"
              value={form.municipio}
              onChange={e => set('municipio', e.target.value)}
              placeholder="Ex: Goiânia"
              className={inputClass}
            />
          </div>
          <div style={{ width: 72 }}>
            <label className={labelClass}>UF</label>
            <select
              value={form.uf}
              onChange={e => set('uf', e.target.value)}
              className={inputClass}
            >
              {UFS.map(uf => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Tipo de Inspeção <span className="text-red-500">*</span>
          </label>
          <select
            value={form.tipo_inspecao}
            onChange={e => set('tipo_inspecao', e.target.value)}
            className={inputClass}
          >
            {TIPOS.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Data e Hora <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={form.data_inspecao}
            onChange={e => set('data_inspecao', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Nome do Inspetor <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.inspetor_nome}
            onChange={e => set('inspetor_nome', e.target.value)}
            placeholder="Nome completo do inspetor responsável"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Equipe</label>
          <input
            type="text"
            value={form.equipe}
            onChange={e => set('equipe', e.target.value)}
            placeholder="Nomes dos demais membros (opcional)"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Observações Gerais</label>
          <textarea
            value={form.observacoes_gerais}
            onChange={e => set('observacoes_gerais', e.target.value)}
            rows={3}
            placeholder="Contexto geral da visita de inspeção (opcional)"
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 text-white font-semibold rounded-xl text-sm disabled:opacity-60 mt-2"
          style={{ backgroundColor: '#1a3c6e' }}
        >
          {saving ? 'Salvando...' : 'Continuar → Adicionar Constatações'}
        </button>
      </form>
    </Layout>
  )
}
