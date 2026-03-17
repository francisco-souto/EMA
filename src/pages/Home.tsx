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
          className="p-2 -mr-1 rounded-lg active:bg-white/10 transition-colors"
          aria-label="Instruções de instalação"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
        <div className="px-4 py-2.5 text-sm font-medium text-amber-800 bg-amber-50/80 border-b border-amber-200/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Sem conexão — modo offline ativo</span>
        </div>
      )}

      <div className="p-4 space-y-3 pb-28">
        {/* Stats bar */}
        {!loading && inspecoes.length > 0 && (
          <div className="flex items-center gap-3 px-1 mb-1">
            <span className="section-title">{inspecoes.length} inspeç{inspecoes.length !== 1 ? 'ões' : 'ão'}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-3">Carregando...</p>
          </div>
        )}

        {!loading && inspecoes.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-base">Nenhuma inspeção registrada</p>
            <p className="text-sm text-gray-400 mt-2 max-w-[240px] mx-auto leading-relaxed">
              Toque no botão <span className="font-semibold text-primary">+</span> para iniciar sua primeira inspeção
            </p>
          </div>
        )}

        {inspecoes.map(insp => (
          <div
            key={insp.id}
            onClick={() => navigate(`/inspecao/${insp.id}/constatacoes`)}
            className="card-corp p-4 cursor-pointer"
            style={{ opacity: deleting === insp.id ? 0.5 : 1 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-[0.9375rem]">{insp.unidade_prisional}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {[insp.municipio, insp.uf].filter(Boolean).join(' — ')}
                  {(insp.municipio || insp.uf) ? ' · ' : ''}
                  {insp.tipo_inspecao}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">{formatDate(insp.data_inspecao)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-400 truncate">{insp.inspetor_nome}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={insp.status} />
                <button
                  onClick={e => void handleDelete(insp.id, e)}
                  className="text-xs text-gray-400 active:text-red-600 py-0.5 transition-colors"
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
        className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-2xl flex items-center justify-center text-2xl z-10 active:scale-95 transition-transform btn-primary"
        style={{ boxShadow: '0 4px 16px -3px rgba(26, 60, 110, 0.5)' }}
        aria-label="Nova inspeção"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </Layout>
  )
}
