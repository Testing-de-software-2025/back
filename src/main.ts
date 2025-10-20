import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TypeOrmExceptionFilter } from "./common/typeor-exception.filter";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
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
bootstrap();
