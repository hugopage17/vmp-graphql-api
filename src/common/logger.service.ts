import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

export function LogRequest(): MethodDecorator {
  return applyDecorators(UseInterceptors(LoggingInterceptor));
}
