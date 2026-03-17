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
      <div className="p-4 space-y-4 pb-36">
        {/* Inspection card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900">{inspecao.unidade_prisional}</h2>
              {(inspecao.municipio || inspecao.uf) && (
                <p className="text-sm text-gray-500">
                  {[inspecao.municipio, inspecao.uf].filter(Boolean).join(' — ')}
                </p>
              )}
            </div>
            <StatusBadge status={inspecao.status} />
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>📅 {fmtDate(inspecao.data_inspecao)}</p>
            <p>👤 {inspecao.inspetor_nome}</p>
            {inspecao.equipe && <p>👥 {inspecao.equipe}</p>}
            <p>📋 {inspecao.tipo_inspecao}</p>
          </div>
          {inspecao.observacoes_gerais && (
            <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
              {inspecao.observacoes_gerais}
            </p>
          )}
          {inspecao.enviado_em && (
            <p className="mt-2 text-xs text-green-600 font-medium">
              ✅ Enviado em {fmtDate(inspecao.enviado_em)}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{constatacoes.length}</div>
            <div className="text-xs text-gray-500 mt-1">Constatações</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{totalFotos}</div>
            <div className="text-xs text-gray-500 mt-1">Fotos</div>
          </div>
        </div>

        {/* Constatações */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-1">
            Constatações
          </h3>
          <div className="space-y-2">
            {constatacoes.map((c, i) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: GRAVITY_CLR[c.gravidade] ?? '#374151' }}
                  >
                    ● {c.gravidade}
                  </span>
                  <span className="text-xs text-gray-400">· {c.area_inspecionada}</span>
                  <span className="text-xs text-gray-400">· {c.categoria}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    #{i + 1}
                    {(fotoCounts[c.id] ?? 0) > 0 && ` · 📷${fotoCounts[c.id]}`}
                  </span>
                </div>
                <p className="text-sm text-gray-900 line-clamp-2">{c.descricao}</p>
                {c.recomendacao && (
                  <p className="text-xs text-blue-600 mt-1 line-clamp-1">→ {c.recomendacao}</p>
                )}
                {c.geolocalizacao && (
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {c.geolocalizacao.lat.toFixed(5)}, {c.geolocalizacao.lng.toFixed(5)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status feedback */}
        {shareStatus === 'shared' && (
          <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-sm text-green-700 font-medium">
            ✅ Relatório compartilhado com sucesso! Inspeção marcada como Enviado.
          </div>
        )}
        {shareStatus === 'downloaded' && (
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
            📥 Arquivo ZIP baixado! Anexe ao e-mail e envie para <strong>inspecoes@onasp.gov.br</strong>
          </div>
        )}
        {shareStatus === 'error' && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-sm text-red-700">
            ❌ Erro ao gerar relatório. Verifique o espaço de armazenamento.
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 space-y-2 z-10 shadow-lg">
        <button
          onClick={() => void handleShare()}
          disabled={generating || constatacoes.length === 0}
          className="w-full py-3.5 text-white font-semibold rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#1a3c6e' }}
        >
          {generating
            ? 'Gerando relatório ZIP...'
            : `📤 Gerar ZIP e Compartilhar (${constatacoes.length} constatação${constatacoes.length !== 1 ? 'ões' : ''})`}
        </button>
        <button
          onClick={() => navigate(`/inspecao/${inspecaoId}/constatacoes`)}
          className="w-full py-2.5 text-sm text-gray-500 rounded-xl border border-gray-200"
        >
          ← Voltar e editar
        </button>
      </div>
    </Layout>
  )
}
