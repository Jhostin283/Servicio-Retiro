# 🤖 Directorio de Habilidades de Agentes de IA (.agents/skills)

Este directorio contiene las especificaciones formales de habilidades (**Skills Specification (`SKILL.md`)**) para los Agentes de Inteligencia Artificial que colaboran en este proyecto.

---

## 📁 Estructura de Skills Especificadas:

```text
.agents/
├── skills/
│   ├── backend-agent/
│   │   └── SKILL.md        # ⚙️ Especificación del Agente Backend (NestJS / Hexagonal / SOLID)
│   ├── frontend-agent/
│   │   └── SKILL.md        # 🅰️ Especificación del Agente Frontend (Angular 17 / RxJS / Forms)
│   └── qa-agent/
│       └── SKILL.md        # 🧪 Especificación del Agente de QA (Pruebas E2E / Cobertura +80% / OpenAPI)
└── README.md
```

---

## 👥 Agentes y Habilidades Registradas:

1. ⚙️ **[Backend Agent Skill (`.agents/skills/backend-agent/SKILL.md`)](./skills/backend-agent/SKILL.md)**
   * **Nombre:** `backend-agent`
   * **Descripción:** Arquitectura Hexagonal, SOLID, Eventos RabbitMQ (Sagas), reglas financieros USD, OpenAPI 3.0 OpenSpec y Jest coverage >80%.

2. 🅰️ **[Frontend Agent Skill (`.agents/skills/frontend-agent/SKILL.md`)](./skills/frontend-agent/SKILL.md)**
   * **Nombre:** `frontend-agent`
   * **Descripción:** Angular 17 Standalone Components, Reactive Forms, RxJS, HttpClient REST, Tailwind CSS y Jasmine/Jest coverage >80%.

3. 🧪 **[QA Agent Skill (`.agents/skills/qa-agent/SKILL.md`)](./skills/qa-agent/SKILL.md)**
   * **Nombre:** `qa-agent`
   * **Descripción:** Pruebas E2E, integración de Sagas, auditoría de cobertura >80%, validación de contratos OpenAPI 3.0 y pruebas de resiliencia.
