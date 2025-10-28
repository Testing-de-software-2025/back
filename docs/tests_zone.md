# Pruebas de integración: Zone

Este documento describe con detalle las pruebas de integración relacionadas con `Zone`, los fixtures usados, los problemas detectados y cómo reproducirlas.

## Objetivo

- Verificar los endpoints y servicios de `zone` (creación, list, asignación y borrado).
- Asegurar que los tests son deterministas y limpian su estado.

## Fixtures usados

Ejemplo de payload para crear una zona:

```ts
const zonePayload: CreateZone = {
  name: "Z1",
  location: { lat: 0, lng: 0 },
  radius: 5,
};
```

Notas:

- `location` debe ser un objeto con `lat` y `lng` (JSONB en la DB).
- `radius` es obligatorio.

## Cleanup (afterEach / afterAll)

Para garantizar idempotencia usamos limpieza explícita en el orden correcto (tabla pivot primero):

```ts
await dataSource.query('DELETE FROM "delivery_zones_zone"');
await dataSource.query('DELETE FROM "delivery"');
await dataSource.query('DELETE FROM "zone"');
```

Explicación: primero se borra la tabla de relación many-to-many, luego las entidades dependientes para evitar violaciones por FK.

## Errores comunes y soluciones

- Violación NOT NULL en `location` o `radius`: asegurarse de que los fixtures incluyan todos los campos obligatorios.
- Imports no resueltos desde `test/`: comprobar `test/jest-integration.json` con `rootDir: ".."` y `moduleNameMapper`.

## Comandos para ejecutar localmente

```powershell
# Ejecutar tests de zone
npx jest --config test/jest-integration.json --runInBand test/integration/zone.integration-spec.ts

# Aplicar arreglos automáticos de eslint en tests
npx eslint "test/**/*.ts" --fix
```

## Observaciones

- Para paralelizar tests en CI conviene cambiar el enfoque de limpieza por transacciones con rollback o usar un contenedor de BD por job.
- Si querés, implemento la versión transaccional (cada test abre una transacción y la hace rollback al final).
