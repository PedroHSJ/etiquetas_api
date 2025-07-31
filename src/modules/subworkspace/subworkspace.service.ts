import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubworkspaceEntity } from "./entities/subworkspace.entity";
import { CreateSubworkspaceDto } from "./dto/create-subworkspace.dto";
import { UpdateSubworkspaceDto } from "./dto/update-subworkspace.dto";
import { WorkspaceEntity } from "@/modules/workspace/entities/workspace.entity";
import { SubworkspaceDto } from "./dto/subworkspace.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class SubworkspaceService {
  constructor(
    @InjectRepository(SubworkspaceEntity)
    private readonly subworkspaceRepository: Repository<SubworkspaceEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  async create(
    dto: CreateSubworkspaceDto,
    userId: number,
  ): Promise<SubworkspaceDto> {
    try {
      const workspace = await this.workspaceRepository.findOneByOrFail({
        id: dto.workspaceId,
      });
      const subworkspace = this.subworkspaceRepository.create({
        name: dto.name,
        workspace,
        createdBy: userId,
      });
      const subwsEntity = await this.subworkspaceRepository.save(subworkspace);
      return plainToInstance(SubworkspaceDto, subwsEntity, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<SubworkspaceEntity[]> {
    return await this.subworkspaceRepository.find({ relations: ["workspace"] });
  }

  async findOne(id: number): Promise<SubworkspaceDto> {
    try {
      const subwsEntity = await this.subworkspaceRepository.findOneOrFail({
        where: { id },
        relations: ["workspace"],
      });
      return plainToInstance(SubworkspaceDto, subwsEntity, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findByName(
    name: string,
    workspaceId: number,
  ): Promise<SubworkspaceEntity | null> {
    try {
      return await this.subworkspaceRepository.findOne({
        where: { name, workspaceId },
        relations: ["workspace"],
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    dto: UpdateSubworkspaceDto,
  ): Promise<SubworkspaceDto> {
    await this.subworkspaceRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.subworkspaceRepository.delete(id);
  }

  async listByWorkspaceId(
    workspaceId: number,
    userId: number,
  ): Promise<SubworkspaceDto[]> {
    try {
      const subworkspaces = await this.subworkspaceRepository.find({
        where: {
          workspaceId,
          active: true,
          userSubworkspaces: {
            userId,
          },
        },
        order: { id: "ASC" },
        relations: {
          workspace: true,
          userSubworkspaces: true,
        },
      });

      return plainToInstance(SubworkspaceDto, subworkspaces, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
