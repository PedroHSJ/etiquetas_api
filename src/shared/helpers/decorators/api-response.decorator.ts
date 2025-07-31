import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export const ApiResponseArrayWrapper = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        properties: {
          message: { type: "string" },
          data: {
            type: "array",
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
};
