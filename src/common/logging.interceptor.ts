import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { GqlExecutionContext } from '@nestjs/graphql';
  import { Observable, tap } from 'rxjs';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const gqlCtx = GqlExecutionContext.create(context);
      const args = gqlCtx.getArgs();
      const req = gqlCtx.getContext().req;

      console.info(gqlCtx);
      console.info(args);
      console.info(req);
  
      return next.handle().pipe();
    }
  }
  