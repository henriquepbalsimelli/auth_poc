import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
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
import Authorization from './pages/Authentication/Authorization';
import Home from './pages/Home';

const AuthModes = {
  Authentication: 0,
  Authorization: 1
}


function App() {

  const authMode = AuthModes.Authorization
  const [user, setUser] = useState()
  const [params, setParams] = useState({})

  const contextObj = { 
    user, params,
    setUser, setParams
  }

  return (
    <AppContext.Provider value={contextObj}>
      { authMode === AuthModes.Authentication ? <Authentication /> : <Authorization /> }
      
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/pedidos/avulso" element={<PedidoAvulso />} />
          <Route path="/criarPedido" element={<CriarPedido />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App