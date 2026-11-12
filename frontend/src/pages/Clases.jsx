
import { useEffect, useState } from 'react';

export function Clases() {
    const [clases, setClases] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [misInscripciones, setMisInscripciones] = useState([]);

useEffect(() => {
    const cargarDatos = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Tenés que iniciar sesión.');
            }

            // Obtener todas las clases
            const respuestaClases = await fetch(
                'http://localhost:3000/clases'
            );

            if (!respuestaClases.ok) {
                throw new Error('No se pudieron obtener las clases.');
            }

            const datosClases = await respuestaClases.json();
            setClases(datosClases);

            // Obtener las inscripciones del usuario
            const respuestaInscripciones = await fetch(
                'http://localhost:3000/inscripciones',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!respuestaInscripciones.ok) {
                throw new Error('No se pudieron obtener tus inscripciones.');
            }

            const datosInscripciones = await respuestaInscripciones.json();

            // Guardamos los IDs de las clases en las que está inscripto
            setMisInscripciones(
                datosInscripciones.map(inscripcion => inscripcion.claseId)
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    cargarDatos();
}, []);

    
const manejarInscripcion = async (claseId) => {
    setError('');
    setMensaje('');
    setClaseSeleccionada(claseId);

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Tenés que iniciar sesión para inscribirte.');
        }

        const respuesta = await fetch('http://localhost:3000/inscripciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ claseId })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'No se pudo realizar la inscripción.');
        }

        // Actualizamos el mensaje
        setMensaje(datos.mensaje || '¡Inscripción realizada correctamente!');

        // Guardamos la clase en las inscripciones del usuario
        setMisInscripciones(prev => [...prev, claseId]);

        // Actualizamos los cupos disponibles
        setClases(prev =>
            prev.map(clase =>
                clase.id === claseId
                    ? {
                        ...clase,
                        cantidadInscriptos: clase.cantidadInscriptos + 1,
                        cuposDisponibles: Math.max(0, clase.cuposDisponibles - 1)
                    }
                    : clase
            )
        );

    } catch (err) {
        setError(err.message);
    } finally {
        setClaseSeleccionada(null);
    }
};


    return (
        <main className="catalogo">
            <style>{`
                .catalogo {
                    min-height: 85vh;
                    padding: 65px 7%;
                }

                .catalogo-header {
                    margin-bottom: 45px;
                }

                .catalogo-tag {
                    color: var(--color-electric-sprout);
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 4px;
                }

                .catalogo h1 {
                    font-size: clamp(42px, 7vw, 75px);
                    margin: 15px 0;
                }

                .catalogo-descripcion {
                    color: var(--color-pale-fern);
                    font-size: 16px;
                }

                .clases-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 25px;
                }

                .clase-card {
                    padding: 30px;
                    border: 1px solid rgba(183,189,165,0.2);
                    border-radius: var(--radius-cards);
                    background: var(--color-forest-depths);
                    transition: transform 0.2s, border-color 0.2s;
                }

                .clase-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--color-electric-sprout);
                }

                .clase-numero {
                    color: var(--color-electric-sprout);
                    font-size: 13px;
                    letter-spacing: 3px;
                }

                .clase-card h2 {
                    font-size: 30px;
                    margin: 25px 0;
                }

                .clase-info {
                    color: var(--color-pale-fern);
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .clase-cupo {
                    display: inline-block;
                    margin: 15px 0 25px;
                    padding: 8px 12px;
                    border-radius: 20px;
                    background: rgba(104,239,63,0.1);
                    color: var(--color-electric-sprout);
                    font-size: 13px;
                }

                .clase-card button {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    cursor: pointer;
                }

                .catalogo-mensaje {
                    margin-bottom: 25px;
                    color: var(--color-electric-sprout);
                }

                .catalogo-error {
                    margin-bottom: 25px;
                    color: #ff7777;
                }

                @media (max-width: 500px) {
                    .catalogo {
                        padding: 45px 6%;
                    }
                }
            `}</style>

            <header className="catalogo-header">
                <p className="catalogo-tag">IMPACT FITNESS CLUB</p>
                <h1 className="display-text">ENCONTRÁ TU CLASE.</h1>
                <p className="catalogo-descripcion">
                    Elegí tu actividad y empezá a entrenar.
                </p>
            </header>

            {mensaje && <p className="catalogo-mensaje">{mensaje}</p>}
            {error && <p className="catalogo-error">{error}</p>}

            {cargando ? (
                <p>Cargando clases...</p>
            ) : clases.length === 0 ? (
                <p>No hay clases disponibles.</p>
            ) : (
                <section className="clases-grid">
                    {clases.map((clase, index) => (
                        <article className="clase-card" key={clase.id}>
                            <p className="clase-numero">
                                ACTIVIDAD 0{index + 1}
                            </p>

                            <h2 className="display-text">{clase.nombre}</h2>

                            <p className="clase-info">
                                HORARIO: {clase.horario}
                            </p>

                            <span className="clase-cupo">
                                {clase.cuposDisponibles > 0
                                ? `${clase.cuposDisponibles} cupos disponibles de ${clase.cupoMaximo}`
                                : 'CLASE COMPLETA'}   
                            </span>

                            <button
                                className="btn-primary"
                                onClick={() => manejarInscripcion(clase.id)}
                                disabled=
                                    {claseSeleccionada !== null  ||
                                    misInscripciones.includes(clases.id) }
                            >
                                {claseSeleccionada === clase.id
                                    ? 'INSCRIBIENDO...'
                                    : misInscripciones.includes(clase.id)
                                    ? 'YA ESTÁS INSCRITO'
                                    : clase.cuposDisponibles <= 0
                                    ? 'CLASE COMPLETA'
                                    : 'INSCRIBIRME'}
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default Clases;
