import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NovaInspecao from './pages/NovaInspecao'
import Constatacoes from './pages/Constatacoes'
import NovaConstatacao from './pages/NovaConstatacao'
import RevisaoInspecao from './pages/RevisaoInspecao'
import Instrucoes from './pages/Instrucoes'
import InstallPrompt from './components/InstallPrompt'

export default function App() {
  return (
    <>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nova-inspecao" element={<NovaInspecao />} />
        <Route path="/inspecao/:id/constatacoes" element={<Constatacoes />} />
        <Route path="/inspecao/:id/constatacao/nova" element={<NovaConstatacao />} />
        <Route path="/inspecao/:id/revisao" element={<RevisaoInspecao />} />
        <Route path="/instrucoes" element={<Instrucoes />} />
      </Routes>
    </>
  )
}
