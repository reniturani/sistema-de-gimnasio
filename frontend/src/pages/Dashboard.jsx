import { useState, useEffect } from 'react';

export function Dashboard() {
    const [misInscripciones, setMisInscripciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // obtener el token guardado por el login
    const token = localStorage.getItem('token');

    // visualizacion de las inscripciones del usuario
    const cargarInscripciones = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/inscripciones', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Enviamos el token al middleware
                }
            });

            if (!respuesta.ok) {
                throw new Error('Error al cargar tus inscripciones');
            }

            const data = await respuesta.json();
            setMisInscripciones(data); // data es el array que devuelve obtenerMisInscripciones()
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    // cancelacion de inscripciones
    const handleCancelarInscripcion = async (idInscripcion) => {
        // confirmacion antes de borrar
        if (!window.confirm('¿Seguro que querés cancelar tu inscripción a esta clase?')) {
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/inscripciones/${idInscripcion}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                // si el backend lo borro con exito, filtramos la lista en el frontend para no tener que recargar la pagina
                setMisInscripciones(misInscripciones.filter(inscripcion => inscripcion.id !== idInscripcion));
            } else {
                const data = await respuesta.json();
                alert(`No se pudo cancelar: ${data.mensaje}`);
            }
        } catch (err) {
            alert('Ocurrió un error al intentar cancelar la inscripción.');
        }
    };

    useEffect(() => {
        cargarInscripciones();
    }, []);

    if (cargando) {
        return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Cargando tus clases...</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
            
            {/* titulo Principal de la seccion */}
            <div style={{ marginBottom: '64px' }}>
                <h1 className="display-text" style={{ fontSize: '56px', marginBottom: '16px' }}>
                    Tus <span style={{ color: 'var(--color-electric-sprout)' }}>clases</span>
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--color-pale-fern)', maxWidth: '600px' }}>
                    Acá podés gestionar todas tus reservas activas. Recordá cancelar con anticipación si no vas a asistir.
                </p>
            </div>

            {error && (
                <div style={{ color: 'red', marginBottom: '24px' }}>{error}</div>
            )}

            {misInscripciones.length === 0 && !error ? (
                <div style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    padding: '40px', 
                    borderRadius: 'var(--radius-cards)',
                    textAlign: 'center',
                    color: 'var(--color-pale-fern)'
                }}>
                    No estás inscripto a ninguna clase todavía. ¡Andá al catálogo y sumate a una!
                </div>
            ) : (
                /* grilla de clases */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {misInscripciones.map((inscripcion) => (
                        <div key={inscripcion.id} style={{
                            backgroundColor: 'var(--color-bone-white)', 
                            color: 'var(--color-onyx-olive)',
                            borderRadius: 'var(--radius-cards)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <div>
                                {/* etiqueta de archivo */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <span style={{
                                        backgroundColor: 'var(--color-sprout-wash)',
                                        color: 'var(--color-moss-shadow)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}>
                                        Confirmada
                                    </span>
                                </div>
                                
                                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-forest-depths)' }}>
                                    {inscripcion.clase?.nombre || 'Clase sin nombre'}
                                </h3>
                                
                                <div style={{ marginBottom: '24px', color: 'var(--color-lichen-sage)', fontSize: '14px' }}>
                                    <p style={{ marginBottom: '4px' }}><strong>Día:</strong> {inscripcion.clase?.dia || 'Día no definido'}</p>
                                    <p><strong>Horario:</strong> {inscripcion.clase?.horario || 'Horario no definido'}</p>
                                </div>
                            </div>

                            {/* boton de cancelar */}
                            <button 
                                onClick={() => handleCancelarInscripcion(inscripcion.id)}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-forest-depths)',
                                    border: '1px solid var(--color-onyx-olive)',
                                    borderRadius: 'var(--radius-buttons)',
                                    padding: '8px 16px',
                                    fontFamily: 'var(--font-aeonik)',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    width: '100%',
                                    marginTop: 'auto'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Cancelar Inscripción
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;