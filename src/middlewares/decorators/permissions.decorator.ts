import { SetMetadata } from "@nestjs/common";

// Clave usada para almacenar permisos en metadata
export const PERMISSIONS_KEY = "permissions";

export const Permissions = (
  permissionsOrFirst?: string[] | string,
  ...rest: string[]
) => {
  const permissions = Array.isArray(permissionsOrFirst)
    ? permissionsOrFirst
    : permissionsOrFirst
      ? [permissionsOrFirst, ...rest]
      : [];

  return SetMetadata(PERMISSIONS_KEY, permissions);
};
