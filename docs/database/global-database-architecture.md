# 🛢️ Arquitectura Global de Bases de Datos del Sistema

Este documento describe la **Arquitectura Global de Bases de Datos** para la plataforma de Billetera Digital, basada en el patrón **Database per Service**.

---

## 🏗️ 1. Diagrama Entidad-Relación Global (Multi-Database System)

```mermaid
erDiagram
    %% BASE DE DATOS 1: db_usuarios (Servicio de Usuarios & KYC)
    USUARIOS {
        uuid id PK "Identificador de usuario"
        string email UK "Correo único"
        string password_hash "Contraseña cifrada"
        string nombre_completo "Nombre del titular"
        string estado_kyc "VERIFICADO | PENDIENTE"
        timestamp fecha_registro "Fecha de alta"
    }

    %% BASE DE DATOS 2: db_billetera (Servicio de Billetera & Saldos)
    CUENTAS_BILLETERA {
        uuid id PK "Identificador de billetera"
        uuid usuario_id "Propietario"
        decimal saldo_usd "Balance en Dólares"
        decimal saldo_pen "Balance en Soles"
        timestamp ultima_actualizacion
    }

    RESERVAS_FONDOS {
        uuid id PK "Reserva provisional"
        uuid billetera_id FK "Billetera origen"
        uuid id_referencia "UUID de la solicitud (retiros / ordenes)"
        decimal monto "Monto retenido"
        string moneda "USD | PEN"
        string estado "ACTIVA | LIBERADA | DEBITADA"
    }

    %% BASE DE DATOS 3: db_depositos (Servicio de Depósitos)
    DEPOSITOS {
        uuid id PK "Identificador de recarga"
        uuid usuario_id
        decimal monto_usd
        string metodo_pago "TARJETA | TRANSFERENCIA"
        string estado "PENDIENTE | COMPLETADO"
    }

    %% BASE DE DATOS 4: db_servicio_retiros_usd (Servicio de Retiros USD - IMPLEMENTADO)
    RETIROS {
        uuid id PK "Identificador de retiro"
        uuid usuario_id "Usuario solicitante (FK Lógica db_usuarios)"
        decimal monto_usd "Monto ($1 a $10,000 USD)"
        string moneda "USD"
        string codigo_banco "Código SWIFT / Banco"
        string cuenta_destino "Número de cuenta"
        string tipo_cuenta "AHORROS | CORRIENTE"
        string estado "PENDIENTE | COMPLETADO | FALLIDO | RECHAZADO"
        string referencia_bancaria "Código ACH"
        string razon_fallo "Motivo de rechazo"
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    %% BASE DE DATOS 5: db_cambio_divisas (Servicio de Cambio USD/PEN)
    ORDENES_CAMBIO {
        uuid id PK "Orden de cambio"
        uuid usuario_id
        decimal monto_origen
        decimal monto_destino
        decimal tasa_cambio "1 USD = 3.75 PEN"
        string estado
    }

    %% RELACIONES E INTERACCIONES ENTRE BASES DE DATOS (Database-per-Service)
    USUARIOS ||--|| CUENTAS_BILLETERA : "Posee Billetera (1:1)"
    CUENTAS_BILLETERA ||--o{ RESERVAS_FONDOS : "Gestiona Reservas"
    USUARIOS ||--o{ DEPOSITOS : "Solicita Depósitos"
    USUARIOS ||--o{ RETIROS : "1. Solicita Retiros (usuario_id)"
    CUENTAS_BILLETERA ||--o{ RETIROS : "2. Debita Saldo USD (usuario_id vía RabbitMQ)"
    RESERVAS_FONDOS ||--|| RETIROS : "3. Bloquea Fondos Provisionales (id_referencia vía RabbitMQ)"
    USUARIOS ||--o{ ORDENES_CAMBIO : "Ejecuta Cambio Divisas"
```

---

## 📋 2. Catálogo de Bases de Datos del Ecosistema

| Base de Datos | Servicio Propietario | Motor DB | Tablas / Entidades | Estado de Implementación |
| :--- | :--- | :--- | :--- | :---: |
| **`db_usuarios`** | Servicio Usuarios & KYC | PostgreSQL 15 | `usuarios`, `perfiles_kyc` | Especificación / Macro |
| **`db_billetera`** | Servicio Billetera & Saldos | PostgreSQL 15 | `cuentas_billetera`, `reservas_fondos` | Especificación / Macro |
| **`db_depositos`** | Servicio Depósitos | PostgreSQL 15 | `depositos` | Especificación / Macro |
| **`db_servicio_retiros_usd`** | **Servicio de Retiros USD** | **PostgreSQL 15** | **`retiros`** | **100% Activo (Taller 2)** |
| **`db_cambio_divisas`** | Servicio Cambio USD/PEN | PostgreSQL 15 | `ordenes_cambio` | Especificación / Macro |

---

## 🔒 3. Principios de Aislamiento y Persistencia

1. **Database per Service**: Ningún microservicio tiene acceso directo a las tablas de otro servicio ni realiza consultas `JOIN` entre bases de datos distintas.
2. **Comunicación Orientada a Eventos**: La sincronización de estados financieros entre servicios se efectúa mediante eventos en **RabbitMQ** (`withdrawal.requested`, `withdrawal.completed`, `withdrawal.failed`).
3. **Escalabilidad Independiente**: Cada base de datos se despliega en su propio contenedor/volumen Docker PostgreSQL 15.
