import logo from './logo.svg';
import './App.css';
import PainelPage from './pages/Painel/PainelPage';
import PedidoAvulso from './pages/PedidoAvulso/PedidoAvulso';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CriarPedido from './pages/CriarPedido/CriarPedido';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/painel" element={<PainelPage />} />
        <Route path="/pedidos/avulso" element={<PedidoAvulso />} />
        <Route path="/criarPedido" element={<CriarPedido />} />
        
      </Routes>
    </BrowserRouter>

  );
}

export default App;
