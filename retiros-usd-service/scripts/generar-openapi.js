// Genera el YAML desde los mismos decoradores y configuración que usa Swagger.
require('reflect-metadata');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { Test } = require('@nestjs/testing');
const yaml = require('js-yaml');
const { RetiroHttpControlador } = require('../dist/infrastructure/controllers/retiro-http.controlador');
const { CrearRetiroCasoUso } = require('../dist/application/use-cases/crear-retiro.caso-uso');
const { ConsultarRetiroCasoUso } = require('../dist/application/use-cases/consultar-retiro.caso-uso');
const { crearDocumentoOpenApi } = require('../dist/openapi');

async function generar() {
  const modulo = await Test.createTestingModule({
    controllers: [RetiroHttpControlador],
    providers: [
      { provide: CrearRetiroCasoUso, useValue: {} },
      { provide: ConsultarRetiroCasoUso, useValue: {} },
    ],
  }).compile();
  const app = modulo.createNestApplication();
  try {
    const documento = JSON.parse(JSON.stringify(crearDocumentoOpenApi(app)));
    const encabezado = '# Generado por npm run generar:openapi. No editar manualmente.\n';
    writeFileSync(join(__dirname, '..', 'openapi_retiros.yaml'), encabezado + yaml.dump(documento, { lineWidth: 100, noRefs: true }), 'utf8');
    console.log('Contrato generado: openapi_retiros.yaml');
  } finally {
    await app.close();
  }
}

generar().catch((error) => {
  console.error('No se pudo generar el contrato OpenAPI:', error);
  process.exitCode = 1;
});
