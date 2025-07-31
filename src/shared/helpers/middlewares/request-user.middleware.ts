import { Inject, Injectable, NestMiddleware, Next } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import { plainToInstance } from "class-transformer";
import { UserService } from "@/modules/user/user.service";
import { UserDto } from "@/modules/user/dto/user.dto";
import { IJwtPayload } from "@/shared/interfaces/jwtPayload.interface";
import { FeatureDto } from "@/modules/feature/dto/feature.dto";
import { UserRoleDto } from "@/modules/role/dto/user-role.dto";
@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    req.user = await this.getUserFromRequest(req);
    console.log("req.user", req.user);
    //req.features = await this.getFeaturesFromRequest(req);
    req.roles = await this.getRolesFromRequest(req);
    console.log("req.roles", req.roles);
    next();
  }

  private async getUserFromRequest(req: Request): Promise<UserDto | null> {
    const token = req.headers.authorization?.split(" ")[1]
      ? req.headers.authorization?.split(" ")[1]
      : req.cookies["access_token"];

    //   ? req.headers.authorization?.split(" ")[1]
    //   : req.cookies["access_token"];
    // console.log("token", token);
    console.log(token);
    if (!token) return null;

    try {
      const decoded = jwt.decode(token) as IJwtPayload;
      console.log("decoded", decoded);
      if (decoded.email) {
        return await this.userService.findByEmail(decoded.email);
      }
      return null;
    } catch (err) {
      Next;
      return null;
    }
  }

  private async getFeaturesFromRequest(
    req: Request,
  ): Promise<FeatureDto[] | null> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.decode(token) as IJwtPayload;
      console.log("decoded", decoded);
      if (decoded.features) return decoded.features;
    } catch (err) {
      Next;
      return null;
    }
  }

  private async getRolesFromRequest(
    req: Request,
  ): Promise<UserRoleDto[] | null> {
    const token = req.headers.authorization?.split(" ")[1]
      ? req.headers.authorization?.split(" ")[1]
      : req.cookies["access_token"];
    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.decode(token) as IJwtPayload;
      console.log("decoded", decoded);
      if (decoded.roles) return decoded.roles;
    } catch (err) {
      Next;
      return null;
    }
  }
}
