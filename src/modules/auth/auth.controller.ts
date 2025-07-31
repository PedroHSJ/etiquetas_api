import { Controller, Post, Body, Request } from "@nestjs/common";
import { AuthService, ContextDTO, OnboadingManagerDto } from "./auth.service";
import {
  ApiBody,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "@/shared/helpers/decorators/public.decorator";
import { GoogleLoginDto } from "./dto/google.dto";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { SupabaseTokenDto } from "./dto/supabase-token.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Adicione este endpoint ao AuthController

  @ApiExcludeEndpoint()
  @Public()
  @Post("token")
  @ApiOperation({
    summary: "Autenticação com token Supabase",
    description:
      "Recebe um token do Supabase e retorna um token JWT da aplicação",
  })
  @ApiResponse({
    status: 200,
    description: "Token de acesso gerado com sucesso",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        message: "Autenticação realizada com sucesso",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido ou expirado",
  })
  async tokenLogin(
    @Body() dto: SupabaseTokenDto,
  ): Promise<{ access_token: string; message: string }> {
    return this.authService.processSupabaseToken(dto.supabaseToken);
  }

  @ApiExcludeEndpoint()
  @Public()
  @Post("google/registration")
  @ApiOperation({
    summary: "Register or login a user using Google OAuth",
    description:
      "This endpoint handles Google OAuth token verification and registers or logs in the user.",
  })
  @ApiResponse({
    status: 200,
    description: "User successfully registered or logged in",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        message: "Operation successful",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid Google token",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Google authentication failed",
  })
  @ApiBody({
    description: "Google OAuth token",
    schema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "Google OAuth ID token",
          example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2Mz...",
        },
      },
    },
  })
  async googleRegistration(
    @Body() dto: GoogleLoginDto,
  ): Promise<{ access_token: string; message: string }> {
    return await this.authService.googleRegistrationService(dto.token);
  }

  @ApiExcludeEndpoint()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post("context-token")
  async getContextToken(
    @Body() dto: ContextDTO,
    @Request() req: Request,
  ): Promise<{ access_token: string; message: string }> {
    const user = req.user;
    return await this.authService.contextTokenGenerate(dto, user);
  }

  @ApiBody({
    type: OnboadingManagerDto,
    description: "Onboarding manager data",
  })
  @ApiResponse({
    status: 200,
    description: "Onboarding manager completed successfully",
    schema: {
      example: {
        message: "Onboarding manager completed successfully",
      },
    },
  })
  @ApiOperation({
    summary: "Onboarding manager",
    description: "Completes the onboarding process for a manager.",
  })
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post("onboarding-manager")
  async onboardingManager(
    @Body() dto: OnboadingManagerDto,
    @Request() req: Request,
  ): Promise<{ message: string }> {
    return await this.authService.onboardingManager(dto, req.user.id);
  }
}
