import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const SUPPORTED = ['vi', 'en'];
const DEFAULT_LANG = 'vi';

/**
 * Resolve ngôn ngữ storefront giống Laravel StorefrontLocale:
 * ưu tiên query `?lang=`, rồi header Accept-Language, fallback `vi`.
 */
export const Lang = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const fromQuery = (request.query?.lang as string | undefined)?.toLowerCase();
  if (fromQuery && SUPPORTED.includes(fromQuery)) {
    return fromQuery;
  }
  const header = (request.headers?.['accept-language'] as string | undefined)?.slice(0, 2).toLowerCase();
  if (header && SUPPORTED.includes(header)) {
    return header;
  }
  return DEFAULT_LANG;
});
