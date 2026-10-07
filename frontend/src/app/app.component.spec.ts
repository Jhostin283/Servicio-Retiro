import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RetirosService } from './services/retiros.service';
import { of, throwError } from 'rxjs';
import { EstadoRetiro, RetiroResponse } from './models/retiro.interface';

describe('AppComponent (Angular Component)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockService: jest.Mocked<RetirosService> | any;

  const mockRetiro: RetiroResponse = {
    id: 'ret-123',
    usuarioId: 'd3b07384-d113-46e4-a123-561234567890',
    montoUSD: 150.5,
    moneda: 'USD',
    codigoBanco: 'CHASEUS33XXX',
    cuentaDestino: '987654321012',
    tipoCuenta: 'AHORROS',
    estado: EstadoRetiro.PENDIENTE,
  };

  beforeEach(async () => {
    mockService = {
      crearSolicitud: jest.fn().mockReturnValue(of(mockRetiro)),
      obtenerPorUsuarioId: jest.fn().mockReturnValue(of([mockRetiro])),
      obtenerPorId: jest.fn().mockReturnValue(of(mockRetiro)),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [{ provide: RetirosService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente de Angular', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario reactivo con valores por defecto', () => {
    expect(component.formRetiro.valid).toBeTruthy();
    expect(component.formRetiro.get('usuarioId')?.value).toBe(component.usuarioIdDefault);
    expect(component.formRetiro.get('montoUSD')?.value).toBe(150.5);
  });

  it('debe cargar los valores del preset de éxito', () => {
    component.cargarPreset('exito');
    expect(component.formRetiro.get('montoUSD')?.value).toBe(150.5);
    expect(component.formRetiro.get('cuentaDestino')?.value).toBe('987654321012');
  });

  it('debe cargar los valores del preset de fallo bancario', () => {
    component.cargarPreset('fallo_banco');
    expect(component.formRetiro.get('cuentaDestino')?.value).toBe('0000');
  });

  it('debe enviar la solicitud exitosamente', () => {
    component.enviarSolicitud();
    expect(mockService.crearSolicitud).toHaveBeenCalledTimes(1);
    expect(component.statusHttp).toBe(202);
    expect(component.respuestaServer).toEqual(mockRetiro);
  });

  it('debe manejar errores en la solicitud HTTP', () => {
    mockService.crearSolicitud.mockReturnValue(
      throwError(() => ({ status: 400, error: { message: 'Monto inválido' } })),
    );

    component.enviarSolicitud();
    expect(component.statusHttp).toBe(400);
    expect(component.respuestaServer).toEqual({ message: 'Monto inválido' });
  });
});
