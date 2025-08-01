import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayload } from "@/shared/interfaces/jwtPayload.interface";
import { I18nService } from "nestjs-i18n";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import * as fs from "fs";
import { WorkspaceService } from "../workspace/workspace.service";
import { UserDto } from "../user/dto/user.dto";
import { plainToInstance } from "class-transformer";
import { OAuth2Client } from "google-auth-library";
import { RoleService } from "../role/role.service";
import { UserRoleDto } from "../role/dto/user-role.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transactional } from "typeorm-transactional";
import { InviteService } from "../invite/invite.service";
import { InjectRepository } from "@nestjs/typeorm";
import { SubworkspaceEntity } from "../subworkspace/entities/subworkspace.entity";
import { Repository } from "typeorm";
import { SubworkspaceService } from "../subworkspace/subworkspace.service";

export class ContextDTO {
  @ApiProperty({
    description: "ID do usuário",
    example: 1,
  })
  userId: number;
  @ApiProperty({
    description: "ID do papel",
    example: 1,
  })
  roleId: number;
  @ApiProperty({
    description: "ID do workspace",
    example: 1,
  })
  workspaceId: number;
  @ApiProperty({
    description: "ID do subworkspace",
    example: 1,
  })
  subWorkspaceId?: number;
}

export class UsersInvitedOnboardingDto {
  @ApiProperty({
    description: "Email do usuário convidado",
    example: "maria@gmail.com",
  })
  email: string;

  @ApiProperty({
    description: "ID do papel do usuário convidado",
    example: 1,
  })
  roleId: number;

  @ApiPropertyOptional({
    description: "ID do subworkspace (opcional)",
    example: 1,
  })
  subworkspaceName?: string;
}

export class WorkspaceOnboardingDto {
  @ApiProperty({
    description: "Nome do workspace",
    example: "Meu Workspace",
  })
  name: string;
}

export class SubWorkspaceDto {
  @ApiProperty({
    description: "Nome do subworkspace",
    example: "Meu Subworkspace",
  })
  name: string;
}

export class OnboadingManagerDto {
  @ApiProperty({
    description: "ID do papel do usuário",
    example: 1,
  })
  roleId: number;

  @ApiProperty({
    description: "Informações do workspace",
    type: WorkspaceOnboardingDto,
  })
  workspace: WorkspaceOnboardingDto;

  @ApiProperty({
    description: "Lista de subworkspaces",
    type: SubWorkspaceDto,
    isArray: true,
  })
  subworkspaces: SubWorkspaceDto[];

  @ApiProperty({
    description: "Lista de usuários convidados",
    type: UsersInvitedOnboardingDto,
    isArray: true,
  })
  usersInvited: UsersInvitedOnboardingDto[];
}

@Injectable()
export class AuthService {
  private readonly client: OAuth2Client;
  constructor(
    @Inject(SubworkspaceService)
    private readonly subworkspaceService: SubworkspaceService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(I18nService)
    private readonly i18n: I18nService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(RoleService)
    private readonly roleService: RoleService,
    @Inject(InviteService)
    private readonly inviteService: InviteService,
  ) {
    this.client = new OAuth2Client(
      this.configService.get<string>("GOOGLE_CLIENT_ID"),
      this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
    );
  }

  // Adicione este método ao AuthService

  async processSupabaseToken(
    supabaseToken: string,
  ): Promise<{ access_token: string; message: string }> {
    try {
      // Decodificar o token do Supabase para extrair informações do usuário
      const decodedToken = this.jwtService.decode(supabaseToken);
      console.log("Decoded Supabase Token:", decodedToken);
      if (!decodedToken || !decodedToken.email) {
        throw new BadRequestException(
          this.i18n.t("events.commons.invalidToken"),
        );
      }

      // Extrair informações do usuário do token
      const email = decodedToken.email;
      const name =
        decodedToken.user_metadata?.full_name ||
        decodedToken.name ||
        "Usuário Supabase";
      const picture =
        decodedToken.user_metadata?.avatar_url || decodedToken.picture;

      // Usar o fluxo existente de login/criação
      const { access_token } = await this.loginOrCreateGoogleUser({
        email,
        name,
        password: supabaseToken, // Usando o token como senha
        picture,
      });

      return {
        access_token,
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      console.error("Erro ao processar token Supabase:", error);
      throw new UnauthorizedException(this.i18n.t("events.commons.authFailed"));
    }
  }

  async googleRegistrationService(
    token: string,
  ): Promise<{ access_token: string; message: string }> {
    try {
      // Verifica o token do Google
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>("GOOGLE_CLIENT_ID"),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new BadRequestException(
          this.i18n.t("events.commons.invalidGoogleToken"),
        );
      }
      // Realiza login ou cria o usuário
      const { access_token } = await this.loginOrCreateGoogleUser({
        email: payload.email,
        name:
          `${payload.given_name} ${payload.family_name}` || "Usuário Google",
        password: token,
        picture: payload.picture,
      });

      return {
        access_token,
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      console.error("Erro no Google Registration Service:", error);
      throw new UnauthorizedException(
        this.i18n.t("events.commons.googleAuthFailed"),
      );
    }
  }

  async login({
    email,
    pass,
  }: {
    email: string;
    pass: string;
  }): Promise<{ access_token: string; message: string }> {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user)
      throw new UnauthorizedException(this.i18n.t("events.commons.notFound"));

    if (user.active === false)
      throw new UnauthorizedException(
        this.i18n.t("events.commons.userInactive"),
      );

    if (user.isGoogleLogin)
      throw new UnauthorizedException(
        this.i18n.t("events.commons.googleLogin"),
      );
    const passwordIsValid = await this.userService.comparePassword(
      pass,
      user.password,
    );
    if (!passwordIsValid)
      throw new UnauthorizedException(
        this.i18n.t("events.commons.invalidCredentials"),
      );

    if (user && passwordIsValid)
      return {
        access_token: "123",
        message: "123",
      };
  }

  async loginOrCreateGoogleUser({
    email,
    name,
    password,
    picture,
  }: {
    email: string;
    name: string;
    password: string;
    picture?: string;
  }): Promise<{ access_token: string }> {
    try {
      // Busca o usuário pelo email
      let user = plainToInstance(
        UserDto,
        await this.userService.findByEmail(email),
      );
      // Se o usuário não existe, cria um novo
      if (!user) {
        const createUserDto: CreateUserDto = {
          email,
          name,
          isGoogleLogin: true,
          password, // Usuários do Google não precisam de senha
          picture, // Adicione a foto do Google se disponível
        };

        const { data: newUser } = await this.userService.create(createUserDto);
        user = newUser;
      }

      const { data: roles } = await this.roleService.listUserRolesByUserId(
        user.id,
      );

      // Gera o token com as informações do usuário
      return this.tokenGenerate({
        email: user.email,
        id: user.id,
        name: user.name,
        picture: user.picture,
        roles,
        onboardingCompleted: user.onboardingCompleted,
      });
    } catch (error) {
      console.error("Error in Google Registration Service:", error);
      throw new UnauthorizedException(
        this.i18n.t("events.commons.googleAuthFailed"),
      );
    }
  }

  //#region TOKEN
  async tokenGenerate(payload: {
    email: string;
    id: number;
    name: string;
    picture?: string;
    roles: UserRoleDto[];
    onboardingCompleted?: boolean;
  }): Promise<{ access_token: string; message: string }> {
    try {
      // Get JWT secret from environment variable
      const jwtSecret = this.configService.get<string>("JWT_SECRET");

      if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable not set");
      }

      const access_token = this.jwtService.sign(payload, {
        secret: jwtSecret,
        algorithm: "HS512", // HMAC with SHA-512
      });

      return {
        access_token,
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    try {
      // Get JWT secret from environment variable
      const jwtSecret = this.configService.get<string>("JWT_SECRET");

      if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable not set");
      }

      return this.jwtService.verify(token, {
        secret: jwtSecret,
        algorithms: ["HS512"],
      });
    } catch (error) {
      throw new UnauthorizedException(
        this.i18n.t("events.commons.invalidToken"),
      );
    }
  }
  //#endregion

  async contextTokenGenerate(payload: ContextDTO, user: UserDto): Promise<any> {
    try {
      if (payload) {
        await this.verifyContextUser(user.id, payload);
      }

      return await this.tokenGenerateContext(payload, user.id);
    } catch (error) {
      throw error;
    }
  }

  async verifyContextUser(userId: number, context: ContextDTO): Promise<void> {
    try {
      const { data: userRoles } = await this.roleService.listUserRolesByContext(
        userId,
        context.roleId,
        context.workspaceId,
      );

      // VERIFICANDO SE O USUÁRIO É ADMINISTRADOR E NAO LANÇANDO EXCEÇÃO
      if (userRoles.find((userRole) => userRole.role.name === "admin")) {
        return;
      }

      // VERIFICANDO SE O USUÁRIO POSSUI A INSTANCIA QUE ESTÁ TENTANDO ACESSAR
      if (
        userRoles.find(
          (userRole) => userRole.workspace.id !== context.workspaceId,
        )
      )
        throw new ForbiddenException(this.i18n.t("events.auth.userNotHasRole"));

      if (context?.workspaceId) {
        const workspaceExist = await this.workspaceService.findById(
          context?.workspaceId,
        );
        if (!workspaceExist)
          throw new ForbiddenException(
            this.i18n.t("events.auth.userNotHasRole"),
          );
      }
    } catch (error) {
      throw error;
    }
  }

  private async tokenGenerateContext(
    context?: ContextDTO,
    userId?: number,
  ): Promise<any> {
    const payloadToken = { ...context };
    const { data: userRoles } = await this.roleService.listUserRolesByContext(
      userId,
      context.roleId,
      context.workspaceId,
    );

    const resources = userRoles.map((userRole) =>
      userRole.role.permissions.map((permission) => permission.feature.name),
    );

    if (resources.length !== 0) {
      payloadToken["resources"] = resources.flat();
    }

    const keyPath =
      this.configService.get<string>("KEY_PATH") ||
      join(__dirname, "../../chaves");
    const filepath = join(keyPath, "private_key.pem");
    const privateKey = fs.readFileSync(filepath, "utf8");
    const token = this.jwtService.sign(payloadToken, {
      secret: privateKey,
      algorithm: "ES512",
    });

    return { context: context, contextToken: token };
  }

  @Transactional()
  async onboardingManager(data: OnboadingManagerDto, userId: number) {
    try {
      // Cria o workspace
      const wsDto = await this.workspaceService.create({
        name: data.workspace.name,
        createdBy: userId,
      });

      // Primeiro, cria todos os subworkspaces
      const createdSubworkspaces = [];
      if (data.subworkspaces && data.subworkspaces.length > 0) {
        for (const subworkspace of data.subworkspaces) {
          const subWsEntity = await this.subworkspaceService.create(
            {
              name: subworkspace.name,
              workspaceId: wsDto.id,
            },
            userId,
          );
          createdSubworkspaces.push(subWsEntity);
        }
      }

      // Depois, convida os usuários
      if (data.usersInvited && data.usersInvited.length > 0) {
        for (const user of data.usersInvited) {
          // Busca o subworkspace pelo nome nos subworkspaces criados
          const targetSubworkspace = createdSubworkspaces.find(
            (subws) => subws.name === user.subworkspaceName,
          );

          if (targetSubworkspace) {
            await this.inviteService.inviteUsersByOnboarding({
              email: user.email,
              roleId: user.roleId,
              subworkspaceId: targetSubworkspace.id,
              workspaceId: wsDto.id,
              userId,
            });
          } else {
            // Se não encontrou o subworkspace, verifica se já existe no banco
            const existingSubWs = await this.subworkspaceService.findByName(
              user.subworkspaceName,
              wsDto.id,
            );

            if (existingSubWs) {
              await this.inviteService.inviteUsersByOnboarding({
                email: user.email,
                roleId: user.roleId,
                subworkspaceId: existingSubWs.id,
                workspaceId: wsDto.id,
                userId,
              });
            } else {
              // Se não existe, cria um novo subworkspace
              const newSubWsEntity = await this.subworkspaceService.create(
                {
                  name: user.subworkspaceName,
                  workspaceId: wsDto.id,
                },
                userId,
              );

              await this.inviteService.inviteUsersByOnboarding({
                email: user.email,
                roleId: user.roleId,
                subworkspaceId: newSubWsEntity.id,
                workspaceId: wsDto.id,
                userId,
              });
            }
          }
        }
      }

      // Atualiza o usuário como onboarding completado
      await this.userService.update(userId, {
        onboardingCompleted: true,
      });

      return {
        message: this.i18n.t("events.commons.success"),
        workspace: wsDto,
        subworkspaces: createdSubworkspaces,
      };
    } catch (error) {
      throw error;
    }
  }
}
