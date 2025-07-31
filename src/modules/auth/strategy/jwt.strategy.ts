import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { join } from "path";
import { IJwtPayload } from "@/shared/interfaces/jwtPayload.interface";
import * as fs from "fs";
import { AuthService } from "../auth.service";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { UserService } from "@/modules/user/user.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          // Check if cookies exist and access_token is present
          if (!request.cookies) {
            // If cookies object doesn't exist, try to parse manually from headers
            const cookieHeader = request.headers.cookie;
            if (cookieHeader) {
              const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split("=");
                acc[key] = value;
                return acc;
              }, {});

              if (cookies["access_token"]) {
                return cookies["access_token"];
              }
            }
            return null;
          }

          // If cookies object exists, try to get access_token
          const token = request.cookies["access_token"];
          if (!token) return null;
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
      algorithms: ["HS512"], // HMAC with SHA-512
    });
  }

  async validate(payload: IJwtPayload): Promise<UserEntity> {
    try {
      const { email } = payload;
      this.logger.log(`Validating user with email: ${email}`);

      const user = await this.userService.findByEmail(email);
      if (!user) throw new UnauthorizedException("User not found");

      return user;
    } catch (error) {
      this.logger.error(`JWT validation error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
