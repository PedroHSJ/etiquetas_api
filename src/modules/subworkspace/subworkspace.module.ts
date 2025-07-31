import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubworkspaceEntity } from "./entities/subworkspace.entity";
import { SubworkspaceService } from "./subworkspace.service";
import { SubworkspaceController } from "./subworkspace.controller";
import { WorkspaceEntity } from "@/modules/workspace/entities/workspace.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SubworkspaceEntity, WorkspaceEntity])],
  providers: [SubworkspaceService],
  controllers: [SubworkspaceController],
  exports: [SubworkspaceService],
})
export class SubworkspaceModule {}
