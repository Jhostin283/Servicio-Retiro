---
name: web-design
description: Sistema de Diseño Web e Ingeniería UI/UX para el proyecto de Retiros en Dólares (USD). Integra las referencias oficiales de skills.sh (emil-design-eng, apple-design, design-an-interface) ubicadas en web-design/references/.
references:
  - references/emil-design-eng.md
  - references/apple-design.md
  - references/design-an-interface.md
---

# 🎨 Guía de Diseño Web y UI/UX (`web-design`)

Esta habilidad define los estándares visuales e interfaz de usuario para el desarrollo frontend en Angular 17. Utiliza y hace referencia a las habilidades oficiales descargadas de **[skills.sh](https://www.skills.sh/)** almacenadas en la carpeta **`references/`**:

---

## 📚 Habilidades Oficiales de `skills.sh` en `references/`

1. **[`references/emil-design-eng.md`](./references/emil-design-eng.md)** *(skills.sh - emilkowalski/skills)*:
   - Ingeniería de UI, animaciones deliberadas (`ease-out`), feedback al presionar (`active:scale-[0.98]`), micro-interacciones y regla de no mostrar ruido técnico.

2. **[`references/apple-design.md`](./references/apple-design.md)** *(skills.sh - emilkowalski/skills)*:
   - Consistencia espacial, diseño sobrio, contraste alto WCAG 2.1 AA e indicadores visuales de estado (`COMPLETADO`, `RECHAZADO`, `PENDIENTE`, `FALLIDO`).

3. **[`references/design-an-interface.md`](./references/design-an-interface.md)** *(skills.sh - mattpocock/skills)*:
   - Estructuración de interfaces centradas en el negocio, grilla responsive (móvil 1 col / escritorio 12 cols) y jerarquía visual basada en tarjetas.

---

## 🎯 Resumen Ejecutivo de Aplicación en el Proyecto

- **Vistas**: Formularios reactivos en USD ($1.00 min a $10,000.00 max) y tabla de historial.
- **Sin Infraestructura**: Interfaz pura de negocio sin mencionar Docker, RabbitMQ, Swagger o TypeORM.
- **Modo Oscuro Accessible**: Contraste alto con tokens visuales semánticos de Tailwind CSS.
