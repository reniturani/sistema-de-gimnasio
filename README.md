
# IMPACT Fitness Club — Sistema de Gestión de Gimnasio

Aplicación web full-stack destinada a la gestión de clases, cupos, cuotas e inscripciones de un gimnasio. Permite que los socios se registren, inicien sesión, consulten el catálogo de actividades disponibles, calculen el valor de su cuota mensual según su plan y gestionen sus reservas a las clases.

Proyecto integrador desarrollado para la materia **Metodología de Sistemas II** — Tecnicatura Universitaria en Programación (2026).

---

## Integrantes

* Turani, Renata
* Gomez Surop, Maitena

---

## Objetivo

Facilitar la organización de las actividades del gimnasio y centralizar en una misma plataforma la consulta de horarios, el cálculo de aranceles con descuentos y la inscripción o baja de clases en tiempo real, aplicando buenas prácticas de diseño, validación, documentación y testing automatizado.

---

## Funcionalidades principales

### Usuarios (Socios)

* Registro de cuenta con validación de datos, normalización de entradas y cifrado de contraseña.
* Inicio de sesión mediante autenticación con tokens JWT.
* Consulta del catálogo de clases con horarios y cupos disponibles calculados dinámicamente.
* Inscripción a clases con control de duplicados y validación de capacidad máxima.
* Visualización de inscripciones activas y cancelación de reservas desde el panel personal.
* Cálculo interactivo de cuotas mensuales según frecuencia semanal y tipo de plan.

### Backend y Seguridad

* Exposición de una API REST modularizada por recursos (`auth`, `usuarios`, `clases`, `inscripciones`, `cuotas`).
* Protección de rutas privadas mediante middleware de verificación de token JWT (`verificarToken`).
* Aplicación extensible de descuentos mediante el patrón de diseño **Strategy**.

---

## Tecnologías y dependencias

### Backend

* **Node.js y Express.js:** Servidor HTTP y armado de la API REST.
* **jsonwebtoken (JWT):** Generación y validación de tokens de sesión.
* **bcryptjs:** Hasheo seguro de contraseñas antes de almacenarlas.
* **dotenv:** Carga de variables de entorno desde `.env`.
* **cors:** Habilitación de peticiones entre el servidor frontend y el backend.
* **Vitest:** Framework utilizado para las pruebas unitarias automatizadas.

### Frontend

* **React + Vite:** Construcción de la interfaz de usuario y entorno de desarrollo.
* **React Router DOM:** Navegación entre vistas públicas y protección de rutas privadas.
* **ESLint:** Herramienta de análisis estático para revisar sintaxis y calidad de código en JavaScript/React.
* **HTML5 y CSS3:** Maquetación responsiva y variables de diseño personalizadas.

### Herramientas de trabajo

* Git y GitHub para control de versiones y trabajo colaborativo por ramas por persona.
* Postman para pruebas de endpoints.

---

## Requisitos previos

Para ejecutar el proyecto de forma local se necesita tener instalado:

* **Node.js** (versión 18 o superior)
* **Git**
* Un navegador web

---

## Instalación

El repositorio está dividido en dos aplicaciones independientes (`backend` y `frontend`) que deben ejecutarse en paralelo en dos terminales.

### 1. Clonar el repositorio y abrirlo

En la terminal, con los comandos:

```bash
git clone https://github.com/reniturani/sistema-de-gimnasio.git
cd sistema-de-gimnasio
```

### 2. Configurar y levantar el Backend

1. Desde la terminal, entrar a la carpeta del servidor e instalar sus dependencias:

```bash
cd backend
npm install
```

2. Crear el archivo de variables de entorno (`.env`) dentro de la carpeta `backend/`, tomando como base el archivo `.env.example` que se encuentra en la raíz del proyecto.
3. Iniciar el servidor:

```bash
npm run dev
```

El backend quedará escuchando en `http://localhost:3000`.

### 3. Configurar y levantar el Frontend

1. En una segunda terminal, ubicarse en la carpeta `frontend` desde la raíz del proyecto e instalar las dependencias con los comandos:

```bash
cd frontend
npm install
```

2. Iniciar el servidor de desarrollo de Vite:

```bash
npm run dev
```

3. Abrir en el navegador la URL local que indica la terminal (generalmente `http://localhost:5173`).

---

## Scripts disponibles

Los procedimientos habituales de ejecución, verificación y pruebas están estandarizados en los `package.json` de cada carpeta para evitar comandos manuales distintos entre integrantes:

### En `backend/`

* **`npm start`:** Inicia el servidor en modo estándar (`node index.js`).
* **`npm run dev`:** Inicia el servidor con recarga automática ante cambios en el código (`node --watch index.js`).
* **`npm test`:** Ejecuta toda la suite de pruebas unitarias una vez con Vitest (`vitest run`).
* **`npm run test:watch`:** Mantiene Vitest activo escuchando cambios en los archivos (`vitest`).

### En `frontend/`

* **`npm run dev`:** Levanta el entorno de desarrollo de Vite.
* **`npm run build`:** Genera la versión optimizada para producción en la carpeta `dist/`.
* **`npm run preview`:** Previsualiza localmente el build de producción.
* **`npm run lint`:** Ejecuta ESLint para detectar errores de sintaxis, variables sin usar o problemas en componentes React.

---

## Estructura del repositorio

```text
sistema-de-gimnasio/
├── backend/
│   ├── controllers/               # Lógica de negocio y manejo de peticiones HTTP
│   │   ├── auth.controller.js
│   │   ├── clases.controller.js
│   │   ├── cuotas.controller.js
│   │   ├── inscripciones.controller.js
│   │   └── usuarios.controller.js
│   ├── data/                      # Almacenamiento en memoria durante la ejecución
│   │   ├── clases.js
│   │   ├── inscripciones.js
│   │   └── usuarios.js
│   ├── middlewares/               # Interceptores de validación y autenticación
│   │   └── auth.middleware.js
│   ├── routes/                    # Definición de endpoints de la API
│   │   ├── auth.routes.js
│   │   ├── clasesRoutes.js
│   │   ├── cuotas.routes.js
│   │   ├── inscripciones.routes.js
│   │   └── usuarios.routes.js
│   ├── strategies/                # Implementación del patrón Strategy para cuotas
│   │   └── planes.strategy.js
│   ├── tests/
│   │   └── unitarios/             # Suite de pruebas unitarias con Vitest
│   │       ├── auth.controller.test.js
│   │       ├── cuotas.controller.test.js
│   │       ├── inscripciones.controller.test.js
│   │       ├── planes.strategy.test.js
│   │       └── usuarios.controller.test.js
│   ├── .env                       # Variables de entorno locales (ignorado por Git)
│   ├── index.js                   # Punto de entrada del servidor Express
│   ├── package.json
│   └── package-lock.json
├── docs/
│   └── decisiones-diseno.md       # Registro detallado de decisiones técnicas
├── frontend/
│   ├── public/                    # Archivos estáticos e íconos
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                # Recursos gráficos
│   │   ├── components/
│   │   │   └── layout/            # Navegación y control de rutas privadas
│   │   │       ├── Navbar.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── pages/                 # Vistas principales de la aplicación
│   │   │   ├── Bienvenida.jsx
│   │   │   ├── CalculadoraCuotas.jsx
│   │   │   ├── Clases.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Registro.jsx
│   │   ├── App.jsx                # Configuración central de rutas
│   │   ├── main.jsx               # Punto de montaje de React
│   │   └── styles.css             # Estilos globales y tokens de diseño
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── .env.example                   # Plantilla de variables de entorno requeridas
├── .gitignore                     # Archivos y carpetas excluidos del control de versiones
└── README.md
```

---

## Decisiones de diseño y arquitectura

El registro ampliado de las decisiones tomadas durante el desarrollo se encuentra en `docs/decisiones-diseno.md`. A continuación se resumen las principales:

### 1. Patrón Strategy para el cálculo de cuotas (`backend/strategies/planes.strategy.js`)

* **Contexto:** El sistema calcula el valor mensual de la cuota combinando la frecuencia semanal elegida (`3_dias` o `todos_los_dias`) con distintos planes de beneficio (`estandar` sin descuento, `estudiante` con 10%, `jubilado` con 15% y `familiar` con 30%).
* **Alternativas evaluadas:** Resolver los descuentos mediante bloques condicionales (`if / else if` o `switch`) directamente dentro de `cuotas.controller.js`. Esta decisión iba a generar un alto acoplamiento sin respetar el principio "Open/Closed".
* **Decisión tomada:** Implementar el patrón **Strategy**. Cada tipo de plan encapsula su propia regla de cálculo mediante un método común `calcular(precioBase)`, y el controlador delega la operación a la estrategia correspondiente según el plan recibido.
* **Trade-offs:** Se agregan clases adicionales al proyecto, pero se respeta el principio **Open/Closed** (Abierto/Cerrado): si el gimnasio incorpora un plan nuevo (por ejemplo, Corporativo), se crea una estrategia nueva sin modificar la lógica existente del controlador.

### 2. Seguridad y control de acceso (`auth.controller.js` y `auth.middleware.js`)

* **Mensajes de error genéricos:** Ante credenciales inválidas (tanto si el email no existe como si la contraseña no coincide), el servidor responde siempre con estado `401` y el mismo mensaje (`"Email o contraseña incorrectos"`), evitando revelar qué correos están registrados.
* **Protección en dos capas:** En el backend el middleware `verificarToken` valida el encabezado `Authorization: Bearer <token>` antes de ejecutar acciones personales, mientras que en el frontend `ProtectedRoute.jsx` redirige al login si no existe un token válido almacenado.

### 3. Persistencia en memoria y limitaciones conocidas (`backend/data/`)

* **Decisión:** Para el alcance actual del proyecto integrador, los arreglos en `backend/data/` actúan como almacenamiento en memoria RAM mientras el servidor está activo.
* **Limitación asumida:** Al reiniciar el proceso de Node.js, los usuarios e inscripciones creados durante la sesión vuelven a su estado inicial (con las clases base de Yoga, CrossFit y Pilates precargadas).

---

## Revisión y mejoras de calidad de código

Durante la etapa de revisión del proyecto se aplicaron mejoras verificables directamente sobre el código fuente:

* **Desacoplamiento y mantenibilidad (`backend/strategies/planes.strategy.js` y `backend/controllers/cuotas.controller.js`):** Se extrajo la lógica de cálculo de descuentos fuera del controlador hacia estrategias independientes, reduciendo la complejidad ciclomática y facilitando la extensión de nuevos planes.
* **Endurecimiento de validaciones en el registro (`backend/controllers/usuarios.controller.js`):** Se incorporaron tres filtros previos al guardado: limpieza de espacios con `.trim()` y longitud mínima de caracteres en el nombre, validación de estructura de correo mediante expresión regular (Regex) y normalización a minúsculas, y exigencia de contraseña de al menos 6 caracteres cifrada con `bcryptjs`. Además, se asegura que la respuesta JSON nunca exponga el campo `password`.
* **Cálculo dinámico de disponibilidad (`backend/controllers/clases.controller.js`):** Se mejoró el listado de clases para cruzar en tiempo real las inscripciones activas y devolver `cantidadInscriptos` y `cuposDisponibles`, evitando que el frontend tenga que calcular reglas de negocio por su cuenta.
* **Revisión estática y modularización en React (`frontend/eslint.config.js` y `frontend/src/`):** Se configuró ESLint (`npm run lint`) para controlar hooks de React y variables no utilizadas, se separó la estructura visual en componentes reutilizables (`Navbar.jsx`, `ProtectedRoute.jsx`) y páginas (`pages/`), y se sincronizó el estado local al inscribirse o cancelar reservas en `Clases.jsx` y `Dashboard.jsx` para actualizar la interfaz sin recargar la página.
* **Gestión segura de configuración (`.env.example` y `.gitignore`):** Se excluyó `backend/.env` del control de versiones y se documentaron las variables requeridas en `.env.example` para que cualquier integrante pueda levantar el entorno sin exponer claves privadas.

---

## Documentación de la API

### Autenticación y Usuarios

* **`POST /usuarios`** — Registrar un nuevo usuario (Pública)
  * **Body (JSON):** `{ "nombre": "Renata", "email": "renata@email.com", "password": "password123" }`
  * **Respuestas:**
    * `201 Created`: Usuario creado (devuelve los datos sin el campo `password`).
    * `400 Bad Request`: Faltan campos obligatorios, nombre muy corto, email con formato inválido o contraseña menor a 6 caracteres.
    * `409 Conflict`: El correo electrónico ya se encuentra registrado.

* **`POST /auth/login`** — Iniciar sesión y obtener token (Pública)
  * **Body (JSON):** `{ "email": "renata@email.com", "password": "password123" }`
  * **Respuestas:**
    * `200 OK`: Autenticación exitosa; devuelve `{ "token": "<jwt>", "usuario": { ... } }`.
    * `400 Bad Request`: Falta el email o la contraseña.
    * `401 Unauthorized`: Credenciales incorrectas.

### Clases

* **`GET /clases`** — Listar todas las clases con sus cupos (Pública)
  * **Respuestas:**
    * `200 OK`: Devuelve un arreglo con las clases disponibles, incluyendo `cupoMaximo`, `cantidadInscriptos` y `cuposDisponibles`.

### Inscripciones

* **`GET /inscripciones`** — Obtener las inscripciones del usuario autenticado (Privada)
  * **Headers:** `Authorization: Bearer <token>`
  * **Respuestas:**
    * `200 OK`: Arreglo con las inscripciones del usuario y el detalle de cada clase asociada.
    * `401 Unauthorized`: Token ausente, inválido o expirado.

* **`POST /inscripciones`** — Inscribir al usuario autenticado en una clase (Privada)
  * **Headers:** `Authorization: Bearer <token>`
  * **Body (JSON):** `{ "claseId": 1 }`
  * **Respuestas:**
    * `201 Created`: Inscripción registrada correctamente.
    * `400 Bad Request`: El `claseId` no es un entero positivo válido.
    * `401 Unauthorized`: Token no válido o no enviado.
    * `404 Not Found`: El usuario o la clase solicitada no existen.
    * `409 Conflict`: El usuario ya está inscripto en esa clase o no quedan cupos disponibles.

* **`DELETE /inscripciones/:id`** — Cancelar una inscripción propia (Privada)
  * **Headers:** `Authorization: Bearer <token>`
  * **Parámetros de ruta:** `id` (ID de la inscripción a cancelar).
  * **Respuestas:**
    * `200 OK`: Inscripción eliminada correctamente.
    * `401 Unauthorized`: Token no válido o no enviado.
    * `403 Forbidden`: Se intenta cancelar una inscripción que pertenece a otro usuario.
    * `404 Not Found`: La inscripción indicada no existe.

### Calculadora de Cuotas

* **`POST /cuotas/calcular`** — Calcular el valor final de la cuota (Pública)
  * **Body (JSON):** `{ "frecuencia": "3_dias", "tipoPlan": "estudiante" }`
  * **Respuestas:**
    * `200 OK`: Devuelve el precio base, el porcentaje de descuento aplicado y el monto final a abonar.
    * `400 Bad Request`: Falta la frecuencia o el tipo de plan, o la frecuencia ingresada no es válida.

---

## Testing automatizado

El backend cuenta con una suite de **38 pruebas unitarias** implementadas con **Vitest** dentro de `backend/tests/unitarios/`. Dado que los datos se persisten en arreglos en memoria, cada archivo de pruebas limpia y prepara los arreglos (`usuarios`, `inscripciones`) antes de cada caso (`beforeEach`) para garantizar el aislamiento entre tests y evitar falsos positivos por estado residual.

### Cómo ejecutar e interpretar las pruebas

Desde la carpeta `backend/`, ejecutar:

```bash
npm test
```

Al finalizar, Vitest informa en consola la cantidad de archivos ejecutados (**5 archivos de prueba**), el total de casos verificados (**38 tests pasados**) y el tiempo de ejecución. Si alguna aserción falla, indica el archivo, el nombre del caso y la diferencia entre el valor esperado y el recibido.

### Selección y justificación de casos de prueba

Los casos fueron diseñados cubriendo tres categorías para validar tanto el flujo feliz como la robustez ante entradas inesperadas:

* **Casos normales (comportamiento esperado del negocio):**
  * Registro válido con respuesta `201 Created`, cifrado de contraseña y ocultamiento del hash en la respuesta (`usuarios.controller.test.js`).
  * Inicio de sesión con credenciales válidas devolviendo `200 OK` y token JWT (`auth.controller.test.js`).
  * Cálculo de descuentos exactos para `estandar` (0%), `estudiante` (10%), `jubilado` (15%) y `familiar` (30%) combinados con frecuencias válidas (`planes.strategy.test.js`, `cuotas.controller.test.js`).
  * Inscripción exitosa a una clase con cupo (`201`) y cancelación posterior por parte del titular (`200`) (`inscripciones.controller.test.js`).

* **Casos límite (normalización, bordes de capacidad y valores por defecto):**
  * Emails ingresados con mayúsculas o espacios alrededor (`" Renata@Email.com "`) normalizados antes de persistir (`usuarios.controller.test.js`).
  * Nombres de planes en mayúsculas (`"ESTUDIANTE"`) o planes desconocidos que recurren de forma segura al cálculo estándar sin romper la ejecución (`planes.strategy.test.js`, `cuotas.controller.test.js`).
  * Validación del cupo máximo al alcanzar el límite exacto de inscriptos en una clase (`inscripciones.controller.test.js`).

* **Casos de error (validaciones, conflictos y control de permisos):**
  * Datos faltantes o con formato inválido (nombre, email, contraseña, frecuencia o `claseId` no entero positivo) rechazados con `400 Bad Request`.
  * Credenciales incorrectas o usuario inexistente respondiendo `401 Unauthorized` con mensaje genérico, y bloqueo en `verificarToken` ante tokens ausentes o inválidos (`auth.controller.test.js`).
  * Intento de cancelar una inscripción perteneciente a otro usuario bloqueado con `403 Forbidden`, y recursos inexistentes con `404 Not Found` (`inscripciones.controller.test.js`).
  * Prevención de duplicados (emails repetidos o doble inscripción a la misma clase) y rechazo de clases sin cupo mediante `409 Conflict`.

### Distribución por archivo de pruebas (`backend/tests/unitarios/`)

* **`planes.strategy.test.js` (6 tests):** Estrategias de descuento por plan, manejo de mayúsculas y plan por defecto.
* **`usuarios.controller.test.js` (9 tests):** Alta de usuarios, duplicados, normalización de datos, cifrado y seguridad de la respuesta.
* **`cuotas.controller.test.js` (8 tests):** Combinaciones de frecuencias y planes, y manejo de parámetros faltantes o inválidos.
* **`inscripciones.controller.test.js` (8 tests):** Alta de inscripciones, control de cupos, duplicados, cancelaciones propias y bloqueo de cancelaciones ajenas.
* **`auth.controller.test.js` (7 tests):** Autenticación, mensajes genéricos de error y validación de tokens en el middleware.