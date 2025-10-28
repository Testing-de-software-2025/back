import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // status y mensaje default
    const status = HttpStatus.BAD_REQUEST;
    const message =
      (exception as unknown as { message?: string }).message ||
      "Error en la base de datos";

    // Envía la respuesta
    res.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
    });
  }
}
