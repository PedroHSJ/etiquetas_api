import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateUserWorkspaceDto {
    @ApiProperty({
        description: "Id of the user for relationship",
        example: "111",
    })
    @IsNumber({}, {
        message: i18nValidationMessage("events.validation.mustBeNumber"),
    })
    @IsNotEmpty({
        message: i18nValidationMessage("events.validation.required"),
    })
    userId: number;

    @ApiProperty({
        description: "Id of the workspace for relationship",
        example: "222",
    })
    @IsNumber({}, {
        message: i18nValidationMessage("events.validation.mustBeNumber"),
    })
    @IsNotEmpty({
        message: i18nValidationMessage("events.validation.required"),
    })
    workspaceId: number;
}