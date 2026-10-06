# OpenSpec: Fuente de la Verdad (Source of Truth)

Este directorio **`openspec/`** constituye la **Única Fuente de la Verdad (Single Source of Truth)** para el diseño de contratos de comunicación síncrona (REST), asíncrona (Eventos AMQP / RabbitMQ) y especificaciones de comportamiento (**Spec-Driven Development - SDD**) del sistema de retiros en dólares USD.

---

## 📌 Mapeo de Historias de Usuario a Funcionalidades (Specs)

| ID Historia | Historia de Usuario | Funcionalidad (Spec Path) | Requisitos Vinculados |
|---|---|---|---|
| **US-RET-01** | **Como cliente**, quiero solicitar un retiro en USD, para transferir dinero a mi cuenta de destino. | [`openspec/specs/creacion-retiro/spec.md`](./specs/creacion-retiro/spec.md) | `REQ-RET-001`<br>`REQ-RET-002` |
| **US-CON-01** | **Como usuario**, quiero consultar el estado de mi retiro e historial, para verificar mis fondos. | [`openspec/specs/consulta-retiro/spec.md`](./specs/consulta-retiro/spec.md) | `REQ-CON-001`<br>`REQ-CON-002` |
| **US-EVT-01** | **Como sistema/administrador**, quiero procesar asíncronamente las reservas y la pasarela bancaria, para completar o rechazar los retiros. | [`openspec/specs/procesamiento-eventos/spec.md`](./specs/procesamiento-eventos/spec.md) | `REQ-EVT-001`<br>`REQ-EVT-002` |

---

## 📄 Documentos de Especificación Técnica

| Archivo | Estándar | Descripción |
|---|---|---|
| [`openapi.yaml`](./openapi.yaml) | **OpenAPI 3.0.3** | Especificación REST pública/privada de microservicios NestJS y Angular |
| [`asyncapi.yaml`](./asyncapi.yaml) | **AsyncAPI 2.6.0** | Contratos de eventos asíncronos publicados y consumidos vía RabbitMQ |
| [`specs/`](./specs/) | **OpenSpec SDD** | Especificaciones funcionales desglosadas por Historia de Usuario |

---

## 🏛️ Gobernanza y Reglas de Dominio (USD)

1. **Moneda Obligatoria**: Todos los montos se procesan en **Dólares Estadounidenses (USD)**.
2. **Límites Financieros**:
   - **Monto Mínimo de Retiro**: `$1.00 USD`
   - **Monto Máximo de Retiro**: `$10,000.00 USD`
3. **Idiomas y Nombres**: Todos los endpoints, esquemas DTO, estados del dominio (`PENDIENTE`, `RESERVADO`, `COMPLETADO`, `RECHAZADO`, `FALLIDO`) y eventos están documentados formalmente en **Español**.
