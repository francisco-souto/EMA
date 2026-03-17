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
  Crítica: { text: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
  Alta:    { text: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
  Média:   { text: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  Baixa:   { text: '#166534', bg: '#f0fdf4', border: '#86efac' },
}

const inputClass =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

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
      <form onSubmit={e => void handleSubmit(e)} className="p-4 space-y-5 pb-8">
        {/* Gravidade — visual selector */}
        <div>
          <label className={labelClass}>
            Gravidade <span className="text-red-500">*</span>
          </label>
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
                    borderColor: active ? s.border : '#e5e7eb',
                    color: active ? s.text : '#9ca3af',
                  }}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        {/* Área + Categoria */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Área <span className="text-red-500">*</span>
            </label>
            <select
              value={form.area_inspecionada}
              onChange={e => set('area_inspecionada', e.target.value)}
              className={inputClass}
            >
              {AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={form.categoria}
              onChange={e => set('categoria', e.target.value)}
              className={inputClass}
            >
              {CATEGORIAS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className={labelClass}>
            Descrição da Constatação <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={form.descricao}
            onChange={e => set('descricao', e.target.value)}
            rows={4}
            placeholder="Descreva detalhadamente o que foi observado..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Recomendação */}
        <div>
          <label className={labelClass}>Recomendação</label>
          <textarea
            value={form.recomendacao}
            onChange={e => set('recomendacao', e.target.value)}
            rows={3}
            placeholder="Ação recomendada para a gestão corrigir..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Prazo + Responsável */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Prazo</label>
            <select
              value={form.prazo_recomendado}
              onChange={e => set('prazo_recomendado', e.target.value)}
              className={inputClass}
            >
              {PRAZOS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Responsável</label>
            <input
              type="text"
              value={form.responsavel}
              onChange={e => set('responsavel', e.target.value)}
              placeholder="Nome ou cargo"
              className={inputClass}
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className={labelClass}>Observações Adicionais</label>
          <textarea
            value={form.observacoes}
            onChange={e => set('observacoes', e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Fotos */}
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            📷 Fotos
            {photos.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({photos.length} selecionada{photos.length !== 1 ? 's' : ''})
              </span>
            )}
          </p>
          <PhotoCapture onChange={setPhotos} />
        </div>

        {/* Geolocalização */}
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">📍 Geolocalização</p>
          <GeoLocationCapture value={geo} onCapture={handleGeoCapture} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 text-white font-semibold rounded-xl text-sm disabled:opacity-60"
          style={{ backgroundColor: '#1a3c6e' }}
        >
          {saving ? `Salvando${photos.length > 0 ? ` ${photos.length} foto${photos.length !== 1 ? 's' : ''}` : ''}...` : 'Salvar Constatação'}
        </button>
      </form>
    </Layout>
  )
}
