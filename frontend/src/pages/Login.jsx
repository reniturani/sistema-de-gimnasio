
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setCargando(true);

            const respuesta = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formulario)
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'Email o contraseña incorrectos.');
            }

            // Guardamos el token y los datos del usuario
            localStorage.setItem('token', datos.token);
            localStorage.setItem('usuario', JSON.stringify(datos.usuario));

            // Redirigimos al catálogo de clases
            navigate('/clases');

        } catch (err) {
            setError(err.message || 'No se pudo conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="login">
            <style>{`
                .login {
                    min-height: 85vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 20px;
                }

                .login-card {
                    width: 100%;
                    max-width: 480px;
                    padding: 45px;
                    background: var(--color-forest-depths);
                    border: 1px solid rgba(183,189,165,0.2);
                    border-radius: var(--radius-cards);
                }

                .login-tag {
                    color: var(--color-electric-sprout);
                    letter-spacing: 3px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .login h1 {
                    font-size: 42px;
                    margin: 15px 0 10px;
                }

                .login-descripcion {
                    color: var(--color-pale-fern);
                    margin-bottom: 30px;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .login-form label {
                    font-size: 13px;
                    color: var(--color-pale-fern);
                }

                .login-form input {
                    width: 100%;
                    margin-top: 7px;
                    padding: 13px;
                    border: 1px solid rgba(183,189,165,0.3);
                    border-radius: 10px;
                    background: var(--color-onyx-olive);
                    color: white;
                    outline: none;
                }

                .login-form input:focus {
                    border-color: var(--color-electric-sprout);
                }

                .login-form button {
                    margin-top: 10px;
                    padding: 15px;
                    border: none;
                    cursor: pointer;
                }

                .login-error {
                    color: #ff7777;
                    font-size: 14px;
                }

                .login-registro {
                    margin-top: 25px;
                    text-align: center;
                    color: var(--color-pale-fern);
                    font-size: 14px;
                }

                .login-registro a {
                    color: var(--color-electric-sprout);
                    text-decoration: none;
                }

                @media (max-width: 500px) {
                    .login-card {
                        padding: 28px 22px;
                    }
                }
            `}</style>

            <section className="login-card">
                <p className="login-tag">IMPACT FITNESS CLUB</p>

                <h1 className="display-text">BIENVENIDA DE NUEVO.</h1>

                <p className="login-descripcion">
                    Ingresá a tu cuenta y seguí superando tus límites.
                </p>

                <form className="login-form" onSubmit={manejarLogin}>
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
                            placeholder="Tu contraseña"
                            required
                        />
                    </label>

                    {error && (
                        <p className="login-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={cargando}
                    >
                        {cargando ? 'INGRESANDO...' : 'INGRESAR'}
                    </button>
                </form>

                <p className="login-registro">
                    ¿Todavía no tenés cuenta?{' '}
                    <Link to="/registro">Registrate</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;
