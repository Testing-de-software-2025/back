# Explicación línea a línea — test/integration/deliveryPerson.integration-spec.ts

Este documento explica, en español y de forma detallada, cada línea del archivo de prueba `test/integration/deliveryPerson.integration-spec.ts`. El objetivo es dejar claro qué hace cada instrucción, por qué está ahí y qué efecto tiene en la prueba.

Notas generales:
- El test fue adaptado para ejecutarse sin conectarse a la base de datos: usa servicios simulados en memoria (mocks).
- Se explican tanto declaraciones como bloques, tipos y llamadas asíncronas.

-----

1. import { CreateDeliveryPerson } from "../../src/deliveryPerson/dto/CreateDeliveryPerson.dto";
   - Importa la definición del DTO `CreateDeliveryPerson` desde la carpeta `src`. Se usa como tipo para los payloads que simulan la creación de repartidores.

2. import { AssignZoneDeliveryPerson } from "../../src/deliveryPerson/dto/AssignZoneDeliveryPerson.dto";
   - Importa el DTO `AssignZoneDeliveryPerson`, que contiene la forma del objeto para asignar zonas a un repartidor (ej.: { zoneIds: number[] }).

3. import { CreateZone } from "../../src/zone/dto/CreateZone.dto";
   - Importa el DTO `CreateZone` usado para tipar los payloads de creación de zonas en las pruebas.

4. import { FindByProximityDeliveryPerson } from "../../src/deliveryPerson/dto/FindByProximityDeliveryPerson.dto";
   - Importa el DTO usado para búsquedas por proximidad (contiene `location` y `radius`).

5. 
6. jest.setTimeout(30000);
   - Aumenta el timeout de Jest para estas pruebas a 30 segundos. Útil si hay operaciones asíncronas que podrían demorar más de lo normal.

7. 
8. describe("DeliveryPerson Integration (mocked, no DB)", () => {
   - Inicia un bloque `describe` que agrupa las pruebas relacionadas con `DeliveryPerson` en un contexto "integration" pero usando mocks (no DB).

9.   let deliveryService: DeliveryServiceMockType;
   - Declara la variable que contendrá el mock tipado del servicio `deliveryService`.

10.   let zoneService: ZoneServiceMockType;
   - Declara la variable que contendrá el mock tipado del servicio `zoneService`.

11. 
12.   // in-memory stores to simulate DB
   - Comentario: indica que se usarán estructuras en memoria para simular la base de datos.

13.   type ZoneMock = CreateZone & { id: number };
   - Define un tipo `ZoneMock` que añade un `id:number` a la forma de `CreateZone`.

14.   type DeliveryMock = CreateDeliveryPerson & { id: number; zones: ZoneMock[] };
   - Define el tipo `DeliveryMock`: la forma de un repartidor creado, con `id` y el array `zones`.

15. 
16.   interface DeliveryServiceMockType {
   - Inicio de la interfaz que describe los métodos que el mock de `deliveryService` expondrá.

17.     create(payload: CreateDeliveryPerson): Promise<DeliveryMock>;
   - Método `create` que recibe un payload tipado y devuelve una promesa del `DeliveryMock` creado.

18. 
19.     assignZone(
20.       id: number,
21.       dto: AssignZoneDeliveryPerson,
22.     ): Promise<DeliveryMock | null>;
   - Método `assignZone` que asigna zonas a un repartidor: puede devolver el repartidor actualizado o `null` si no existe.

23. 
24.     getZonesAssigned(id: number): Promise<ZoneMock[]>;
   - Devuelve las zonas asignadas a un repartidor por id.

25. 
26.     unassignZone(id: number, zoneId: number): Promise<DeliveryMock>;
   - Quita una zona específica de un repartidor.

27. 
28.     unassignAllZones(id: number): Promise<DeliveryMock>;
   - Quita todas las zonas de un repartidor.

29. 
30.     findByProximity(
31.       query: FindByProximityDeliveryPerson,
32.     ): Promise<DeliveryMock[]>;
   - Busca repartidores por proximidad (devuelve un array ordenado de `DeliveryMock`).

33.   }
   - Cierre de la interfaz `DeliveryServiceMockType`.

34. 
35.   interface ZoneServiceMockType {
36.     create(payload: CreateZone): Promise<ZoneMock>;
37.     findManyByIds(ids: number[]): Promise<ZoneMock[]>;
38.   }
   - Interface que describe el mock de `zoneService`: creación y búsqueda por IDs.

39. 
40.   let _deliveries: DeliveryMock[] = [];
   - Arreglo en memoria que simula la tabla de repartidores (records insertados por las pruebas).

41.   let _zones: ZoneMock[] = [];
   - Arreglo en memoria que simula la tabla de zonas.

42.   let _dpId = 1;
   - Contador incremental para IDs de repartidores. Se usa para simular claves primarias autoincrementales.

43.   let _zoneId = 1;
   - Contador incremental para IDs de zonas.

44. 
45.   beforeAll(() => {
46.     // reset stores
   - Bloque `beforeAll` que se ejecuta antes de todas las pruebas en este `describe`.

47.     _deliveries = [];
48.     _zones = [];
49.     _dpId = 1;
50.     _zoneId = 1;
   - Inicializa/reinicia los almacenes y contadores en memoria.

51. 
52.     zoneService = {
   - Comienza la definición del mock `zoneService`.

53.       create: jest.fn((payload: CreateZone) => {
54.         const z: ZoneMock = { id: _zoneId++, ...payload };
55.         _zones.push(z);
56.         return Promise.resolve(z);
57.       }),
   - Implementación del método `create` en el mock:
     - Construye un objeto `ZoneMock` con id auto-incremental.
     - Lo añade al arreglo `_zones`.
     - Devuelve una promesa resuelta con el objeto (simula comportamiento asíncrono de la capa real).

58.       findManyByIds: jest.fn((ids: number[]) =>
59.         Promise.resolve(_zones.filter((z) => ids.includes(z.id))),
60.       ),
   - Implementación de `findManyByIds`:
     - Filtra `_zones` por `ids` y devuelve una promesa con el array resultante.

61.     };
   - Cierre del objeto `zoneService` mock.

62. 
63.     deliveryService = {
   - Comienzo de la definición del mock `deliveryService`.

64.       create: jest.fn((payload: CreateDeliveryPerson) => {
65.         const entity: DeliveryMock = { id: _dpId++, ...payload, zones: [] };
66.         _deliveries.push(entity);
67.         return Promise.resolve(entity);
68.       }),
   - Implementación del `create` del mock de delivery:
     - Crea `DeliveryMock` con id incremental y array `zones` vacío.
     - Lo agrega a `_deliveries` y devuelve una promesa resuelta.

69.       assignZone: jest.fn((id: number, dto: AssignZoneDeliveryPerson) => {
70.         const dp = _deliveries.find((d) => d.id === id);
71.         if (!dp) return Promise.resolve(null);
72.         dp.zones = _zones.filter((z) => dto.zoneIds.includes(z.id));
73.         return Promise.resolve(dp);
74.       }),
   - Implementación de `assignZone`:
     - Busca el repartidor por id en `_deliveries`.
     - Si no existe, devuelve `null`.
     - Si existe, asocia como `zones` las zonas encontradas en `_zones` cuyos ids están en `dto.zoneIds`.
     - Devuelve el repartidor actualizado.

75.       getZonesAssigned: jest.fn((id: number) => {
76.         const dp = _deliveries.find((d) => d.id === id);
77.         return Promise.resolve(dp ? dp.zones : []);
78.       }),
   - Implementación de `getZonesAssigned`: busca el repartidor y devuelve sus `zones` o un array vacío si no existe.

79.       unassignZone: jest.fn((id: number, zoneId: number) => {
80.         const dp = _deliveries.find((d) => d.id === id);
81.         if (!dp) return Promise.reject(new Error("Not found"));
82.         dp.zones = dp.zones.filter((z) => z.id !== zoneId);
83.         return Promise.resolve(dp);
84.       }),
   - Implementación de `unassignZone`:
     - Encuentra el repartidor, si no existe rechaza la promesa.
     - Filtra la zona indicada fuera del array `zones` del repartidor.
     - Devuelve el repartidor actualizado.

85.       unassignAllZones: jest.fn((id: number) => {
86.         const dp = _deliveries.find((d) => d.id === id);
87.         if (!dp) return Promise.reject(new Error("Not found"));
88.         dp.zones = [];
89.         return Promise.resolve(dp);
90.       }),
   - Implementación de `unassignAllZones`: similar a `unassignZone` pero vacía todas las zonas.

91.       findByProximity: jest.fn((query: FindByProximityDeliveryPerson) => {
92.         const { location } = query;
93.         const dist = (p: DeliveryMock) => {
94.           const dx = p.location.lat - location.lat;
95.           const dy = p.location.lng - location.lng;
96.           return dx * dx + dy * dy;
97.         };
98.         return Promise.resolve(
99.           _deliveries.slice().sort((a, b) => dist(a) - dist(b)),
100.         );
101.       }),
   - Implementación de `findByProximity`:
     - Extrae la `location` del query.
     - Define una función `dist` que calcula una distancia cuadrática simple entre dos puntos (no es la distancia geo real, pero sirve para ordenar).
     - Ordena una copia de `_deliveries` por esa distancia y devuelve la lista ordenada.

102.     };
   - Cierre del objeto `deliveryService` mock.

103.     // mocks are already typed via the declared variables
   - Comentario que indica que las variables ya están tipadas.

104.   });
   - Fin del bloque `beforeAll`.

105. 
106.   afterEach(() => {
107.     // reset in-memory stores between tests
108.     _deliveries = [];
109.     _zones = [];
110.     _dpId = 1;
111.     _zoneId = 1;
112.     jest.clearAllMocks();
113.   });
   - `afterEach` que asegura que después de cada `it` los almacenes quedan limpios y los mocks reseteados.

114. 
115.   it("create, assign zones, get zones assigned, unassign and unassignAll", async () => {
   - Inicio del primer caso de prueba (flujo completo de creación y asignaciones).

116.     const dpPayload: CreateDeliveryPerson = {
117.       personId: 1,
118.       location: { lat: 0, lng: 0 },
119.       radius: 1,
120.     };
   - Define el payload para crear un repartidor. Tipado con `CreateDeliveryPerson`.

121. 
122.     const dp = await deliveryService.create(dpPayload);
   - Llama al mock `create` y espera la creación; devuelve el `DeliveryMock`.

123. 
124.     expect(dp).toBeDefined();
125.     expect(dp.id).toBeDefined();
   - Aserciones: existe el objeto y su `id`.

126. 
127.     const z1Payload: CreateZone = {
128.       name: "Z1",
129.       location: { lat: 0, lng: 0 },
130.       radius: 5,
131.     };
132.     const z2Payload: CreateZone = {
133.       name: "Z2",
134.       location: { lat: 1, lng: 1 },
135.       radius: 5,
136.     };
   - Define dos payloads de zonas para crear y luego asignar.

137. 
138.     const z1 = await zoneService.create(z1Payload);
139.     const z2 = await zoneService.create(z2Payload);
   - Crea las zonas usando el mock `zoneService`.

140. 
141.     const assignPayload: AssignZoneDeliveryPerson = { zoneIds: [z1.id, z2.id] };
142.     const assigned = await deliveryService.assignZone(dp.id, assignPayload);
   - Construye el DTO de asignación y llama a `assignZone`.

143. 
144.     expect(assigned).toBeDefined();
145.     expect(assigned!.zones.length).toBeGreaterThanOrEqual(2);
   - Verifica que la asignación devolvió el repartidor con al menos 2 zonas.

146. 
147.     const zones = await deliveryService.getZonesAssigned(dp.id);
148.     expect(zones.length).toBeGreaterThanOrEqual(2);
   - Comprueba que `getZonesAssigned` también retorna las zonas asignadas.

149. 
150.     // unassign one
151.     const afterUnassign = await deliveryService.unassignZone(dp.id, z2.id);
152.     expect(afterUnassign.zones.find((z) => z.id === z2.id)).toBeUndefined();
   - Llama a `unassignZone` y verifica que la zona `z2` ya no está presente.

153. 
154.     // unassign all
155.     const afterUnassignAll = await deliveryService.unassignAllZones(dp.id);
156.     expect(afterUnassignAll.zones).toEqual([]);
   - Llama a `unassignAllZones` y espera que el array de zonas quede vacío.

157.   });
   - Fin del primer `it`.

158. 
159.   it("findByProximity filters and orders", async () => {
   - Inicio del segundo caso de prueba: verifica búsqueda por proximidad.

160.     // create some delivery persons
161.     const aPayload: CreateDeliveryPerson = {
162.       personId: 2,
163.       location: { lat: -31.41, lng: -64.2 },
164.       radius: 1,
165.     };
166.     const bPayload: CreateDeliveryPerson = {
167.       personId: 3,
168.       location: { lat: -32.0, lng: -64.0 },
169.       radius: 1,
170.     };
171.     const cPayload: CreateDeliveryPerson = {
172.       personId: 4,
173.       location: { lat: 10.0, lng: 10.0 },
174.       radius: 1,
175.     };
   - Define payloads de ejemplo con diferentes ubicaciones para probar el ordenamiento.

176. 
177.     const a = await deliveryService.create(aPayload);
178.     const b = await deliveryService.create(bPayload);
179.     await deliveryService.create(cPayload);
   - Crea tres repartidores en el almacén simulado.

180. 
181.     const proximityPayload: FindByProximityDeliveryPerson = {
182.       location: { lat: -31.4, lng: -64.2 },
183.       radius: 3000,
184.     };
185.     const res = await deliveryService.findByProximity(proximityPayload);
   - Construye la consulta por proximidad y llama al mock que devuelve los repartidores ordenados.

186. 
187.     expect(Array.isArray(res)).toBe(true);
188.     expect(res.some((x) => x.id === a.id)).toBe(true);
189.     const ids = res.map((r) => r.id);
190.     expect(ids.indexOf(a.id)).toBeLessThan(ids.indexOf(b.id));
   - Aserciones: la respuesta es un array, contiene al repartidor `a`, y `a` aparece antes que `b` (está más cerca del punto de consulta).

191.   });
   - Fin del segundo `it`.

192. });
   - Cierre del bloque `describe`.

---

Comentarios finales y recomendaciones
- Esta variante mockeada es ideal para pruebas rápidas, aisladas y para CI donde no queremos dependencias externas.
- Si más adelante deseas probar la integración real con Postgres, recomiendo duplicar la suite en un archivo `*.e2e-spec.ts` que arranque `AppModule` y el `DataSource`, y que solo se ejecute cuando la infraestructura de BD esté disponible (por ejemplo con una etiqueta o variable de entorno).
- Para reproducir exactamente la lógica geo en producción, reemplazar la función `dist` por una fórmula geodésica (Haversine) si la precisión es importante.

Si querés, guardo este archivo y creo un commit/PR con la documentación en `docs/`.