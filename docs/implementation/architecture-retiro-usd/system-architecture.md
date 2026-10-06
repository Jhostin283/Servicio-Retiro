# 🌐 Arquitectura del Microservicio de Retiros USD

Este documento describe la topología de componentes, la **Arquitectura Hexagonal en Capas** y el flujo de comunicación distribuida del **Microservicio de Retiros USD**.

---

## 🏛️ 1. Arquitectura Hexagonal en Capas

```text
+--------------------------------------------------------------------------+
|                 CAPA 1: INFRAESTRUCTURA (ADAPTADORES)                    |
| [🌐 REST Controller]    [📩 RabbitMQ Consumer]    [🏦 Pasarela ACH]     |
| (RetiroHttpControlador) (RetiroEventosControlador) (AdaptadorPasarela)   |
|                                                                          |
| +----------------------------------------------------------------------+ |
| |                  CAPA 2: APLICACIÓN (CASOS DE USO)                   | |
| | * CrearRetiroCasoUso            * ProcesarFondosReservadosCasoUso    | |
| | * ConsultarRetiroCasoUso        * ProcesarFondosRechazadosCasoUso    | |
| |                                                                      | |
| | +------------------------------------------------------------------+ | |
| | |                CAPA 3: DOMINIO (NEGOCIO PURO)                    | | |
| | | 📦 Entidad: Retiro.modelo                                        | | |
| | | 💎 Value Object: MontoUSD.vo ($1.00 - $10,000.00 USD)            | | |
| | | 🏷️ Enum: EstadoRetiro (PENDIENTE, COMPLETADO, FALLIDO, RECHAZADO)| | |
| | | 🔌 Puertos: RepositorioPuerto | PublicadorPuerto | PasarelaPuerto| | |
| | +------------------------------------------------------------------+ | |
| +----------------------------------------------------------------------+ |
|                                                                          |
| [🛢️ PostgreSQL Adaptador DB]            [📩 Productor RabbitMQ AMQP]     |
| (RepositorioRetiroAdaptador)           (AdaptadorPublicadorRabbitMQ)     |
+--------------------------------------------------------------------------+
```

---

## 🏗️ 2. Diagrama de Componentes e Infraestructura

```mermaid
flowchart TD
    Client["📱 Cliente Web Angular 17"] -->|REST HTTP /retiros| Controller["🌐 RetiroHttpControlador"]
    
    subgraph Microservicio_Retiros_USD["Microservicio Retiros USD (NestJS :3004)"]
        Controller -->|Ejecuta| UC_Crear["CrearRetiroCasoUso"]
        Controller -->|Ejecuta| UC_Consultar["ConsultarRetiroCasoUso"]
        
        UC_Crear --> Port_Repo["🔌 RepositorioRetiroPuerto"]
        UC_Crear --> Port_Pub["🔌 PublicadorEventosPuerto"]
        
        Consumer["📩 RetiroEventosControlador"] -->|Ejecuta| UC_Reservados["ProcesarFondosReservadosCasoUso"]
        UC_Reservados --> Port_Bank["🔌 PasarelaBancariaPuerto"]
    end

    subgraph Adaptadores_Infraestructura["Adaptadores de Infraestructura"]
        Port_Repo -.-> DB_Adapter["🛢️ RepositorioRetiroAdaptador"]
        Port_Pub -.-> Rabbit_Adapter["📩 AdaptadorPublicadorRabbitMQ"]
        Port_Bank -.-> Bank_Adapter["🏦 AdaptadorPasarelaBancaria"]
    end

    DB_Adapter ---> Postgres[("🛢️ PostgreSQL db_servicio_retiros_usd")]
    Rabbit_Adapter ---> RabbitMQ["📩 RabbitMQ withdrawal_queue"]
```

---

## 🔄 3. Comunicación Asíncrona (Event-Driven)

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Usuario
    participant REST as 🌐 REST API (:3004)
    participant DB as 🛢️ PostgreSQL
    participant Rabbit as 📩 RabbitMQ
    participant Bank as 🏦 Pasarela Bancaria ACH

    User->>REST: POST /retiros (montoUSD, cuentaDestino)
    REST->>DB: Guarda registro (Estado: PENDIENTE)
    REST-->>User: 201 Created { id, estado: "PENDIENTE" }
    REST->>Rabbit: Emite evento 'withdrawal.requested'
    
    Note over REST: Procesa reserva y confirmación bancaria
    REST->>Bank: Ejecuta transferencia bancaria ACH/Wire
    alt Transferencia Exitosa
        Bank-->>REST: Éxito (Ref: ACH-XXXXXX)
        REST->>DB: Actualiza estado a COMPLETADO
        REST->>Rabbit: Emite evento 'withdrawal.completed'
    else Cuenta Inactiva
        Bank-->>REST: Error (Cuenta Inactiva)
        REST->>DB: Actualiza estado a FALLIDO
        REST->>Rabbit: Emite evento 'withdrawal.failed'
    end
```
