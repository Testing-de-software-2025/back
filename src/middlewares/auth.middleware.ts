import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import axios from "axios";
import { Request } from "express";
import { PERMISSIONS_KEY } from "./decorators/permissions.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new UnauthorizedException("No token provided");
      }

      const permissions =
        this.reflector.get<string[] | undefined>(
          PERMISSIONS_KEY,
          context.getHandler(),
        ) ?? [];

      // Si no hay permisos definidos, no bloqueamos (endpoints sin @Permissions)
      if (!permissions.length) return true;

      const baseURL = process.env.JWT_SERVICE_URL || "http://localhost:3001";

      const requests = permissions.map((permission: string) =>
        axios.get(`${baseURL}/can-do/${permission}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      );

      const results = await Promise.allSettled(requests);

      // comprobar resultados de forma segura
      for (const r of results) {
        if (r.status === "fulfilled" && r.value?.data) return true;
      }
      throw new ForbiddenException("Insufficient permissions");
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      const err = error as unknown;
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const respData = err.response.data as unknown as
          | { message?: string }
          | undefined;
        const message = respData?.message ?? err.message;

        if (status === 401) {
          throw new UnauthorizedException(message);
        } else if (status === 403) {
          throw new ForbiddenException(message);
        }
      }

      throw new UnauthorizedException("An unexpected error occurred");
    }
  }
}
