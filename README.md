# 💵 Microservicio de Retiros en Dólares (USD)

Este repositorio contiene la implementación del **Microservicio de Retiros USD** desarrollado para la asignatura de **Desarrollo de Aplicaciones en la Nube (Taller 2 - Microservicios)**.

---

## 🎯 1. Descripción del Servicio

El **Servicio de Retiros USD** es un microservicio backend construido con **NestJS** y **Arquitectura Hexagonal**, encargado de gestionar las solicitudes de desembolso de fondos en dólares hacia cuentas bancarias externas (ACH / SWIFT).

### ⚙️ Características Clave:
* **Arquitectura Hexagonal**: Separación estricta entre Dominio, Casos de Uso e Infraestructura (Puertos y Adaptadores).
* **Patrón Database per Service**: Base de datos **PostgreSQL 15** propia (`db_servicio_retiros_usd`) aislada físicamente.
* **Persistencia con TypeORM**: Generación nativa de UUIDs (`gen_random_uuid()`), tipos ENUM (`estado_retiro_enum`), restricciones CHECK de rango (`$1` a `$10,000` USD) e índices B-Tree (`idx_retiros_usuario_id`, `idx_retiros_estado`).
* **Integración HTTP con Billetera USD**: consulta de billetera y débito de saldo usando el OpenAPI del equipo de billetera.
* **Pruebas Unitarias con Jest**: Cobertura superior al 80% en todas las capas del microservicio.
* **Especificación OpenAPI 3.0**: Swagger UI (`/api/docs`) y el contrato compartible `retiros-usd-service/openapi_retiros.yaml` se generan desde la misma configuración y decoradores NestJS.

---

## 🏗️ 2. Arquitectura Interna del Servicio

```text
retiros-usd-service/src/
├── domain/                      # Capa de Dominio (Modelos, Value Objects, Puertos)
│   ├── enums/                   # EstadoRetiro ('PENDIENTE', 'COMPLETADO', etc.)
│   ├── models/                  # Entidad de Dominio Retiro (.spec.ts)
│   ├── value-objects/           # MontoUSD (.spec.ts)
│   └── ports/                   # Puertos de Entrada y Salida (Interfaces)
├── application/                 # Capa de Aplicación (Casos de Uso y DTOs)
│   ├── dtos/                    # CrearRetiroDto, RespuestaRetiroDto
│   └── use-cases/               # CrearRetiro, ConsultarRetiro (.spec.ts)
└── infrastructure/              # Capa de Infraestructura (Adaptadores, Controladores, Módulos)
    ├── controllers/             # RetiroHttpController, RetiroEventosController (.spec.ts)
    └── adapters/                # TypeORM Postgres, Billetera USD HTTP, Pasarela simulada (.spec.ts)
```

---

## 🔌 3. Endpoints HTTP REST

### 🌐 Endpoints REST (HTTP)

| Método | Ruta | Descripción | Estado de Respuesta |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/v1/retiros` | Registrar una nueva solicitud de retiro USD | `201 Created` |
| **GET** | `/api/v1/retiros/:id` | Consultar detalle de un retiro por ID (UUID) | `200 OK` |
| **GET** | `/api/v1/retiros?usuarioId=:usuarioId` | Listar el historial de retiros de un usuario | `200 OK` |
| **GET** | `/api/docs` | Documentación interactiva Swagger UI | `200 OK` |

### Flujo resumido con billetera USD

1. Retiros registra la solicitud y consulta por HTTP la billetera del usuario.
2. Si existe y es USD, solicita un débito usando el monto como cadena decimal.
3. Si el débito se confirma, registra sus identificadores y ejecuta la pasarela bancaria simulada.
4. Ante saldo insuficiente se devuelve `RECHAZADO`; si el resultado del débito es incierto queda `PENDIENTE` para revisión manual. Si la pasarela falla después de un débito confirmado queda `FALLIDO` y la devolución es manual.

El endpoint de billetera recibido no documenta idempotencia ni reversión. No repitas solicitudes con resultado incierto sin verificar con billetera; esta integración no es apta para dinero real. El identificador `usuarioId` debe coincidir con el `user_id` de billetera (alias o UUID). Configura la URL base mediante `BILLETERA_USD_URL`.

### Actualizar el contrato OpenAPI

Al modificar las rutas, DTO o documentación de NestJS, regenera el YAML desde `retiros-usd-service`:

```powershell
npm run generar:openapi
npm test -- --runInBand
```

Una prueba compara el YAML con el documento generado por Swagger. No edites el YAML manualmente. El servidor `/` usa el mismo origen desde el que se abre Swagger; quienes importen el archivo deben configurar la URL pública de retiros en su herramienta.

---

## 🧪 4. Pruebas Unitarias y Cobertura (+80%)

Para ejecutar la suite de pruebas unitarias con reporte de cobertura:

```bash
cd retiros-usd-service
npm run test:cov
```

---

## 🚀 5. Guía de Ejecución

### Opción A: Ejecución con Docker Compose (Recomendado)

Crea un archivo local `.env` en la raíz del repositorio y define `DB_PASSWORD` con la contraseña de PostgreSQL. Si ya tienes un volumen de PostgreSQL, usa la contraseña con la que se inicializó.

```bash
docker-compose up -d --build
```

### Opción B: Ejecución Local

Configura `DB_PASSWORD` en `retiros-usd-service/.env` con la contraseña de tu base de datos local.

```bash
cd retiros-usd-service
npm install
npm run start:dev
```

* **API REST Base**: `http://localhost:3004/api/v1/retiros`
* **Documentación Swagger UI**: [http://localhost:3004/api/docs](http://localhost:3004/api/docs)

## Billetera USD para el taller

Docker Compose usa por defecto `http://54.167.69.62` (sin `/acceso`), la dirección de prueba compartida por billetera; Kubernetes usa la misma dirección en su ConfigMap. Para elegir otra dirección en Compose, define `BILLETERA_USD_URL` antes de ejecutar `docker compose up -d`; la variable reemplaza el valor por defecto. Si ejecutas el backend directamente fuera de Compose debes definirla tú. Una variable vacía desactiva la integración y los retiros se registran como `FALLIDO` sin intentar un débito. Para pruebas locales puedes ejecutar `node simulador-billetera-usd-http.js` desde `retiros-usd-service` y configurar `BILLETERA_USD_URL=http://127.0.0.1:3005` cuando el backend corra localmente. Si el backend corre en Docker Desktop, usa `http://host.docker.internal:3005`; el simulador por defecto escucha solo en 127.0.0.1, por lo que esa modalidad necesita una configuración de red adecuada. El simulador HTTP es temporal y mantiene saldo ficticio en memoria.

Para probar el flujo nuevo desde la web, sigue la [guía de billetera USD HTTP](docs/testing/validacion-retiros/guia-web-simulador-billetera-usd-http.md).
