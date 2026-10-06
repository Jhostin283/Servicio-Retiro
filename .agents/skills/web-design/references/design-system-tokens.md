# Especificación de Tokens de Diseño (Design Tokens)

## 1. Paleta de Colores por Estado del Negocio

```css
/* Estado COMPLETADO */
--color-completado-bg: rgba(16, 185, 129, 0.1);
--color-completado-text: #34d399;
--color-completado-border: rgba(16, 185, 129, 0.3);

/* Estado RECHAZADO / FALLIDO */
--color-error-bg: rgba(244, 63, 94, 0.1);
--color-error-text: #fb7185;
--color-error-border: rgba(244, 63, 94, 0.3);

/* Estado PENDIENTE */
--color-pendiente-bg: rgba(245, 158, 11, 0.1);
--color-pendiente-text: #fbbf24;
--color-pendiente-border: rgba(245, 158, 11, 0.3);
```

## 2. Puntos de Interrupción Responsive (Breakpoints)

- **Mobile (Default)**: `< 768px` -> Grid en 1 columna.
- **Tablet**: `>= 768px` -> Formulario en 2 columnas de entrada.
- **Desktop**: `>= 1024px` -> Grid principal de 12 columnas (7 cols formulario / 5 cols historial).
