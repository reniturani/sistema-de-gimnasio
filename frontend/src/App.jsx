import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// componentes temporales
const Home = () => <div style={{padding: '64px'}}><h1 className="display-text">Bienvenido al Club</h1></div>;
const Login = () => <div style={{padding: '64px'}}>Pantalla de Login (Tarea de tu amiga)</div>;
const Registro = () => <div style={{padding: '64px'}}>Pantalla de Registro (Tarea de tu amiga)</div>;
const Clases = () => <div style={{padding: '64px'}}>Catálogo de Clases (Tarea de tu amiga)</div>;

// mis componentes pendientes (reni)
const Dashboard = () => <div style={{padding: '64px'}}>Mis Inscripciones y Cancelación (Tu tarea)</div>;
const CalculadoraCuotas = () => <div style={{padding: '64px'}}>Calculadora de Cuotas (Tu tarea)</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
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