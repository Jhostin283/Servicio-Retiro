import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

/** Genera el contrato tanto para Swagger UI como para la exportación YAML. */
export function crearDocumentoOpenApi(app: INestApplication): OpenAPIObject {
  const configuracion = new DocumentBuilder()
    .setTitle('API de Microservicio de Retiros en Dolares (USD)')
    .setDescription(`Especificación OpenAPI del microservicio de retiros en dólares estadounidenses (USD).

## Alcance del servicio

El servicio registra solicitudes de retiro, consulta y debita la billetera USD por HTTP, y procesa el desembolso mediante una **pasarela simulada**. La pasarela no realiza transferencias bancarias reales.

La billetera y el registro o inicio de sesión de usuarios son responsabilidades de otros servicios.

## Seguridad y autenticación

Esta API no implementa autenticación ni autorización. En el entorno de prueba utiliza datos ficticios y limita la exposición del servicio.

## Validaciones de entrada

- El monto debe estar entre **USD 1.00 y USD 10,000.00**, con máximo dos decimales.
- Se requieren el identificador del usuario, el monto y la cuenta de destino.
- El identificador de usuario debe coincidir con el \`user_id\` de billetera.
- El tipo de cuenta es opcional y su valor predeterminado es \`AHORROS\`.

## Estados del retiro

- **PENDIENTE:** solicitud registrada o débito incierto que requiere revisión manual.
- **COMPLETADO:** débito confirmado y desembolso simulado exitoso.
- **RECHAZADO:** billetera no existe o rechazó el débito.
- **FALLIDO:** error previo al débito o fallo de la pasarela simulada.
- **RESERVADO:** estado histórico que el flujo HTTP actual no asigna.

Una respuesta HTTP **201** indica que se registró la solicitud; consulta \`estado\` y \`razonFallo\` para conocer el resultado.

## Integración con billetera

El contrato de billetera no documenta idempotencia ni reversión para el débito. No repitas una solicitud si el resultado del débito es incierto hasta revisarlo con billetera. Si la pasarela falla después de un débito confirmado, la devolución requiere gestión manual.

El archivo \`openapi_retiros.yaml\` se genera desde esta misma documentación y puede compartirse con otros equipos.`)
    .setVersion('1.0.0')
    .addServer('/', 'Mismo servidor que proporciona esta documentación')
    .addTag('Retiros en Dólares (USD)', 'Operaciones de retiros en USD.')
    .build();
  const documento = SwaggerModule.createDocument(app, configuracion);
  documento.openapi = '3.0.3';
  return documento;
}
