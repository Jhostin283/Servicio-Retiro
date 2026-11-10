# SPEC-002: Cliente HTTP y persistencia de retiros

- **Responsable:** Almerco.
- **Objetivo:** enviar solicitudes desde la web, persistir el retiro y comunicarse con billetera mediante HTTP.
- **Frontend:** `RetirosService` envía solicitudes y consulta estados en la API de retiros.
- **Backend:** el caso de uso guarda la solicitud y el adaptador HTTP consulta y debita la billetera USD.
- **Dependencia:** creación del retiro (SPEC-001).

La confirmación o rechazo proviene de la respuesta HTTP de billetera. Un resultado de débito incierto se conserva pendiente para revisión manual, sin reintento automático.
