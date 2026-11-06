import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    // por ahora validamos leyendo el token de localstorage 
    // mai dsp vas a tener q adaptar esto cuando manejes el JWT en tu tarea
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // si hay token, renderiza la ruta protegida que el usuario solicito
    return <Outlet />;
}
export default ProtectedRoute;