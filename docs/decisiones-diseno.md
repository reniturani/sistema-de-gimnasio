# Decisiones de diseño — Sistema de Gestión de Gimnasio

## 1. Código analizado

El análisis se centra en la organización del backend del sistema de gestion del gimnasio, desarrollado con Node.js y Express. En particular, se estudia la separación de responsabilidades entre rutas, controladores y middleware, así como el manejo de la autenticación y las inscripciones de usuarios a clases.

Los archivos son:

| Archivo | Responsabilidad |
| --- | --- |
| `backend/index.js` | Configura Express, registra las rutas y pone en funcionamiento el servidor. |
| `backend/routes/clasesRoutes.js` | Define la ruta para consultar las clases disponibles. |
| `backend/controllers/clases.controller.js` | Implementa la lógica para obtener las clases. |
| `backend/routes/usuarios.routes.js` | Define las rutas relacionadas con los usuarios y el acceso al perfil. |
| `backend/controllers/usuarios.controller.js` | Implementa el registro de usuarios y sus validaciones. |
| `backend/controllers/auth.controller.js` | Implementa el inicio de sesión y la generación del token JWT. |
| `backend/middlewares/auth.middleware.js` | Verifica la validez del token antes de permitir el acceso a rutas protegidas. |
| `backend/routes/inscripciones.routes.js` | Define las operaciones para crear y cancelar inscripciones, incorporando el middleware de autenticación. |
| `backend/controllers/inscripciones.controller.js` | Implementa las reglas de negocio relacionadas con las inscripciones. |
| `backend/data/usuarios.js` | Contiene los datos de usuarios almacenados temporalmente en memoria. |
| `backend/data/clases.js` | Contiene los datos de las clases disponibles. |
| `backend/data/inscripciones.js` | Contiene las inscripciones registradas temporalmente. |

Los datos se almacenan actualmente en arreglos de Javascript. Por lo tanto, el alcance de esta implementación es el de un prototipo funcional y no el de un sistema con persistencia permanente.

## 2. Diagnóstico

### 2.1. Separación de responsabilidades

En una primera organización del backend, era posible concentrar diferentes operaciones dentro de un mismo archivo. Sin embargo, a medida que se incorporaron el registro, el inicio de sesión, la verificación de tokens y las inscripciones, resultó conveniente distribuir las responsabilidades en módulos específicos.

La estructura actual diferencia rutas, controladores y middleware. Esta organización permite localizar más fácilmente la lógica correspondiente a cada operación y reduce la necesidad de modificar un único archivo cuando se incorpora una funcionalidad.

Desde el punto de vista teórico, esta decisión se relaciona con el principio de responsabilidad única (SRP, *Single Responsibility Principle*), perteneciente a SOLID. Aunque SRP se formula originalmente para clases y módulos de diseño, también resulta útil como criterio para organizar los módulos.

En este proyecto, `auth.controller.js` se ocupa del inicio de sesión, mientras que `usuarios.controller.js` se ocupa del registro. A su vez, `auth.middleware.js` verifica los tokens y no contiene la lógica de registro ni de inscripción.

### 2.2. Acoplamiento entre autenticación y operaciones del sistema

Las operaciones que requieren conocer la identidad del usuario dependen de la autenticación. Si cada controlador tuviera que verificar manualmente el encabezado HTTP y validar el token, se repetiría código y sería más difícil mantener un comportamiento uniforme.

Para evitarlo, se implementó el middleware `verificarToken`, que comprueba el token JWT y agrega la información a `req.usuario`.

Las rutas de inscripción usan este middleware antes de ejecutar los controladores. De esta manera, la verificación de identidad se realiza en un componente separado de la lógica de negocio.

Esta decisión se relaciona con la separación de responsabilidades ya que evita repetir la misma verificación en cada operación protegida.

### 2.3. Riesgo de confiar en datos enviados por el cliente

Tomamos una decisión relevante en `inscripciones.controller.js`, donde al crear una inscripción, el identificador del usuario se obtiene de `req.usuario.id`, en lugar de aceptar un `usuarioId` enviado por el cliente.

Esto evita que una persona pueda intentar crear una inscripción atribuyéndola a otro usuario mediante la modificación del cuerpo de la solicitud.

La misma idea se aplica a la cancelación: antes de eliminar una inscripción, el controlador verifica que el identificador del usuario autenticado coincida con el propietario de la inscripción.

Estas comprobaciones responden a una necesidad de integridad y autorización de los datos. No alcanza con comprobar que el usuario esté autenticado; también es necesario comprobar que tenga permiso para realizar la operación solicitada.

## 3. Alternativas consideradas

Para organizar el backend y resolver los problemas identificados consideramos las siguientes alternativas, junto con sus ventajas y desventajas:

### A) Mantener toda la lógica en un único archivo

Se podría mantener el registro, el inicio de sesión, la validación del token y las operaciones de inscripción dentro de un único archivo JavaScript.

**Ventajas:**

- Menor cantidad inicial de archivos.
- Configuración sencilla para un prototipo muy pequeño.

**Desventajas:**

- Mezcla responsabilidades diferentes.
- Dificulta localizar y probar cada operación.
- Favorece la duplicación de código.
- Hace más complejo ampliar el sistema.

### B) Separar rutas, controladores y middleware

Esta alternativa consiste en definir rutas que reciben las solicitudes, controladores que ejecutan la lógica de negocio y middleware que resuelven tareas transversales, como la autenticación.

**Ventajas:**

- Mejora la organización y la legibilidad.
- Facilita el mantenimiento y las pruebas por componente.
- Permite reutilizar el middleware en distintas rutas.
- Reduce la duplicación de la lógica de autenticación.

**Desventajas:**

- Requiere más archivos y una estructura inicial más elaborada.
- Es necesario mantener correctamente las importaciones y exportaciones.
- La ejecución de una operación involucra varios módulos, por lo que es necesario comprender cómo se conectan.

### C) Incorporar una arquitectura más compleja

Otra posibilidad sería agregar capas de servicios, repositorios, clases de dominio e interfaces para desacoplar todavía más la lógica de negocio del almacenamiento y del framework.

**Ventajas:**

- Facilitaría sustituir el mecanismo de almacenamiento.
- Permitiría aislar determinadas reglas de negocio.
- Podría resultar útil para un sistema de mayor tamaño o complejidad.

**Desventajas:**

- Aumentaría la cantidad de abstracciones y archivos.
- Requeriría más tiempo de implementación y aprendizaje.
- Podría introducir complejidad innecesaria para el alcance actual.

### D) Mantener los arreglos en memoria durante esta etapa

Se puede conservar el almacenamiento temporal mientras se desarrollan y prueban las operaciones principales.

**Ventajas:**

- Permite avanzar sin configurar una base de datos.
- Simplifica las pruebas iniciales.
- Facilita identificar errores en las rutas y en la lógica de negocio.

**Desventajas:**

- No conserva los datos entre reinicios.
- No ofrece persistencia ni mecanismos de integridad propios de una base de datos.
- Requiere reemplazar o adaptar el almacenamiento si el sistema evoluciona.

## 4. Decisión adoptada

Se decidió mantener una arquitectura modular basada en rutas, controladores y middleware, y conservar los arreglos en memoria durante la etapa actual del proyecto.

La decisión busca equilibrar claridad, mantenibilidad y tiempo de desarrollo, sin incorporar abstracciones que todavía no resultan necesarias.

### 4.1. Separación de rutas y controladores

Se mantienen archivos independientes para definir las rutas y ejecutar las operaciones.

Por ejemplo, `routes/inscripciones.routes.js` conecta las solicitudes HTTP con `inscripciones.controller.js`. De esta forma, la definición de los endpoints no queda mezclada con las validaciones de las inscripciones.

### 4.2. Separación del registro y el inicio de sesión

Decidimos implementar `registrarUsuario` en `usuarios.controller.js` y `iniciarSesion` en `auth.controller.js`.

Esta separación evita concentrar en un mismo módulo las dos operaciones de acceso. El registro valida los campos, verifica que el email no esté registrado y almacena la contraseña mediante un hash generado con `bcryptjs`. El inicio de sesión compara la contraseña ingresada con el hash almacenado y genera un token JWT cuando las credenciales son válidas.

### 4.3. Uso de middleware para la autenticación

Decidimos centralizar la verificación del token en `auth.middleware.js`.

El middleware comprueba el encabezado `Authorization`, valida el token mediante `jwt.verify()` y agrega la información decodificada a `req.usuario`. Si el token falta, es inválido o está vencido, la solicitud se rechaza.

Las rutas de inscripción ejecutan este middleware antes de los controladores. Esto permite reutilizar la autenticación y mantener separadas la identificación del usuario y las reglas de negocio.

### 4.4. Validación de permisos en las inscripciones

Optamos por obtener el identificador del usuario desde `req.usuario.id` al crear una inscripción. Para cancelar, se comprueba que la inscripción pertenezca al usuario autenticado.

Esta decisión evita confiar en un identificador enviado libremente por el cliente y permite diferenciar entre una operación no autorizada y una inscripción inexistente.

### 4.5. Conservación temporal del almacenamiento en memoria

Por último, optamos por mantener los arreglos de `backend/data/` durante esta etapa para concentrar el esfuerzo en el funcionamiento del backend y sus reglas principales.

Esta decisión es deliberada y limitada al alcance actual: no se considera que los arreglos sean una solución adecuada para conservar los datos de una aplicación en producción. Si el proyecto requiere persistencia, se deberá incorporar una base de datos y revisar cómo se generan los identificadores y se mantienen las relaciones entre usuarios, clases e inscripciones.

## 5. Evidencia y trade-offs

### 5.1. Evidencias en el código

Las siguientes referencias permiten relacionar las decisiones con la implementación.

**Configuración de rutas — `backend/index.js`**

El archivo importa los módulos de rutas y los registra en Express mediante prefijos como `/clases`, `/usuarios`, `/inscripciones` y `/auth`. Esto evidencia la separación entre la configuración del servidor y la implementación de cada operación.

**Registro de usuarios — `backend/controllers/usuarios.controller.js`**

La función `registrarUsuario` valida los campos obligatorios, comprueba si el email ya existe, genera un hash de la contraseña con `bcrypt.hash()` y devuelve los datos públicos del usuario sin incluir su contraseña.

El tratamiento del email mediante `trim()` y `toLowerCase()` busca unificar su representación para evitar diferencias causadas por espacios o mayúsculas.

**Inicio de sesión — `backend/controllers/auth.controller.js`**

La función `iniciarSesion` busca al usuario por email, verifica la contraseña mediante `bcrypt.compare()` y genera el token con `jwt.sign()`, configurando una duración de dos horas.

**Middleware — `backend/middlewares/auth.middleware.js`**

La función `verificarToken` comprueba el encabezado de autorización, valida el JWT y guarda los datos decodificados en `req.usuario`. Esta implementación evita repetir la verificación en cada controlador protegido.

**Inscripciones — `backend/routes/inscripciones.routes.js`**

Las operaciones `POST /inscripciones` y `DELETE /inscripciones/:id` se conectan con sus controladores mediante el middleware `verificarToken`.

**Reglas de negocio — `backend/controllers/inscripciones.controller.js`**

La función `inscribirse` verifica la existencia del usuario y de la clase, evita inscripciones duplicadas y comprueba la disponibilidad de cupos. La función `cancelarInscripcion` comprueba que la inscripción exista y que pertenezca al usuario autenticado antes de eliminarla.

Estas referencias deben cotejarse con la versión final del repositorio antes de presentar el documento, especialmente si se modifican los nombres de los archivos o las funciones.

### 5.2. Beneficios obtenidos

La organización elegida ofrece los siguientes beneficios:

- **Mayor legibilidad:** cada módulo tiene una responsabilidad identificable.
- **Menor duplicación:** la validación del token se realiza en un middleware reutilizable.
- **Mantenimiento más sencillo:** los cambios en el registro, el inicio de sesión y las inscripciones se localizan en archivos específicos.
- **Mejor control de acceso:** las operaciones de inscripción utilizan la identidad autenticada y verifican la pertenencia antes de cancelar.
- **Facilidad de prueba:** las operaciones pueden verificarse de manera individual mediante Postman.
- **Complejidad acorde al alcance:** se evita introducir capas adicionales antes de que exista una necesidad concreta.

### 5.3. Costos y limitaciones

La decisión también introduce costos y limitaciones que deben reconocerse.

En primer lugar, la separación modular exige mantener correctamente las rutas, las importaciones y las exportaciones. Un nombre de archivo incorrecto puede impedir que el servidor arranque.

En segundo lugar, los arreglos en memoria no garantizan persistencia. Los usuarios, las clases y las inscripciones desaparecen al reiniciar el servidor, y la generación de identificadores basada en la longitud de los arreglos puede producir duplicados después de eliminar elementos.

Además, la autenticación mediante JWT requiere mantener protegida la clave `JWT_SECRET`. El uso de tokens no reemplaza las comprobaciones de autorización ni resuelve por sí mismo todos los problemas de seguridad de una aplicación.

Finalmente, la arquitectura actual no incorpora una capa de servicios ni un repositorio independiente. Para el alcance actual, esa decisión reduce la complejidad; si el sistema crece, podría ser conveniente introducir esas capas para aislar la lógica de negocio y facilitar el reemplazo del almacenamiento.

### 5.4. Relación con los conceptos que vimos en la teoria:

| Concepto | Aplicación en el proyecto |
| --- | --- |
| Clean Code | Nombres descriptivos y distribución del código en módulos con funciones identificables. |
| SRP — Responsabilidad única | Separación del registro, el inicio de sesión, la verificación del token y las operaciones de inscripción. |
| DRY — Don't Repeat Yourself | Reutilización del middleware de autenticación en las rutas protegidas. |
| Code smells | La concentración de responsabilidades y la duplicación de verificaciones serían problemas a evitar; la estructura actual busca reducir esos riesgos. |
| Refactorización | Se reorganizó la autenticación en un controlador específico y se centralizó la verificación del JWT, manteniendo el comportamiento funcional esperado. |
| Trade-offs | Se prioriza una arquitectura sencilla y fácil de probar, aceptando temporalmente la pérdida de datos al reiniciar el servidor. |

## Conclusión

La organización actual del backend representa una decisión de diseño orientada a separar responsabilidades, reducir la duplicación de código y controlar el acceso a las operaciones que requieren autenticación.

La separación entre rutas, controladores y middleware permite comprender mejor el flujo de las solicitudes y facilita las pruebas funcionales. A su vez, el uso de datos en memoria constituye una simplificación consciente para el desarrollo inicial, aunque no resulta suficiente para un sistema que necesite conservar información.

Por lo tanto, la decisión adoptada se considera adecuada para el alcance actual del proyecto. Su evolución deberá contemplar persistencia mediante una base de datos, una estrategia de identificadores estable y las mejoras de arquitectura que se justifiquen a partir de nuevas necesidades.