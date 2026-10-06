---
name: frontend-agent
description: Habilidades, estándares y directrices del Agente de Inteligencia Artificial para el desarrollo de aplicaciones web cliente con el framework Angular 17, Standalone Components, Reactive Forms, RxJS, HttpClient, Tailwind CSS y pruebas unitarias con Jasmine/Jest (>80% cobertura).
---

# 🅰️ Agente Frontend (Frontend Agent Skills)

Este documento define las competencias, responsabilidades, patrones de diseño y estándares técnicos que rigen las acciones del **Agente Frontend** en este proyecto.

---

## 🎯 Rol y Alcance
El Agente Frontend es responsable del diseño, implementación, reactividad, formularios, consumo de APIs y pruebas unitarias de la aplicación web desarrollada en el framework Angular (`frontend/`).

---

## 🛠️ Competencias Técnicas y Habilidades

### 1. Arquitectura Angular Modern (Angular 17+)
* **Standalone Components:** Desarrollo modular de componentes sin necesidad de `AppModule`.
* **Configuración Standalone:** Proveedor de servicios global mediante `app.config.ts` (`provideHttpClient()`).

### 2. Formularios Reactivos (`ReactiveFormsModule`)
* Manejo reactivo de formularios mediante `FormBuilder` y `FormGroup`.
* Validaciones síncronas en tiempo real: `Validators.required`, `Validators.min(1)`, `Validators.max(10000)`.

### 3. Consumo Asíncrono de APIs REST (`HttpClient` & `RxJS`)
* Implementación de servicios inyectables (`@Injectable({ providedIn: 'root' })`) como `RetirosService`.
* Manejo de Observables (`Observable<T>`), operadores RxJS y gestión de errores HTTP (`HttpErrorResponse`).
* Conexión con endpoints REST en español (`http://localhost:3004/retiros`).

### 4. Diseño UI/UX Responsivo y Estilizado
* Integración con Tailwind CSS y FontAwesome icons.
* Indicadores visuales de estados de transacción (`PENDIENTE`, `EN_PROCESO`, `COMPLETADO`, `FALLIDO`, `RECHAZADO`).
* Presets de simulación rápida para probar escenarios de éxito, fallos ACH y errores de validación.

### 5. Cobertura de Pruebas Unitarias (>80% Coverage)
* Suites de prueba `.spec.ts` utilizando `HttpClientTestingModule` y `HttpTestingController` para servicios de datos.
* Pruebas de componentes utilizando `TestBed` y `ComponentFixture` para verificar el estado reactivo del DOM.
