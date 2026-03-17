import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { useInspecoes, deleteInspecao } from '../hooks/useInspecao'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function Home() {
  const navigate = useNavigate()
  const { inspecoes, loading, refresh } = useInspecoes()
  const isOnline = useOnlineStatus()
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Excluir esta inspeção e todas as suas constatações e fotos?')) return
    setDeleting(id)
    await deleteInspecao(id)
    await refresh()
    setDeleting(null)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  return (
    <Layout
      title="ONASP — Inspeções"
      rightAction={
        <button
          onClick={() => navigate('/instrucoes')}
          className="p-2 -mr-1 rounded-full"
          aria-label="Instruções de instalação"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      }
    >
      {!isOnline && (
        <div className="px-4 py-2 text-sm font-medium text-amber-800 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <span>📡</span>
          <span>Sem conexão — modo offline ativo</span>
        </div>
      )}

      <div className="p-4 space-y-3 pb-24">
        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">Carregando...</div>
        )}

        {!loading && inspecoes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 font-semibold text-base">Nenhuma inspeção registrada</p>
            <p className="text-sm text-gray-400 mt-2">Toque no botão + para iniciar uma inspeção</p>
          </div>
        )}

        {inspecoes.map(insp => (
          <div
            key={insp.id}
            onClick={() => navigate(`/inspecao/${insp.id}/constatacoes`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer active:bg-gray-50"
            style={{ opacity: deleting === insp.id ? 0.5 : 1 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{insp.unidade_prisional}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {[insp.municipio, insp.uf].filter(Boolean).join(' — ')}
                  {insp.municipio || insp.uf ? ' · ' : ''}
                  {insp.tipo_inspecao}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(insp.data_inspecao)} · {insp.inspetor_nome}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={insp.status} />
                <button
                  onClick={e => void handleDelete(insp.id, e)}
                  className="text-xs text-red-400 active:text-red-600 py-0.5"
                  aria-label="Excluir inspeção"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/nova-inspecao')}
        className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-xl flex items-center justify-center text-2xl z-10 active:scale-95 transition-transform"
        style={{ backgroundColor: '#1a3c6e' }}
        aria-label="Nova inspeção"
      >
        +
      </button>
    </Layout>
  )
}
