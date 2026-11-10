# SPEC-004: Estado del retiro y pasarela simulada

- **Responsable:** Gino.
- **Objetivo:** consultar el resultado de un retiro y procesar el desembolso simulado después de un débito confirmado.
- **Frontend:** muestra el resultado y permite actualizar el historial.
- **Backend:** el caso de uso invoca la pasarela simulada y guarda el estado.
- **Dependencia:** consulta del retiro (SPEC-003).

Si se confirma el débito, la pasarela puede producir `COMPLETADO` o `FALLIDO`. En este último caso la devolución es manual. Si billetera rechaza por saldo insuficiente, el retiro queda `RECHAZADO`; si el débito es incierto, queda `PENDIENTE`.
