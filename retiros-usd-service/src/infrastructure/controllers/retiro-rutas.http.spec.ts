import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AddressInfo } from 'net';
import { RetiroHttpControlador } from './retiro-http.controlador';
import { CrearRetiroCasoUso } from '../../application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from '../../application/use-cases/consultar-retiro.caso-uso';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';

describe('Rutas HTTP versionadas de retiros', () => {
  let app: INestApplication;
  let baseUrl: string;
  const usuarioId = 'd3b07384-d113-46e4-a123-561234567890';
  const retiro = Retiro.crearNuevo(usuarioId, MontoUSD.crear(25.5), '123456789');
  const crear = { ejecutar: jest.fn().mockResolvedValue(retiro) };
  const consultar = {
    obtenerPorId: jest.fn().mockResolvedValue(retiro),
    obtenerPorUsuarioId: jest.fn().mockResolvedValue([retiro]),
  };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [RetiroHttpControlador],
      providers: [
        { provide: CrearRetiroCasoUso, useValue: crear },
        { provide: ConsultarRetiroCasoUso, useValue: consultar },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.listen(0, '127.0.0.1');
    baseUrl = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}`;
  });

  afterAll(async () => { await app.close(); });

  it('crea un retiro en la ruta versionada', async () => {
    const response = await fetch(`${baseUrl}/api/v1/retiros`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ usuarioId, montoUSD: 25.5, cuentaDestino: '123456789' }),
    });
    expect(response.status).toBe(201);
    expect((await response.json() as { id: string }).id).toBe(retiro.id);
  });

  it('consulta por id y filtra la colección por usuarioId', async () => {
    const detalle = await fetch(`${baseUrl}/api/v1/retiros/${retiro.id}`);
    expect(detalle.status).toBe(200);
    expect(consultar.obtenerPorId).toHaveBeenCalledWith(retiro.id);
    const historial = await fetch(`${baseUrl}/api/v1/retiros?usuarioId=${usuarioId}`);
    expect(historial.status).toBe(200);
    expect(await historial.json()).toHaveLength(1);
    expect(consultar.obtenerPorUsuarioId).toHaveBeenCalledWith(usuarioId);
  });

  it('rechaza la consulta de historial sin usuarioId y no expone la ruta antigua', async () => {
    expect((await fetch(`${baseUrl}/api/v1/retiros`)).status).toBe(400);
    expect((await fetch(`${baseUrl}/retiros`)).status).toBe(404);
  });
});
