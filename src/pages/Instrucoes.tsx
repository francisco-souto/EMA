import Layout from '../components/Layout'

export default function Instrucoes() {
  return (
    <Layout title="Como Usar o App" showBack>
      <div className="p-4 space-y-5 pb-10">
        {/* Offline banner */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>Este aplicativo funciona 100% offline.</strong> Após instalar, você pode
            coletar dados de inspeções sem conexão. Os relatórios são gerados e compartilhados
            quando houver rede disponível.
          </p>
        </div>

        {/* Android */}
        <section>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
            <span>🤖</span> Instalar no Android (Chrome)
          </h2>
          <ol className="space-y-2">
            {[
              'Abra o link do app no Google Chrome',
              'Toque no menu ⋮ (3 pontos) no canto superior direito',
              'Selecione "Adicionar à Tela Inicial"',
              'Confirme o nome e toque em Adicionar',
              'O ícone ONASP aparecerá na sua tela inicial',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span
                  className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: '#1a3c6e' }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* iOS */}
        <section>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
            <span>🍎</span> Instalar no iPhone / iPad (Safari)
          </h2>
          <ol className="space-y-2">
            {[
              'Abra o link no Safari (não funciona no Chrome do iPhone)',
              'Toque no ícone de Compartilhar □↑ na barra inferior',
              'Role a lista e toque em "Adicionar à Tela de Início"',
              'Confirme o nome e toque em Adicionar',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span
                  className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: '#1a3c6e' }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Send report */}
        <section>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
            <span>📤</span> Como enviar o relatório
          </h2>
          <ol className="space-y-2">
            {[
              'Finalize a inspeção adicionando todas as constatações',
              'Na tela de Revisão, toque em "Gerar ZIP e Compartilhar"',
              'Escolha E-mail no compartilhamento — ou baixe o arquivo ZIP',
              'Envie para inspecoes@onasp.gov.br com o ZIP anexado',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span
                  className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: '#c9a227' }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
            <span>❓</span> Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'Os dados ficam salvos sem internet?',
                a: 'Sim. Tudo é salvo no dispositivo (IndexedDB). Você coleta offline e envia depois.',
              },
              {
                q: 'O que contém o arquivo ZIP?',
                a: 'Um arquivo inspecao.json com todos os dados estruturados e uma pasta fotos/ com as imagens registradas.',
              },
              {
                q: 'Como importar no Power BI?',
                a: 'Extraia o ZIP, abra o Power BI → Obter Dados → JSON → selecione o arquivo inspecao.json.',
              },
              {
                q: 'Como importar no Oracle APEX?',
                a: 'Use o APEX Data Workshop (SQL Workshop → Data Workshop → Load Data) para importar o arquivo JSON.',
              },
              {
                q: 'Posso usar sem instalar?',
                a: 'Sim, mas instalar permite uso offline completo e acesso rápido pela tela inicial.',
              },
            ].map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="text-sm font-semibold text-gray-800">{q}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
