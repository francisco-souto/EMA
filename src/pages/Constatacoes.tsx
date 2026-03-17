import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { useInspecao, updateInspecao } from '../hooks/useInspecao'
import { useConstatacoes, deleteConstatacao } from '../hooks/useConstatacao'

const GRAVITY_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  Crítica: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', accent: '#dc2626' },
  Alta: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', accent: '#d97706' },
  Média: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', accent: '#2563eb' },
  Baixa: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', accent: '#16a34a' },
}

export default function Constatacoes() {
  const { id } = useParams<{ id: string }>()
  const inspecaoId = Number(id)
  const navigate = useNavigate()

  const { inspecao, loading: loadingInsp } = useInspecao(inspecaoId)
  const { constatacoes, loading: loadingConst, refresh } = useConstatacoes(inspecaoId)

  const handleDelete = async (constId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Excluir esta constatação e suas fotos?')) return
    await deleteConstatacao(constId)
    await refresh()
  }

  const handleFinalizar = async () => {
    if (constatacoes.length === 0) {
      alert('Adicione pelo menos uma constatação antes de finalizar.')
      return
    }
    await updateInspecao(inspecaoId, { status: 'Finalizado' })
    navigate(`/inspecao/${inspecaoId}/revisao`)
  }

  if (loadingInsp) return null

  return (
    <Layout
      title={inspecao?.unidade_prisional ?? 'Constatações'}
      showBack
    >
      {inspecao && (
        <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{new Date(inspecao.data_inspecao).toLocaleDateString('pt-BR')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{inspecao.tipo_inspecao}</span>
          </div>
          <StatusBadge status={inspecao.status} />
        </div>
      )}

      <div className="p-4 space-y-3 pb-40">
        {!loadingConst && constatacoes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">Nenhuma constatação</p>
            <p className="text-sm text-gray-400 mt-1">
              Toque em "+ Nova Constatação" para registrar
            </p>
          </div>
        )}

        {constatacoes.length > 0 && (
          <div className="flex items-center gap-3 px-1 mb-1">
            <span className="section-title">{constatacoes.length} constatação{constatacoes.length !== 1 ? 'ões' : ''}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {constatacoes.map((c, idx) => {
          const gc = GRAVITY_COLORS[c.gravidade] ?? { bg: '#f8fafc', text: '#475569', border: '#e2e8f0', accent: '#64748b' }
          return (
            <div key={c.id} className="card-corp overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: gc.accent }}>
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ backgroundColor: gc.bg }}
              >
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: gc.text }}>
                  {c.gravidade} — {c.area_inspecionada}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  #{idx + 1} · {c.categoria}
                </span>
              </div>
              <div className="px-3 py-3">
                <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">{c.descricao}</p>
                {c.recomendacao && (
                  <p className="text-xs text-blue-600 mt-2 line-clamp-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    {c.recomendacao}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                  <div className="flex gap-3 text-xs text-gray-400">
                    {c.prazo_recomendado && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {c.prazo_recomendado}d
                      </span>
                    )}
                    {c.geolocalizacao && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        GPS
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => void handleDelete(c.id, e)}
                    className="text-xs text-gray-400 active:text-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bottom-bar space-y-2">
        <button
          onClick={() => navigate(`/inspecao/${inspecaoId}/constatacao/nova`)}
          className="w-full py-3 text-sm btn-secondary"
        >
          + Nova Constatação
        </button>
        {constatacoes.length > 0 && (
          <button
            onClick={() => void handleFinalizar()}
            className="w-full py-3 text-sm btn-primary"
          >
            Finalizar Inspeção ({constatacoes.length}) →
          </button>
        )}
      </div>
    </Layout>
  )
}
