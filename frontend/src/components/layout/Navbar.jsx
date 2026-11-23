import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '24px 20px 0' }}>
            <nav style={{ 
                width: '100%',
                maxWidth: '1200px',
                height: '64px', 
                padding: '0 24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: 'rgba(48, 50, 42, 0.9)', /* Onyx Olive con opacidad */
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-nav)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}>
                {/* Logo IMPACT */}
                <div style={{ 
                    fontFamily: 'var(--font-ozik)', 
                    color: 'var(--color-pure-white)', 
                    fontSize: '28px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        IMPACT
                    </Link>
                </div>

                {/* Enlaces y Botones */}
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <Link to="/clases" style={{ color: 'var(--color-pure-white)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Clases</Link>
                    <Link to="/cuotas" style={{ color: 'var(--color-pure-white)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Cuotas</Link>
                    
                    {token ? (
                        <>
                            <Link to="/dashboard" style={{ color: 'var(--color-pure-white)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Mis Inscripciones</Link>
                            <button className="btn-outline" onClick={handleLogout}>Salir</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Ingresar</Link>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;