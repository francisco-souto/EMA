import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { useInspecao, setInspecaoStatus } from '../hooks/useInspecao'
import { useConstatacoes } from '../hooks/useConstatacao'
import { db } from '../db/database'
import { generateInspecaoZip } from '../lib/zipExport'
import { shareOrDownloadZip, buildZipFilename } from '../lib/sendReport'

type ShareStatus = 'idle' | 'shared' | 'downloaded' | 'error'

export default function RevisaoInspecao() {
  const { id } = useParams<{ id: string }>()
  const inspecaoId = Number(id)
  const navigate = useNavigate()

  const { inspecao, refresh } = useInspecao(inspecaoId)
  const { constatacoes } = useConstatacoes(inspecaoId)
  const [fotoCounts, setFotoCounts] = useState<Record<number, number>>({})
  const [generating, setGenerating] = useState(false)
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle')

  useEffect(() => {
    if (constatacoes.length === 0) return
    const loadCounts = async () => {
      const counts: Record<number, number> = {}
      for (const c of constatacoes) {
        counts[c.id] = await db.fotos.where('constatacao_id').equals(c.id).count()
      }
      setFotoCounts(counts)
    }
    void loadCounts()
  }, [constatacoes])

  const totalFotos = Object.values(fotoCounts).reduce((a, b) => a + b, 0)

  const handleShare = async () => {
    if (!inspecao) return
    setGenerating(true)
    setShareStatus('idle')
    try {
      const zip = await generateInspecaoZip(inspecao)
      const filename = buildZipFilename(inspecao)
      const result = await shareOrDownloadZip(
        zip,
        filename,
        `Inspeção ONASP — ${inspecao.unidade_prisional}`,
      )
      if (result.cancelled) {
        setGenerating(false)
        return
      }
      await setInspecaoStatus(inspecaoId, 'Enviado')
      await refresh()
      setShareStatus(result.method === 'webshare' ? 'shared' : 'downloaded')
    } catch (err) {
      console.error(err)
      setShareStatus('error')
    } finally {
      setGenerating(false)
    }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })

  const GRAVITY_CLR: Record<string, string> = {
    Crítica: '#dc2626',
    Alta: '#d97706',
    Média: '#2563eb',
    Baixa: '#16a34a',
  }

  if (!inspecao) return null

  return (
    <Layout title="Revisão e Envio" showBack>
      <div className="p-4 space-y-4 pb-40">
        {/* Inspection card */}
        <div className="card-corp p-4" style={{ borderTopWidth: 3, borderTopColor: '#1a3c6e' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-[0.9375rem]">{inspecao.unidade_prisional}</h2>
              {(inspecao.municipio || inspecao.uf) && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {[inspecao.municipio, inspecao.uf].filter(Boolean).join(' — ')}
                </p>
              )}
            </div>
            <StatusBadge status={inspecao.status} />
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              <span>{fmtDate(inspecao.data_inspecao)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              <span>{inspecao.inspetor_nome}</span>
            </div>
            {inspecao.equipe && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                <span>{inspecao.equipe}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
              <span>{inspecao.tipo_inspecao}</span>
            </div>
          </div>
          {inspecao.observacoes_gerais && (
            <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
              {inspecao.observacoes_gerais}
            </p>
          )}
          {inspecao.enviado_em && (
            <div className="mt-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200 text-xs text-green-700 font-medium flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Enviado em {fmtDate(inspecao.enviado_em)}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-corp p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#1a3c6e' }}>{constatacoes.length}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Constatações</div>
          </div>
          <div className="card-corp p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#1a3c6e' }}>{totalFotos}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Fotos</div>
          </div>
        </div>

        {/* Constatações */}
        <div>
          <div className="flex items-center gap-3 px-1 mb-2">
            <span className="section-title">Constatações</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="space-y-2">
            {constatacoes.map((c, i) => (
              <div key={c.id} className="card-corp p-3" style={{ borderLeftWidth: 3, borderLeftColor: GRAVITY_CLR[c.gravidade] ?? '#64748b' }}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: GRAVITY_CLR[c.gravidade] ?? '#374151' }}
                  >
                    {c.gravidade}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-500">{c.area_inspecionada}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-500">{c.categoria}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    #{i + 1}
                    {(fotoCounts[c.id] ?? 0) > 0 && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /></svg>
                        {fotoCounts[c.id]}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed">{c.descricao}</p>
                {c.recomendacao && (
                  <p className="text-xs text-blue-600 mt-1 line-clamp-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    {c.recomendacao}
                  </p>
                )}
                {c.geolocalizacao && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {c.geolocalizacao.lat.toFixed(5)}, {c.geolocalizacao.lng.toFixed(5)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status feedback */}
        {shareStatus === 'shared' && (
          <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-sm text-green-700 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Relatório compartilhado com sucesso! Inspeção marcada como Enviado.
          </div>
        )}
        {shareStatus === 'downloaded' && (
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Arquivo ZIP baixado! Anexe ao e-mail e envie para <strong>inspecoes@onasp.gov.br</strong>
          </div>
        )}
        {shareStatus === 'error' && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            Erro ao gerar relatório. Verifique o espaço de armazenamento.
          </div>
        )}
      </div>

      <div className="bottom-bar space-y-2">
        <button
          onClick={() => void handleShare()}
          disabled={generating || constatacoes.length === 0}
          className="w-full py-3.5 text-sm btn-primary flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando relatório ZIP...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              Gerar ZIP e Compartilhar ({constatacoes.length})
            </>
          )}
        </button>
        <button
          onClick={() => navigate(`/inspecao/${inspecaoId}/constatacoes`)}
          className="w-full py-2.5 text-sm text-gray-500 rounded-xl border border-gray-200 active:bg-gray-50 transition-colors"
        >
          ← Voltar e editar
        </button>
      </div>
    </Layout>
  )
}
