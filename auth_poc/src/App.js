import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import AppContext from './AppContext';
import PainelPage from './pages/Painel/PainelPage';
import PedidoAvulso from './pages/PedidoAvulso/PedidoAvulso';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CriarPedido from './pages/CriarPedido/CriarPedido';
import Authentication from './pages/Authentication/Authentication';

function App() {

  const [user, setUser] = useState()

  return (
    <AppContext.Provider value={{user, setUser}}>
      <Authentication />
      <BrowserRouter>
        <Routes>
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/pedidos/avulso" element={<PedidoAvulso />} />
          <Route path="/criarPedido" element={<CriarPedido />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App