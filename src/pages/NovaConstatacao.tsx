import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import PhotoCapture from '../components/PhotoCapture'
import GeoLocationCapture from '../components/GeoLocation'
import { createConstatacao } from '../hooks/useConstatacao'
import { addFoto } from '../hooks/useFotos'
import { compressImage } from '../lib/imageCompress'
import type {
  AreaInspecionada,
  CategoriaConstatacao,
  GravidadeConstatacao,
  Geolocalizacao,
} from '../types/inspecao'

const AREAS: AreaInspecionada[] = [
  'Cela', 'Pátio', 'Cozinha', 'Enfermaria', 'Administração',
  'Oficina', 'Visita Social', 'Visita Íntima', 'Triagem', 'Outro',
]
const CATEGORIAS: CategoriaConstatacao[] = [
  'Infraestrutura', 'Saúde', 'Segurança', 'Alimentação',
  'Superlotação', 'Direitos Humanos', 'Outro',
]
const GRAVIDADES: GravidadeConstatacao[] = ['Crítica', 'Alta', 'Média', 'Baixa']
const PRAZOS = [
  { value: '', label: '— Não definido —' },
  { value: '7', label: '7 dias' },
  { value: '15', label: '15 dias' },
  { value: '30', label: '30 dias' },
  { value: '60', label: '60 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '6 meses' },
  { value: '365', label: '1 ano' },
]

const GRAVITY_STYLE: Record<GravidadeConstatacao, { text: string; bg: string; border: string }> = {
  Crítica: { text: '#991b1b', bg: '#fef2f2', border: '#fca5a5' },
  Alta:    { text: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
  Média:   { text: '#1e40af', bg: '#eff6ff', border: '#93c5fd' },
  Baixa:   { text: '#166534', bg: '#f0fdf4', border: '#86efac' },
}

type FormData = {
  area_inspecionada: AreaInspecionada
  descricao: string
  categoria: CategoriaConstatacao
  gravidade: GravidadeConstatacao
  recomendacao: string
  prazo_recomendado: string
  responsavel: string
  observacoes: string
}

export default function NovaConstatacao() {
  const { id } = useParams<{ id: string }>()
  const inspecaoId = Number(id)
  const navigate = useNavigate()

  const [saving, setSaving] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [geo, setGeo] = useState<Geolocalizacao | null>(null)
  const [form, setForm] = useState<FormData>({
    area_inspecionada: 'Cela',
    descricao: '',
    categoria: 'Infraestrutura',
    gravidade: 'Média',
    recomendacao: '',
    prazo_recomendado: '',
    responsavel: '',
    observacoes: '',
  })

  const set = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleGeoCapture = useCallback((captured: Geolocalizacao) => {
    setGeo(captured)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descricao.trim()) {
      alert('Preencha a descrição da constatação.')
      return
    }
    setSaving(true)
    try {
      const constId = await createConstatacao({
        inspecao_id: inspecaoId,
        ...form,
        geolocalizacao: geo,
        created_at: new Date().toISOString(),
      })
      for (const file of photos) {
        const compressed = await compressImage(file)
        await addFoto(constId, compressed, `foto_${Date.now()}.jpg`)
      }
      navigate(`/inspecao/${inspecaoId}/constatacoes`, { replace: true })
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar constatação. Tente novamente.')
      setSaving(false)
    }
  }

  return (
    <Layout title="Nova Constatação" showBack>
      <form onSubmit={e => void handleSubmit(e)} className="p-4 space-y-4 pb-8">
        {/* Gravidade — visual selector */}
        <div className="card-corp p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="section-title">Nível de Gravidade</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {GRAVIDADES.map(g => {
              const active = form.gravidade === g
              const s = GRAVITY_STYLE[g]
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gravidade', g)}
                  className="py-2.5 text-xs font-bold rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: active ? s.bg : '#fff',
                    borderColor: active ? s.border : '#e2e8f0',
                    color: active ? s.text : '#94a3b8',
                  }}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        {/* Classificação */}
        <div className="card-corp p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span className="section-title">Classificação</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-corp">
                Área <span className="text-red-500">*</span>
              </label>
              <select
                value={form.area_inspecionada}
                onChange={e => set('area_inspecionada', e.target.value)}
                className="input-corp"
              >
                {AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-corp">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
                className="input-corp"
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="card-corp p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="section-title">Detalhamento</span>
          </div>
          <div>
            <label className="label-corp">
              Descrição da Constatação <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              rows={4}
              placeholder="Descreva detalhadamente o que foi observado..."
              className="input-corp resize-none"
            />
          </div>

          <div>
            <label className="label-corp">Recomendação</label>
            <textarea
              value={form.recomendacao}
              onChange={e => set('recomendacao', e.target.value)}
              rows={3}
              placeholder="Ação recomendada para a gestão corrigir..."
              className="input-corp resize-none"
            />
          </div>
        </div>

        {/* Prazo + Responsável */}
        <div className="card-corp p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="section-title">Prazo e Responsabilidade</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-corp">Prazo</label>
              <select
                value={form.prazo_recomendado}
                onChange={e => set('prazo_recomendado', e.target.value)}
                className="input-corp"
              >
                {PRAZOS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-corp">Responsável</label>
              <input
                type="text"
                value={form.responsavel}
                onChange={e => set('responsavel', e.target.value)}
                placeholder="Nome ou cargo"
                className="input-corp"
              />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="card-corp p-4">
          <label className="label-corp">Observações Adicionais</label>
          <textarea
            value={form.observacoes}
            onChange={e => set('observacoes', e.target.value)}
            rows={2}
            className="input-corp resize-none"
          />
        </div>

        {/* Fotos */}
        <div className="card-corp p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <span className="section-title">Registro Fotográfico</span>
            {photos.length > 0 && (
              <span className="text-xs text-gray-400 ml-auto">
                {photos.length} foto{photos.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <PhotoCapture onChange={setPhotos} />
        </div>

        {/* Geolocalização */}
        <div className="card-corp p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a3c6e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="section-title">Geolocalização</span>
          </div>
          <GeoLocationCapture value={geo} onCapture={handleGeoCapture} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 text-sm btn-primary"
        >
          {saving ? `Salvando${photos.length > 0 ? ` ${photos.length} foto${photos.length !== 1 ? 's' : ''}` : ''}...` : 'Salvar Constatação'}
        </button>
      </form>
    </Layout>
  )
}
