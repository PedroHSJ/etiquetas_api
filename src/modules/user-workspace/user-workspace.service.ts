import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserWorkspaceEntity } from "./entities/user-workspace.entity";
import { Repository } from "typeorm";
import { I18nService } from "nestjs-i18n";
import { CreateUserWorkspaceDto } from "./dto/create-user-workspace.dto";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { UserWorkspaceDto } from "./dto/user-workspace.dto";
import { plainToInstance } from "class-transformer";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserWorkspaceService {
  constructor(
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    @Inject(I18nService)
    private readonly i18n: I18nService,
  ) {}

  @Transactional()
  async create(
    createUserWorkspaceDto: CreateUserWorkspaceDto,
  ): Promise<IApiResponse<UserWorkspaceDto>> {
    try {
      const newUserWorkspaceEntity = await this.userWorkspaceRepository.save(
        this.userWorkspaceRepository.create(createUserWorkspaceDto),
      );

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserWorkspaceDto, newUserWorkspaceEntity),
      };
    } catch (error) {
      throw error;
    }
  }

  async listByUserId(
    userId: number,
  ): Promise<IApiResponse<UserWorkspaceDto[]>> {
    try {
      const userWorkspaces = await this.userWorkspaceRepository.find({
        where: { userId },
      });

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserWorkspaceDto, userWorkspaces, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async listByWorkspaceId(
    workspaceId: number,
  ): Promise<IApiResponse<UserWorkspaceDto[]>> {
    try {
      const userWorkspaces = await this.userWorkspaceRepository.find({
        where: { workspaceId },
      });

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserWorkspaceDto, userWorkspaces, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }
}
