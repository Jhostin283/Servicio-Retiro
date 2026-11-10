# Arquitectura del sistema de retiros USD

```mermaid
flowchart LR
    UI[Web o cliente] -->|HTTP| API[API de retiros]
    API -->|lectura y escritura| DB[(PostgreSQL de retiros)]
    API -->|consulta y débito HTTP| WALLET[API de billetera USD]
    API -->|desembolso simulado| BANK[Pasarela simulada]
```

La web llama a `POST /api/v1/retiros`. Retiros guarda la solicitud, busca la billetera del usuario, solicita el débito y, si se confirma, procesa la pasarela simulada. La API responde con el estado y permite consultas por ID o usuario.

```mermaid
sequenceDiagram
    participant UI as Web
    participant R as Retiros
    participant DB as PostgreSQL
    participant B as Billetera USD
    participant P as Pasarela simulada
    UI->>R: POST /api/v1/retiros
    R->>DB: Guardar PENDIENTE
    R->>B: GET billetera del usuario
    B-->>R: ID de billetera
    R->>B: POST débito
    B-->>R: Resultado del débito
    opt Débito confirmado
        R->>P: Procesar desembolso
        P-->>R: Resultado
    end
    R->>DB: Guardar estado
    R-->>UI: Retiro y estado
```

El estado puede ser `COMPLETADO`, `RECHAZADO`, `FALLIDO` o `PENDIENTE`. La respuesta `201` indica que la solicitud se registró, no que siempre se completó. El débito incierto exige revisión manual; la devolución tras un fallo de pasarela es manual.
