import { useState, useEffect } from 'react';

export function CalculadoraCuotas() {
    const [frecuencia, setFrecuencia] = useState('3_dias');
    const [tipoPlan, setTipoPlan] = useState('estandar');
    const [resultado, setResultado] = useState(null);

    const consultarCuota = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/cuotas/calcular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frecuencia, tipoPlan })
            });
            const data = await respuesta.json();
            if (respuesta.ok) {
                setResultado(data);
            }
        } catch (error) {
            console.error("Error al consultar la cuota:", error);
        }
    };

    useEffect(() => {
        consultarCuota();
    }, [frecuencia, tipoPlan]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
            {/* Título Principal */}
            <div style={{ marginBottom: '64px' }}>
                <h1 className="display-text" style={{ fontSize: '56px', marginBottom: '16px' }}>
                    Elegí tu <span style={{ color: 'var(--color-electric-sprout)' }}>plan</span> ideal
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--color-pale-fern)', maxWidth: '600px' }}>
                    Seleccioná la frecuencia de entrenamiento y tu categoría para ver los descuentos aplicados automáticamente.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                
                {/* Columna Izquierda: Controles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-pure-white)' }}>
                            Frecuencia de entrenamiento
                        </label>
                        <select 
                            value={frecuencia} 
                            onChange={(e) => setFrecuencia(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '24px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--color-moss-shadow)',
                                color: 'var(--color-pure-white)',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        >
                            <option value="3_dias" style={{ color: 'black' }}>3 días a la semana</option>
                            <option value="todos_los_dias" style={{ color: 'black' }}>Todos los días</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-pure-white)' }}>
                            Tipo de membresía
                        </label>
                        <select 
                            value={tipoPlan} 
                            onChange={(e) => setTipoPlan(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '24px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--color-moss-shadow)',
                                color: 'var(--color-pure-white)',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        >
                            <option value="estandar" style={{ color: 'black' }}>Plan Estándar (Sin descuento)</option>
                            <option value="estudiante" style={{ color: 'black' }}>Plan Estudiante (10% OFF)</option>
                            <option value="familiar" style={{ color: 'black' }}>Plan Familiar (30% OFF)</option>
                            <option value="jubilado" style={{ color: 'black' }}>Plan Jubilado (15% OFF)</option>
                        </select>
                    </div>
                </div>


                {resultado && (
                    <div style={{
                        backgroundColor: 'var(--color-bone-white)',
                        borderRadius: 'var(--radius-cards)',
                        padding: '40px',
                        color: 'var(--color-onyx-olive)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.15)'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700' }}>Resumen de Cuota</h3>
                                {/* Etiqueta tipo "Badge" */}
                                <span style={{
                                    backgroundColor: 'var(--color-sprout-wash)',
                                    color: 'var(--color-moss-shadow)',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                }}>
                                    {tipoPlan}
                                </span>
                            </div>

                            <div style={{ borderBottom: '1px solid var(--color-mist-green)', paddingBottom: '16px', marginBottom: '16px' }}>
                                <p style={{ fontSize: '14px', color: 'var(--color-lichen-sage)', marginBottom: '8px' }}>Precio Base ({resultado.frecuenciaSeleccionada.replace('_', ' ')})</p>
                                <p style={{ fontSize: '18px', fontWeight: '500', textDecoration: 'line-through' }}>
                                    ${resultado.precioBase.toLocaleString('es-AR')}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--color-lichen-sage)', marginBottom: '8px' }}>Tu precio mensual</p>
                            <p className="display-text" style={{ 
                                fontSize: '56px', 
                                color: 'var(--color-deep-verdant)',
                                fontFamily: 'var(--font-ozik)'
                            }}>
                                ${resultado.precioFinal.toLocaleString('es-AR')}
                            </p>
                            
                            <button className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '16px' }}>
                                Inscribirme ahora
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default CalculadoraCuotas;