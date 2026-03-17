import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { useInspecao, updateInspecao } from '../hooks/useInspecao'
import { useConstatacoes, deleteConstatacao } from '../hooks/useConstatacao'

const GRAVITY_COLORS: Record<string, { bg: string; text: string }> = {
  Crítica: { bg: '#fee2e2', text: '#991b1b' },
  Alta: { bg: '#fef3c7', text: '#92400e' },
  Média: { bg: '#dbeafe', text: '#1e40af' },
  Baixa: { bg: '#f0fdf4', text: '#166534' },
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
        <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {new Date(inspecao.data_inspecao).toLocaleDateString('pt-BR')} · {inspecao.tipo_inspecao}
          </p>
          <StatusBadge status={inspecao.status} />
        </div>
      )}

      <div className="p-4 space-y-3 pb-36">
        {!loadingConst && constatacoes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 font-semibold">Nenhuma constatação ainda</p>
            <p className="text-sm text-gray-400 mt-1">
              Toque em "+ Nova Constatação" para registrar
            </p>
          </div>
        )}

        {constatacoes.map((c, idx) => {
          const gc = GRAVITY_COLORS[c.gravidade] ?? { bg: '#f8fafc', text: '#475569' }
          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
              <div className="px-3 py-2.5">
                <p className="text-sm text-gray-900 line-clamp-3">{c.descricao}</p>
                {c.recomendacao && (
                  <p className="text-xs text-blue-600 mt-1 line-clamp-1">→ {c.recomendacao}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-3 text-xs text-gray-400">
                    {c.prazo_recomendado && <span>⏱ {c.prazo_recomendado}d</span>}
                    {c.geolocalizacao && <span>📍</span>}
                  </div>
                  <button
                    onClick={e => void handleDelete(c.id, e)}
                    className="text-xs text-red-400 active:text-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 space-y-2 z-10 shadow-lg">
        <button
          onClick={() => navigate(`/inspecao/${inspecaoId}/constatacao/nova`)}
          className="w-full py-3 text-sm font-semibold border-2 rounded-xl active:bg-blue-50"
          style={{ borderColor: '#1a3c6e', color: '#1a3c6e', backgroundColor: '#fff' }}
        >
          + Nova Constatação
        </button>
        {constatacoes.length > 0 && (
          <button
            onClick={() => void handleFinalizar()}
            className="w-full py-3 text-white text-sm font-semibold rounded-xl"
            style={{ backgroundColor: '#1a3c6e' }}
          >
            ✓ Finalizar Inspeção ({constatacoes.length}) →
          </button>
        )}
      </div>
    </Layout>
  )
}
