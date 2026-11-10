# OpenSpec: Fuente de la Verdad (Source of Truth)

Este directorio **`openspec/`** constituye la **Única Fuente de la Verdad (Single Source of Truth)** para el diseño de contratos de comunicación HTTP y especificaciones de comportamiento (**Spec-Driven Development - SDD**) del sistema de retiros en dólares USD.

---

## 📌 Mapeo de Historias de Usuario a Funcionalidades (Specs)

| ID Historia | Historia de Usuario | Funcionalidad (Spec Path) | Requisitos Vinculados |
|---|---|---|---|
| **US-RET-01** | **Como cliente**, quiero solicitar un retiro en USD, para transferir dinero a mi cuenta de destino. | [`openspec/specs/creacion-retiro/spec.md`](./specs/creacion-retiro/spec.md) | `REQ-RET-001`<br>`REQ-RET-002`<br>`REQ-RET-003` |
| **US-CON-01** | **Como usuario**, quiero consultar el estado de mi retiro e historial, para verificar mis fondos. | [`openspec/specs/consulta-retiro/spec.md`](./specs/consulta-retiro/spec.md) | `REQ-CON-001`<br>`REQ-CON-002`<br>`REQ-CON-003` |
| **US-PRO-01** | **Como sistema/administrador**, quiero procesar el débito de billetera HTTP y la pasarela bancaria, para completar o rechazar los retiros. | [`openspec/specs/procesamiento-retiro/spec.md`](./specs/procesamiento-retiro/spec.md) | `Procesamiento HTTP de billetera` |

---

## 📄 Documentos de Especificación Técnica

| Archivo | Estándar | Descripción |
|---|---|---|
| [`openapi_retiros.yaml`](../retiros-usd-service/openapi_retiros.yaml) | **OpenAPI 3.0.3** | Contrato REST exportado desde la documentación que genera NestJS. Regenerar con `npm run generar:openapi` tras cambiar rutas o DTO. |
| [`specs/`](./specs/) | **OpenSpec SDD** | Especificaciones funcionales desglosadas por Historia de Usuario |

---

## 🏛️ Gobernanza y Reglas de Dominio (USD)

1. **Moneda Obligatoria**: Todos los montos se procesan en **Dólares Estadounidenses (USD)**.
2. **Límites Financieros**:
   - **Monto Mínimo de Retiro**: `$1.00 USD`
   - **Monto Máximo de Retiro**: `$10,000.00 USD`
3. **Estados del flujo HTTP**: `PENDIENTE`, `COMPLETADO`, `RECHAZADO` y `FALLIDO`. El enum conserva `RESERVADO` por compatibilidad con datos anteriores; el flujo actual no lo asigna.
