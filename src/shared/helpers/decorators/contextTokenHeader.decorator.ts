import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  applyDecorators,
} from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { Observable, tap } from "rxjs";

export function ContextTokenHeader() {
  return applyDecorators(
    ApiHeader({
      name: "context-token",
      description: "Context token for the requests (JWT)",
      required: true,
      schema: {
        type: "string",
        example:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      },
    }),
  );
}

@Injectable()
export class CustomHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const customHeaderValue = request.headers["context-token"];
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        response.setHeader(
          "context-token",
          customHeaderValue || "DefaultHeaderValue",
        );
      }),
    );
  }
}
