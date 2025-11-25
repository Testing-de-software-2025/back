import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TypeOrmExceptionFilter } from "./common/typeor-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { Client } from "pg";

async function ensurePostgresDatabase() {
  // Sólo intentar si la configuración apunta a Postgres (por defecto en AppModule)
  const pgHost = process.env.POSTGRES_HOST || "localhost";
  const pgPort = parseInt(process.env.POSTGRES_PORT || "5434", 10);
  const pgUser = process.env.POSTGRES_USER || "postgres";
  const pgPassword = process.env.POSTGRES_PASSWORD || "postgres";
  const pgDatabase = process.env.POSTGRES_DB || "delivery-zona";

  try {
    const client = new Client({
      host: pgHost,
      port: pgPort,
      user: pgUser,
      password: pgPassword,
      database: "postgres",
    });
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [pgDatabase]);
    if (res.rowCount === 0) {
      try {
        await client.query(`CREATE DATABASE "${pgDatabase}"`);
        // eslint-disable-next-line no-console
        console.log(`Created database ${pgDatabase}`);
      } catch (e) {
        // otro proceso pudo crearla; continuar
      }
    }
    await client.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Could not ensure Postgres database exists:", err && (err as Error).message ? (err as Error).message : err);
  }
}

async function bootstrap() {
  // Intentar asegurar la existencia de la base antes de inicializar AppModule
  await ensurePostgresDatabase();

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new TypeOrmExceptionFilter());

  app.enableCors({
    origin: "http://localhost:4200", // O '*' solo para testing, NO en producción
    credentials: true, // si tu API necesita autenticación
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // rechaza requests con campos extra
      transform: true, // convierte payloads a instancias de clases DTO
      skipMissingProperties: false, // marca como error si falta cualquier propiedad requerida
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
