import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import axios from "axios";
import * as process from "node:process";
import { Permissions } from "./decorators/permissions.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new UnauthorizedException("No token provided");
      }

      const permissions = this.reflector.get(Permissions, context.getHandler());
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

      const atLeastOneAllowed = results.some(
        (result) => result.status === "fulfilled" && result.value.data,
      );

      if (atLeastOneAllowed) {
        return true;
      } else {
        throw new ForbiddenException("Insufficient permissions");
      }
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      if (error.isAxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

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
