# 🌐 Arquitectura Global del Sistema de Billetera Digital

Este documento presenta la **Arquitectura Global de Microservicios** para la Plataforma de Billetera Digital en Dólares (USD) y Soles (PEN), detallando la topología completa del sistema, los dominios de cada servicio, la orquestación distribuida y la comunicación orientada a eventos.

---

## 🏗️ 1. Diagrama de Arquitectura Global de Microservicios

```mermaid
flowchart TD
    Client["📱 Cliente Web Angular 17 / App Móvil"] -->|HTTP / REST| Gateway["🌐 API Gateway (Puerto 3000)"]
    
    subgraph Ecosistema_Microservicios["Ecosistema de Microservicios"]
        Gateway -->|/api/v1/usuarios| Users["👤 Servicio de Usuarios & KYC (3001)"]
        Gateway -->|/api/v1/billetera| Wallet["💼 Servicio de Billetera & Saldos (3002)"]
        Gateway -->|/api/v1/depositos| Deposits["📥 Servicio de Depósitos (3003)"]
        Gateway -->|/api/v1/retiros| RetirosUSD["📤 Servicio de Retiros USD (3004) ★"]
        Gateway -->|/api/v1/cambio| FX["🔱 Servicio de Cambio USD/PEN (3005)"]
        Gateway -->|/api/v1/notificaciones| Notif["🔔 Servicio de Notificaciones (3006)"]
    end

    subgraph Bases_de_Datos["Bases de Datos Dedicadas (Database per Service)"]
        Users ---> DB_Users[("🛢️ db_usuarios")]
        Wallet ---> DB_Wallet[("🛢️ db_billetera")]
        Deposits ---> DB_Deposits[("🛢️ db_depositos")]
        RetirosUSD ---> DB_Retiros[("🛢️ db_servicio_retiros_usd")]
        FX ---> DB_FX[("🛢️ db_cambio_divisas")]
    end

    subgraph Broker_Eventos["Broker de Mensajería Distribuida (RabbitMQ)"]
        Users -.->|user.created| RabbitMQ["📩 RabbitMQ Broker (Puertos 5672 / 15672)"]
        Deposits -.->|deposit.completed| RabbitMQ
        RetirosUSD -.->|withdrawal.requested| RabbitMQ
        FX -.->|fx.exchanged| RabbitMQ
        RabbitMQ -.->|withdrawal.funds_reserved| RetirosUSD
        RabbitMQ -.->|Escucha eventos de saldo| Wallet
        RabbitMQ -.->|Escucha alertas| Notif
    end

    classDef implemented fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    class RetirosUSD,DB_Retiros implemented;
```

---

## 📋 2. Catálogo de Microservicios del Ecosistema

| Microservicio | Puerto | Responsabilidades Principales | Base de Datos | Estado de Implementación |
| :--- | :---: | :--- | :--- | :---: |
| **👤 Usuarios & KYC** | `3001` | Autenticación JWT, registro de clientes, verificación KYC nivel 1-3. | PostgreSQL `db_usuarios` | Próximamente (Sprint Futuro) |
| **💼 Billetera & Saldos** | `3002` | Gestión de cuentas contables, saldos multi-moneda (USD/PEN), reservas temporales de fondos. | PostgreSQL `db_billetera` | Próximamente (Sprint Futuro) |
| **📥 Depósitos** | `3003` | Recargas de dinero en dólares vía tarjeta de crédito/débito o transferencia bancaria. | PostgreSQL `db_depositos` | Próximamente (Sprint Futuro) |
| **📤 Retiros USD** | `3004` | **Gestión integral de retiros en Dólares (USD), conversión de desembolso PEN y procesamiento bancario ACH.** | PostgreSQL `db_servicio_retiros_usd` | **100% Activo & Operativo (Taller 2)** |
| **🔱 Cambio USD/PEN** | `3005` | Compra y venta de divisas en tiempo real a tasa de cambio de mercado. | PostgreSQL `db_cambio_divisas` | Próximamente (Sprint Futuro) |
| **🔔 Notificaciones** | `3006` | Envío de correos electrónicos, notificaciones Push y SMS transaccionales. | Redis / NoSQL | Próximamente (Sprint Futuro) |

---

## 🔄 3. Matriz de Eventos y Comunicaciones (Event-Driven Architecture)

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as 👤 Cliente Beneficiario
    participant Frontend as 💻 Angular 17 Web
    participant Retiros as 📤 Microservicio Retiros USD
    participant RabbitMQ as 📩 Broker RabbitMQ
    participant Billetera as 💼 Microservicio Billetera
    participant Pasarela as 🏦 Pasarela Bancaria ACH

    Usuario->>Frontend: Ingresa solicitud ($150.50 USD a Chase Bank)
    Frontend->>Retiros: POST /retiros (montoUSD, codigoBanco, cuentaDestino)
    Note over Retiros: Guarda registro en PostgreSQL (Estado: PENDIENTE)
    Retiros-->>Frontend: HTTP 201 Created { id, estado: "PENDIENTE" }
    
    Retiros->>RabbitMQ: Emite evento 'withdrawal.requested'
    RabbitMQ->>Billetera: Consume 'withdrawal.requested'
    
    alt Reserva de Fondos Exitosa
        Billetera->>RabbitMQ: Emite evento 'withdrawal.funds_reserved'
        RabbitMQ->>Retiros: Consume 'withdrawal.funds_reserved'
        Retiros->>Pasarela: Procesa transferencia ACH/Wire a banco receptor
        
        alt Banco Confirma Transferencia
            Pasarela-->>Retiros: Confirmado (Ref: ACH-781784)
            Note over Retiros: Actualiza estado a COMPLETADO
            Retiros->>RabbitMQ: Emite evento 'withdrawal.completed'
        else Banco Rechaza Cuenta
            Pasarela-->>Retiros: Error (Cuenta Inactiva)
            Note over Retiros: Actualiza estado a FALLIDO
            Retiros->>RabbitMQ: Emite evento 'withdrawal.failed'
        end
    else Saldo Insuficiente
        Billetera->>RabbitMQ: Emite evento 'withdrawal.funds_rejected'
        RabbitMQ->>Retiros: Consume 'withdrawal.funds_rejected'
        Note over Retiros: Actualiza estado a RECHAZADO
    end
```

---

## ⚙️ 4. Orquestación y Despliegue con Docker Compose

La infraestructura completa se ejecuta de manera aislada utilizando **Docker Compose**:

```yaml
services:
  servicio-mensajeria-rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: broker-mensajeria-rabbitmq
    ports:
      - "5672:5672"     # AMQP
      - "15672:15672"   # Management Dashboard

  postgres-servicio-retiros-usd:
    image: postgres:15-alpine
    container_name: contenedor-postgres-servicio-retiros-usd
    environment:
      POSTGRES_DB: db_servicio_retiros_usd
    ports:
      - "5432:5432"

  servicio-retiros-usd:
    build: ./retiros-usd-service
    container_name: contenedor-servicio-retiros-usd
    ports:
      - "3004:3004"

  frontend-web:
    build: ./frontend
    container_name: contenedor-frontend-web
    ports:
      - "4200:80"
```
