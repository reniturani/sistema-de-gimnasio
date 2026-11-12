import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CalculadoraCuotas } from './pages/CalculadoraCuotas';
import { Bienvenida } from './pages/Bienvenida';
import { Registro } from './pages/Registro';
import { Login } from './pages/Login';
import { Clases } from './pages/Clases';



// mis componentes pendientes (reni)
const Dashboard = () => <div style={{padding: '64px'}}>Mis Inscripciones y Cancelación (Tu tarea)</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Bienvenida />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/cuotas" element={<CalculadoraCuotas />} />

        {/* rutas privadas (requieren token) */}
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;