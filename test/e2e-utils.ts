import { CanActivate, Injectable, INestApplication } from "@nestjs/common";

@Injectable()
export class AllowAllAuthGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

export const applyAllowAllGuard = (app: INestApplication) => {
  // en los tests de e2e usaremos app.useGlobalGuards(new AllowAllAuthGuard())
  app.useGlobalGuards(new AllowAllAuthGuard());
};
