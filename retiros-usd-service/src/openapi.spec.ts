import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CrearRetiroCasoUso } from './application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from './application/use-cases/consultar-retiro.caso-uso';
import { RetiroHttpControlador } from './infrastructure/controllers/retiro-http.controlador';
import { crearDocumentoOpenApi } from './openapi';

const yaml = require('js-yaml');

describe('Contrato OpenAPI de retiros', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [RetiroHttpControlador],
      providers: [
        { provide: CrearRetiroCasoUso, useValue: {} },
        { provide: ConsultarRetiroCasoUso, useValue: {} },
      ],
    }).compile();
    app = modulo.createNestApplication();
  });

  afterAll(async () => { await app.close(); });

  it('mantiene el YAML idéntico al documento generado por Swagger', () => {
    const generado = JSON.parse(JSON.stringify(crearDocumentoOpenApi(app)));
    const archivo = yaml.load(readFileSync(join(__dirname, '..', 'openapi_retiros.yaml'), 'utf8'));
    expect(archivo).toEqual(generado);
  });

  it('documenta rutas, respuestas y límites del contrato', () => {
    const documento = crearDocumentoOpenApi(app);
    expect(documento.openapi).toBe('3.0.3');
    expect(documento.servers[0].url).toBe('/');
    expect(documento.info.description).toContain('## Alcance del servicio');
    expect(documento.info.description).toContain('## Estados del retiro');
    expect(documento.info.description).toContain('## Integración con billetera');
    expect(documento.paths['/api/v1/retiros'].post.responses['201']).toBeDefined();
    expect(documento.paths['/api/v1/retiros'].get.responses['400']).toBeDefined();
    expect(documento.paths['/api/v1/retiros/{id}'].get.responses['404']).toBeDefined();
    const esquema = documento.components.schemas.CrearRetiroDto as any;
    expect(esquema.properties.montoUSD).toMatchObject({ minimum: 1, maximum: 10000, multipleOf: 0.01 });
  });
});
