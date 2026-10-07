import { MontoUSD } from './monto-usd.vo';
import { BadRequestException } from '@nestjs/common';

describe('MontoUSD (Value Object)', () => {
  it('debe crear un monto válido de $150.50 USD', () => {
    const vo = MontoUSD.crear(150.5);
    expect(vo.obtenerValor()).toBe(150.5);
  });

  it('debe permitir el monto mínimo de $1.00 USD', () => {
    const vo = MontoUSD.crear(1.0);
    expect(vo.obtenerValor()).toBe(1.0);
  });

  it('debe permitir el monto máximo de $10,000.00 USD', () => {
    const vo = MontoUSD.crear(10000.0);
    expect(vo.obtenerValor()).toBe(10000.0);
  });

  it('debe lanzar excepción si el monto es menor a $1.00 USD', () => {
    expect(() => MontoUSD.crear(0.5)).toThrow(BadRequestException);
  });

  it('debe lanzar excepción si el monto es mayor a $10,000.00 USD', () => {
    expect(() => MontoUSD.crear(15000.0)).toThrow(BadRequestException);
  });
});
