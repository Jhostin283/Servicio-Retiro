# Estructura de retiros USD

```text
retiros-usd-service/
├── openapi_retiros.yaml                     Contrato REST
├── simulador-billetera-usd-http.js          Billetera ficticia para pruebas locales
└── src/
    ├── app.module.ts                         Configuración de NestJS y PostgreSQL
    ├── application/
    │   ├── dtos/                             Datos de entrada y respuesta
    │   └── use-cases/                        Crear y consultar retiros
    ├── domain/
    │   ├── enums/                            Estados del retiro
    │   ├── models/                           Modelo de retiro
    │   ├── ports/                            Contratos de entrada y salida
    │   └── value-objects/                    Reglas del monto USD
    └── infrastructure/
        ├── adapters/
        │   ├── bank/                         Pasarela bancaria simulada
        │   ├── persistence/                  TypeORM y PostgreSQL
        │   └── wallet/                       Cliente HTTP de billetera
        ├── controllers/                      API HTTP de retiros
        └── modules/                          Inyección de dependencias
```

Los archivos `.spec.ts` junto a cada componente contienen sus pruebas. Kubernetes despliega el backend y PostgreSQL; la web y el simulador HTTP no forman parte de sus manifiestos activos.
