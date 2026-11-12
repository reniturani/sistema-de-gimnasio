
import { Link } from 'react-router-dom';

export function Bienvenida() {
    return (
        <main className="home">

            <style>{`
                .home {
                    min-height: 85vh;
                    padding: 70px 7%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 40px;
                    overflow: hidden;
                }

                .home-content {
                    max-width: 650px;
                }

                .home-tag {
                    color: var(--color-electric-sprout);
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 4px;
                    margin-bottom: 30px;
                }

                .home h1 {
                    font-size: clamp(55px, 8vw, 105px);
                    line-height: 0.95;
                    margin-bottom: 30px;
                }

                .home h1 span {
                    display: block;
                    color: var(--color-electric-sprout);
                }

                .home-description {
                    color: var(--color-pale-fern);
                    font-size: 17px;
                    line-height: 1.7;
                    max-width: 470px;
                    margin-bottom: 35px;
                }

                .home-buttons {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .home-buttons a {
                    text-decoration: none;
                    padding: 14px 25px;
                    display: inline-block;
                }

                .home-decoration {
                    font-family: var(--font-ozik);
                    font-size: clamp(65px, 10vw, 130px);
                    font-weight: 800;
                    line-height: 0.85;
                    color: rgba(183, 189, 165, 0.08);
                    text-align: right;
                    user-select: none;
                }

                .home-decoration span {
                    display: block;
                }

                @media (max-width: 750px) {
                    .home {
                        padding: 55px 7%;
                    }

                    .home-decoration {
                        display: none;
                    }
                }
            `}</style>

            <section className="home-content">

                <p className="home-tag">
                    IMPACT FITNESS CLUB
                </p>

                <h1 className="display-text">
                    SUPERÁ TUS
                    <span>LÍMITES.</span>
                </h1>

                <p className="home-description">
                    Entrená, disfrutá y alcanzá tus objetivos.
                    Encontrá tu actividad ideal y formá parte
                    de nuestra comunidad.
                </p>

                <div className="home-buttons">

                    <Link to="/registro" className="btn-primary">
                        Crear mi cuenta
                    </Link>

                    <Link to="/clases" className="btn-outline">
                        Explorar clases
                    </Link>

                </div>

            </section>

            <div className="home-decoration">
                <span>MOVE</span>
                <span>BETTER.</span>
            </div>

        </main>
    );
}

export default Bienvenida;
