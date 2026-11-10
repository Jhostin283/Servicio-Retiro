# Guía de prueba: web y billetera USD simulada por HTTP

Esta guía prueba la integración actual sin conectarse a la billetera real. El simulador utiliza saldo ficticio en memoria y se reinicia al cerrarlo; la pasarela bancaria también es simulada.

## 1. Iniciar PostgreSQL

Con Docker Desktop activo, define `DB_PASSWORD` en el archivo local `.env` de la raíz. Luego, desde la raíz del proyecto:

```powershell
docker compose up -d postgres-servicio-retiros-usd
```

## 2. Iniciar la billetera simulada

En otra terminal PowerShell, desde la raíz:

```powershell
cd retiros-usd-service
node simulador-billetera-usd-http.js
```

La billetera simulada escucha en `http://127.0.0.1:3005` y crea un saldo ficticio inicial de USD 500 por usuario. Mantén abierta la terminal. Esta dirección es solo para pruebas locales y no es la dirección del servicio del otro equipo.

## 3. Iniciar el backend

En otra terminal PowerShell:

```powershell
cd retiros-usd-service
npm install
$env:DB_HOST = "127.0.0.1"
$env:BILLETERA_USD_URL = "http://127.0.0.1:3005"
npm run start:dev
```

Antes de iniciar el backend, configura `DB_PASSWORD` en `retiros-usd-service/.env` con la misma contraseña que usa PostgreSQL. Si el volumen ya tenía una contraseña, usa la existente. TypeORM está configurado con `synchronize: true` y puede modificar automáticamente el esquema al iniciar; usa una base de datos de prueba y conserva copias de los datos que necesites.

## 4. Iniciar la web de prueba local

Este paso requiere una copia local de `frontend/`. También puedes ejecutar los escenarios desde Swagger en `http://localhost:3004/api/docs` mediante `POST /api/v1/retiros` y consultar el resultado con `GET /api/v1/retiros`.

En otra terminal PowerShell:

```powershell
cd frontend
npm install
npx ng serve --host 127.0.0.1
```

Abre `http://localhost:4200`. Usa un usuario ficticio, por ejemplo `mariaperez`; ese mismo identificador se envía a billetera como `user_id`.

## 5. Probar escenarios

| Caso | Acción en la web | Resultado esperado |
| :--- | :--- | :--- |
| Débito y desembolso exitosos | Usuario `mariaperez`, monto `25.50`, cuenta `123456789`; pulsa **Solicitar retiro** y después **Actualizar**. | El simulador descuenta USD 25.50 del saldo ficticio y el historial muestra `COMPLETADO`. |
| Fondos insuficientes | Con un usuario nuevo, solicita USD 600, que supera el saldo inicial de prueba. | Billetera responde `422` y el historial muestra `RECHAZADO`. No se invoca la pasarela. |
| Fallo después del débito | Con un usuario nuevo, solicita USD 25 con cuenta `0000`. | El débito simulado se confirma, la pasarela simulada falla y el historial muestra `FALLIDO` con indicación de devolución manual. |
| Billetera no disponible | Detén el simulador y crea una solicitud. | El retiro muestra `FALLIDO` porque no se pudo consultar la billetera; no se realiza ningún débito. |

Para simular siempre fondos insuficientes, detén el simulador e inícialo con `$env:SIMULAR_RECHAZO="1"; node simulador-billetera-usd-http.js`. Para volver al modo normal, detenlo y ejecuta `Remove-Item Env:SIMULAR_RECHAZO` antes de iniciarlo de nuevo.

Una interrupción después de enviar el débito puede dejar el resultado incierto. En ese caso el retiro permanece `PENDIENTE` con un mensaje de revisión manual: **no lo repitas hasta consultar el movimiento en billetera**. La billetera real debe proporcionar mecanismos de idempotencia y reversión antes de usar dinero real.

## 6. Finalizar

Detén las terminales del simulador, backend y frontend con `Ctrl+C`. Si PostgreSQL solo se inició para la prueba, ejecuta desde la raíz:

```powershell
docker compose stop postgres-servicio-retiros-usd
```

El volumen conserva los retiros de prueba. Para conectarse al servicio real del otro equipo, reemplaza `BILLETERA_USD_URL` por la dirección base acordada y confirma que su `user_id` coincida con el identificador enviado en `usuarioId`.
