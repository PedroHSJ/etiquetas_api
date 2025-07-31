import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserWorkspaceEntity } from "./entities/user-workspace.entity";
import { UserWorkspaceService } from "./user-workspace.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserWorkspaceEntity]),
    ],
    controllers: [],
    providers: [UserWorkspaceService],
    exports: [UserWorkspaceService],
})
export class UserWorkspaceModule {}