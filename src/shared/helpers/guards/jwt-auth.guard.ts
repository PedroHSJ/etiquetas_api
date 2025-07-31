import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { I18nService } from "nestjs-i18n";
import { AuthService } from "@/modules/auth/auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    @Inject(I18nService)
    private readonly i18n: I18nService,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) return true;

      // Verificação de Token JWT
      const request = context.switchToHttp().getRequest();

      // Try to get token from Authorization header
      let token = request.headers.authorization?.split(" ")[1];

      // If not in header, try to get from cookies
      if (!token && request.cookies) {
        token = request.cookies["access_token"];
      }

      // If token not found in either place, throw unauthorized
      if (!token) {
        throw new UnauthorizedException(
          this.i18n.t("events.commons.notFoundToken"),
        );
      }

      // Verify the token
      await this.authService.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException(
        this.i18n.t("events.commons.invalidToken"),
      );
    }
  }
}
