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
      <form onSubmit={e => void handleSubmit(e)} className="p-4 space-y-5 pb-8">
        {/* Section: Unidade */}
        <div className="card-corp p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3 4.5h.008v.008H18v-.008zm0 3h.008v.008H18v-.008zm0 3h.008v.008H18v-.008z" />
            </svg>
            <span className="section-title">Estabelecimento Penal</span>
          </div>
          <div>
            <label className="label-corp">
              Unidade Prisional <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.unidade_prisional}
              onChange={e => set('unidade_prisional', e.target.value)}
              placeholder="Ex: Penitenciária Central do Estado"
              className="input-corp"
            />
          </div>

          <div className="grid grid-cols-[1fr_5rem] gap-3">
            <div>
              <label className="label-corp">Município</label>
              <input
                type="text"
                value={form.municipio}
                onChange={e => set('municipio', e.target.value)}
                placeholder="Ex: Goiânia"
                className="input-corp"
              />
            </div>
            <div>
              <label className="label-corp">UF</label>
              <select
                value={form.uf}
                onChange={e => set('uf', e.target.value)}
                className="input-corp"
              >
                {UFS.map(uf => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Inspeção */}
        <div className="card-corp p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            <span className="section-title">Dados da Inspeção</span>
          </div>
          <div>
            <label className="label-corp">
              Tipo de Inspeção <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tipo_inspecao}
              onChange={e => set('tipo_inspecao', e.target.value)}
              className="input-corp"
            >
              {TIPOS.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-corp">
              Data e Hora <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={form.data_inspecao}
              onChange={e => set('data_inspecao', e.target.value)}
              className="input-corp"
            />
          </div>
        </div>

        {/* Section: Equipe */}
        <div className="card-corp p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <span className="section-title">Equipe Inspetora</span>
          </div>
          <div>
            <label className="label-corp">
              Nome do Inspetor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.inspetor_nome}
              onChange={e => set('inspetor_nome', e.target.value)}
              placeholder="Nome completo do inspetor responsável"
              className="input-corp"
            />
          </div>

          <div>
            <label className="label-corp">Equipe</label>
            <input
              type="text"
              value={form.equipe}
              onChange={e => set('equipe', e.target.value)}
              placeholder="Nomes dos demais membros (opcional)"
              className="input-corp"
            />
          </div>
        </div>

        {/* Observações */}
        <div className="card-corp p-4">
          <label className="label-corp">Observações Gerais</label>
          <textarea
            value={form.observacoes_gerais}
            onChange={e => set('observacoes_gerais', e.target.value)}
            rows={3}
            placeholder="Contexto geral da visita de inspeção (opcional)"
            className="input-corp resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 text-sm btn-primary mt-2"
        >
          {saving ? 'Salvando...' : 'Continuar → Adicionar Constatações'}
        </button>
      </form>
    </Layout>
  )
}
