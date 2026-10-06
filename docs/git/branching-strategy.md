# 🌿 Estrategia de Ramificación e Integración en Git

Este documento especifica la estrategia de ramificación, convención de commits e integración continua para el desarrollo colaborativo entre **Almerco** y **Gino**.

---

## 1. Diagrama de Ramas por Desarrollador y SPEC

```text
main (Rama Estable de Producción)
  │
  ├── feature/almerco/spec-001 (Formulario UI & Endpoint POST /retiros)
  ├── feature/almerco/spec-002 (Cliente HTTP Service & Publicador RabbitMQ)
  │
  ├── feature/gino/spec-003    (Tabla Historial UI & Endpoint GET por Usuario)
  └── feature/gino/spec-004    (Live Updates RxJS, Consumidores AMQP & Pasarela ACH)
```

---

## 2. Convención de Nombres de Ramas y Commits

### **A. Nombres de Ramas**
- **Ramas de Almerco**: `feature/almerco/spec-001`, `feature/almerco/spec-002`
- **Ramas de Gino**: `feature/gino/spec-003`, `feature/gino/spec-004`
- **Rama Principal**: `main`

### **B. Convención de Commits**
- **Formato**: `feat(frontend): <descripción en español>` / `feat(backend): <descripción en español>`
- **Ejemplos**:
  - `feat(frontend): implementar componente de formulario de solicitud de retiro con validacion de rango`
  - `feat(backend): implementar caso de uso crear retiro y controlador HTTP POST /retiros`

---

## 3. Reglas de Trabajo e Integración (Merge & Push)

1. **Desarrollo Aislado**: Ningún desarrollador realiza `git push` o `commit` directo sobre `main`.
2. **Subida Remota**: Cada desarrollador publica su rama `feature/*` al servidor remoto (`git push origin feature/...`).
3. **Pruebas Unitarias Obligatorias**: Antes de integrar, ejecutar la suite completa de pruebas:
   ```bash
   npm run test --prefix frontend
   npm run test --prefix retiros-usd-service
   ```
4. **Merge Explícito**: Integración a `main` mediante `git merge --no-ff` indicando el mensaje de fusión del SPEC y actualizando el repositorio remoto (`git push origin main`).
