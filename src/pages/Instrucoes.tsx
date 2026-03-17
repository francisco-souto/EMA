import Layout from '../components/Layout'

export default function Instrucoes() {
  return (
    <Layout title="Como Usar o App" showBack>
      <div className="p-4 space-y-5 pb-10">
        {/* Offline banner */}
        <div className="card-corp p-4" style={{ borderLeftWidth: 3, borderLeftColor: '#2563eb' }}>
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>Este aplicativo funciona 100% offline.</strong> Após instalar, você pode
            coletar dados de inspeções sem conexão. Os relatórios são gerados e compartilhados
            quando houver rede disponível.
          </p>
        </div>

        {/* Android */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            </div>
            <h2 className="font-bold text-gray-900 text-[0.9375rem]">Instalar no Android (Chrome)</h2>
          </div>
          <div className="card-corp p-4">
            <ol className="space-y-3">
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
                    style={{ background: 'linear-gradient(135deg, #122d52, #1e4a8a)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* iOS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            </div>
            <h2 className="font-bold text-gray-900 text-[0.9375rem]">Instalar no iPhone / iPad (Safari)</h2>
          </div>
          <div className="card-corp p-4">
            <ol className="space-y-3">
              {[
                'Abra o link no Safari (não funciona no Chrome do iPhone)',
                'Toque no ícone de Compartilhar □↑ na barra inferior',
                'Role a lista e toque em "Adicionar à Tela de Início"',
                'Confirme o nome e toque em Adicionar',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #122d52, #1e4a8a)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Send report */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#c9a227" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            </div>
            <h2 className="font-bold text-gray-900 text-[0.9375rem]">Como enviar o relatório</h2>
          </div>
          <div className="card-corp p-4">
            <ol className="space-y-3">
              {[
                'Finalize a inspeção adicionando todas as constatações',
                'Na tela de Revisão, toque em "Gerar ZIP e Compartilhar"',
                'Escolha E-mail no compartilhamento — ou baixe o arquivo ZIP',
                'Envie para inspecoes@onasp.gov.br com o ZIP anexado',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #a07f18, #c9a227)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
            </div>
            <h2 className="font-bold text-gray-900 text-[0.9375rem]">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-2">
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
              <div key={i} className="card-corp p-3.5">
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
