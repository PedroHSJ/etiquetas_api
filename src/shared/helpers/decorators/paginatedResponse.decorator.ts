import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

/**
 * Decorator para o swagger exibir a prévia da resposta paginada do nestjs-paginate
 *@param {object} entity
 */
export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(dataDto) },
              },
              meta: {
                type: "object",
                properties: {
                  itemsPerPage: { type: "number" },
                  totalItems: { type: "number" },
                  currentPage: { type: "number" },
                  totalPages: { type: "number" },
                },
              },
            },
          },
        ],
      },
    }),
  );
