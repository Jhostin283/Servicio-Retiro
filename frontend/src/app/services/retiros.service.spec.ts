import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RetirosService } from './retiros.service';
import { EstadoRetiro, RetiroResponse } from '../models/retiro.interface';

describe('RetirosService (Angular HttpClient)', () => {
  let service: RetirosService;
  let httpMock: HttpTestingController;

  const mockRetiro: RetiroResponse = {
    id: 'ret-123',
    usuarioId: 'user-456',
    montoUSD: 150.5,
    moneda: 'USD',
    codigoBanco: 'CHASE',
    cuentaDestino: '987654',
    tipoCuenta: 'AHORROS',
    estado: EstadoRetiro.PENDIENTE,
    fechaCreacion: '2026-10-06T15:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RetirosService],
    });
    service = TestBed.inject(RetirosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear una solicitud de retiro mediante POST /retiros', () => {
    const payload = {
      usuarioId: 'user-456',
      montoUSD: 150.5,
      codigoBanco: 'CHASE',
      cuentaDestino: '987654',
      tipoCuenta: 'AHORROS',
    };

    service.crearSolicitud(payload).subscribe((res) => {
      expect(res).toEqual(mockRetiro);
    });

    const req = httpMock.expectOne('http://localhost:3004/retiros');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockRetiro);
  });

  it('debe obtener un retiro por ID mediante GET /retiros/:id', () => {
    service.obtenerPorId('ret-123').subscribe((res) => {
      expect(res).toEqual(mockRetiro);
    });

    const req = httpMock.expectOne('http://localhost:3004/retiros/ret-123');
    expect(req.request.method).toBe('GET');
    req.flush(mockRetiro);
  });

  it('debe obtener el historial de un usuario mediante GET /retiros/usuario/:id', () => {
    service.obtenerPorUsuarioId('user-456').subscribe((res) => {
      expect(res).toHaveLength(1);
      expect(res[0]).toEqual(mockRetiro);
    });

    const req = httpMock.expectOne('http://localhost:3004/retiros/usuario/user-456');
    expect(req.request.method).toBe('GET');
    req.flush([mockRetiro]);
  });
});
