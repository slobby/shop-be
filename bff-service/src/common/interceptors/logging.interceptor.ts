import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const time = Date.now();
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { method, url } = request;
    return next.handle().pipe(
      tap(() => {
        const { query, params, body } = request;
        const remoteAddr =
          request.headers['x-real-ip'] || request.socket.remoteAddress;
        const userAgent = request.headers['user-agent'];
        const responseTime = Date.now() - time;
        const { statusCode } = response;
        this.logger.info('Recieved request', {
          remoteAddr,
          method,
          url,
          statusCode,
          query,
          params,
          body,
          responseTime,
          userAgent,
        });
      }),
    );
  }
}
