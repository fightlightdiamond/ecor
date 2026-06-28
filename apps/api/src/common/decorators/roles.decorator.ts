import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Yêu cầu user có ít nhất một trong các role (dùng với RolesGuard). */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
