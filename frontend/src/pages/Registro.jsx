
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Registro() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: ''
    });

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarRegistro = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (formulario.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (formulario.password !== formulario.confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            setCargando(true);

            const respuesta = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: formulario.nombre,
                    email: formulario.email,
                    password: formulario.password
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo completar el registro.');
            }

            setMensaje('¡Registro completado correctamente!');

            setTimeout(() => navigate('/login'), 1500);

        } catch (err) {
            setError(err.message || 'No se pudo conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="registro">
            <style>{`
                .registro {
                    min-height: 85vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 20px;
                }

                .registro-card {
                    width: 100%;
                    max-width: 480px;
                    padding: 45px;
                    background: var(--color-forest-depths);
                    border: 1px solid rgba(183,189,165,0.2);
                    border-radius: var(--radius-cards);
                }

                .registro-tag {
                    color: var(--color-electric-sprout);
                    letter-spacing: 3px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .registro h1 {
                    font-size: 42px;
                    margin: 15px 0 10px;
                }

                .registro-descripcion {
                    color: var(--color-pale-fern);
                    margin-bottom: 30px;
                }

                .registro-form {
                    display: flex;
                    flex-direction: column;
                    gap: 17px;
                }

                .registro-form label {
                    font-size: 13px;
                    color: var(--color-pale-fern);
                }

                .registro-form input {
                    width: 100%;
                    margin-top: 7px;
                    padding: 13px;
                    border: 1px solid rgba(183,189,165,0.3);
                    border-radius: 10px;
                    background: var(--color-onyx-olive);
                    color: white;
                    outline: none;
                }

                .registro-form input:focus {
                    border-color: var(--color-electric-sprout);
                }

                .registro-form button {
                    margin-top: 10px;
                    padding: 15px;
                    border: none;
                    cursor: pointer;
                }

                .registro-error {
                    color: #ff7777;
                    font-size: 14px;
                }

                .registro-exito {
                    color: var(--color-electric-sprout);
                    font-size: 14px;
                }

                .registro-login {
                    margin-top: 25px;
                    text-align: center;
                    color: var(--color-pale-fern);
                    font-size: 14px;
                }

                .registro-login a {
                    color: var(--color-electric-sprout);
                    text-decoration: none;
                }

                @media (max-width: 500px) {
                    .registro-card {
                        padding: 28px 22px;
                    }
                }
            `}</style>

            <section className="registro-card">
                <p className="registro-tag">IMPACT FITNESS CLUB</p>
                <h1 className="display-text">CREÁ TU CUENTA.</h1>
                <p className="registro-descripcion">
                    Unite a nuestra comunidad y empezá a entrenar.
                </p>

                <form className="registro-form" onSubmit={manejarRegistro}>
                    <label>
                        Nombre
                        <input
                            type="text"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            placeholder="Tu nombre"
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formulario.email}
                            onChange={manejarCambio}
                            placeholder="tu@email.com"
                            required
                        />
                    </label>

                    <label>
                        Contraseña
                        <input
                            type="password"
                            name="password"
                            value={formulario.password}
                            onChange={manejarCambio}
                            placeholder="Mínimo 8 caracteres"
                            minLength={8}
                            required
                        />
                    </label>

                    <label>
                        Confirmar contraseña
                        <input
                            type="password"
                            name="confirmarPassword"
                            value={formulario.confirmarPassword}
                            onChange={manejarCambio}
                            placeholder="Repetí tu contraseña"
                            required
                        />
                    </label>

                    {error && <p className="registro-error">{error}</p>}
                    {mensaje && <p className="registro-exito">{mensaje}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={cargando}
                    >
                        {cargando ? 'Creando cuenta...' : 'CREAR CUENTA'}
                    </button>
                </form>

                <p className="registro-login">
                    ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
                </p>
            </section>
        </main>
    );
}

export default Registro;
