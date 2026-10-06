# 📋 Plan Full-Stack de Repartición de Especificaciones (Specs)

## 1. Criterios de Distribución Full-Stack
La división del trabajo entre **Almerco** y **Gino** sigue un enfoque **Full-Stack (Vertical Slicing)**, donde **ambos desarrolladores implementan tanto Frontend (Angular 17) como Backend (NestJS / PostgreSQL / RabbitMQ)**.

Esto garantiza el desarrollo paralelo e independiente por características completas de inicio a fin.

---

## 2. Tabla de Repartición Full-Stack de Specs

| Spec | Responsable | Componentes Frontend (Angular 17) | Componentes Backend (NestJS / DB / RabbitMQ) | Dependencias | Dificultad |
|---|---|---|---|---|---|
| **SPEC-001** | **Almerco** | Componente `FormularioRetiro` (Reactive Forms, validaciones $1-$10,000 USD) | Caso de Uso `CrearRetiro` y Controlador HTTP `POST /retiros` | Ninguna | Alta |
| **SPEC-002** | **Almerco** | Servicio `RetirosService` (Cliente HTTP, RxJS error handler) | Adaptador AMQP RabbitMQ (`withdrawal.requested`) y Persistencia TypeORM (`guardar`) | SPEC-001 | Media |
| **SPEC-003** | **Gino** | Componente `TablaHistorial` (Badges de estado, ordenamiento) | Caso de Uso `ConsultarRetiro` y Controlador HTTP `GET /retiros/usuario/:usuarioId` | Ninguna | Alta |
| **SPEC-004** | **Gino** | Actualización reactiva de estado en tiempo real en la UI | Consumidores RabbitMQ (`withdrawal.completed`/`failed`) y Pasarela Bancaria ACH/SWIFT | SPEC-003 | Media |
