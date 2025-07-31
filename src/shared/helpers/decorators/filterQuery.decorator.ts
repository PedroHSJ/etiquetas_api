import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

interface QueryParam {
  name: string;
  description: string;
  example: string;
  required?: boolean;
  schema?: object;
}

/**
 * Decorator para que o query param filter do nestjs-paginate funcione com o swagger
 *@param {QueryParam[]} queryParams
 */
export function FilterQuery(queryParams: QueryParam[]) {
  return applyDecorators(
    ...queryParams.map((queryParam) =>
      ApiQuery({
        name: queryParam.name,
        description: queryParam.description,
        required: queryParam.required ?? false,
        schema: {
          type: "string",
          example: queryParam.example,
          ...queryParam.schema, // Adiciona qualquer atributo adicional ao schema
        },
        ...queryParam, // Adiciona quaisquer outros atributos que foram passados
      }),
    ),
  );
}
