# Pruebas de integración: DeliveryPerson

Detalle de las pruebas y consideraciones para `deliveryPerson`.

## Objetivo

- Validar la creación, búsqueda por proximidad, asignación de zonas y actualización de estado/ubicación del delivery person.

## Fixtures clave

Ejemplo payload para crear un delivery person:

```ts
const dpPayload: CreateDeliveryPerson = {
  personId: 1,
  location: { lat: -31.41, lng: -64.2 },
  radius: 1,
};
```

Notas:

- `personId` corresponde al identificador externo del repartidor.
- `location` debe respetar la estructura esperada por el DTO `LocationDto`.

## Operaciones probadas

- create: inserta en `delivery` y devuelve el id y status.
- findByProximity: devuelve repartidores dentro de un radio — usamos `FindByProximityDeliveryPerson` DTO en tests.
- assignZone: crea entradas en la tabla pivot `delivery_zones_zone`.

## Limpieza (afterEach / afterAll)

Usamos el mismo patrón que `zone`:

```ts
await dataSource.query('DELETE FROM "delivery_zones_zone"');
await dataSource.query('DELETE FROM "delivery"');
await dataSource.query('DELETE FROM "zone"');
```

## Problemas detectados y correcciones

- Errores por fixtures incompletos -> añadir `personId`, `location`, `radius`.
- Tests dependientes del estado previo -> forzar limpieza en afterEach para que cada test parta de una DB vacía.

## Comandos útiles

```powershell
# Ejecutar tests de deliveryPerson
npx jest --config test/jest-integration.json --runInBand test/integration/deliveryPerson.integration-spec.ts
```

## Observaciones y mejoras

- Considerar usar transacciones por test para habilitar paralelismo seguro.
- Revisar los DTOs si se requiere más flexibilidad en los fixtures de testing (ej.: campos opcionales durante pruebas locales).
