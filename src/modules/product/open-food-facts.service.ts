import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { Product } from "./entities/product.entity";
import { ProductSubgroup } from "../product-subgroup/entities/product-subgroup.entity";
import { Unit } from "./entities/unit.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ProductGroup } from "../product-groups/entities/product-groups.entity";
import { CategoryMapper } from "./helper/category-mapper";
import { Transactional } from "typeorm-transactional";
export class OpenFoodFactsProduct {
  @ApiProperty({
    description: "Código de barras do produto",
    example: "7891000100103",
  })
  code: string;

  @ApiProperty({
    description: "Nome do produto",
    example: "Chocolate Nestlé",
    required: false,
  })
  product_name?: string;

  @ApiProperty({
    description: "Nome do produto em português",
    example: "Chocolate Nestlé",
    required: false,
  })
  product_name_pt?: string;

  @ApiProperty({
    description: "Marcas do produto",
    example: "Nestlé",
    required: false,
  })
  brands?: string;

  @ApiProperty({
    description: "Categorias do produto",
    example: "Chocolates, Doces",
    required: false,
  })
  categories?: string;

  @ApiProperty({
    description: "Tags de categoria",
    example: ["pt:chocolates", "en:sweets"],
    required: false,
  })
  categories_tags?: string[];

  @ApiProperty({
    description: "Lista de ingredientes",
    example: "Açúcar, cacau, leite em pó...",
    required: false,
  })
  ingredients_text?: string;

  @ApiProperty({
    description: "Lista de ingredientes em português",
    example: "Açúcar, cacau, leite em pó...",
    required: false,
  })
  ingredients_text_pt?: string;

  @ApiProperty({
    description: "Informações nutricionais por 100g",
    required: false,
  })
  nutriments?: {
    energy_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sodium_100g?: number;
    sugars_100g?: number;
  };

  @ApiProperty({
    description: "URL da imagem do produto",
    example:
      "https://images.openfoodfacts.org/images/products/789/100/010/0103/front_pt.jpg",
    required: false,
  })
  image_url?: string;

  @ApiProperty({
    description: "URL da imagem frontal do produto",
    example:
      "https://images.openfoodfacts.org/images/products/789/100/010/0103/front_pt.jpg",
    required: false,
  })
  image_front_url?: string;

  @ApiProperty({
    description: "Quantidade do produto",
    example: "100g",
    required: false,
  })
  quantity?: string;

  @ApiProperty({
    description: "Embalagem do produto",
    example: "Plástico, Papel",
    required: false,
  })
  packaging?: string;

  @ApiProperty({
    description: "Tags de embalagem",
    example: ["pt:plastico", "en:plastic"],
    required: false,
  })
  packaging_tags?: string[];

  @ApiProperty({
    description: "Países onde o produto é vendido",
    example: "Brasil",
    required: false,
  })
  countries?: string;

  @ApiProperty({
    description: "Tags de países",
    example: ["pt:brasil", "en:brazil"],
    required: false,
  })
  countries_tags?: string[];

  @ApiProperty({
    description: "Lojas onde o produto é vendido",
    example: "Extra, Pão de Açúcar",
    required: false,
  })
  stores?: string;

  @ApiProperty({
    description: "Nota nutricional (A, B, C, D, E)",
    example: "C",
    required: false,
  })
  nutriscore_grade?: string;

  @ApiProperty({
    description: "Grau de processamento NOVA (1-4)",
    example: 4,
    minimum: 1,
    maximum: 4,
    required: false,
  })
  nova_group?: number;

  @ApiProperty({
    description: "Timestamp da última modificação",
    example: 1640995200,
    required: false,
  })
  last_modified_t?: number;
}

export class SearchProductDto {
  @ApiProperty({
    description: "Código de barras para busca",
    example: "7891000100103",
    required: false,
  })
  barcode?: string;

  @ApiProperty({
    description: "Nome do produto para busca",
    example: "chocolate",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Marca do produto para busca",
    example: "Nestlé",
    required: false,
  })
  brand?: string;

  @ApiProperty({
    description: "Limite de resultados retornados",
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
    required: false,
  })
  limit?: number;
}

export class ProductSearchResult {
  @ApiProperty({
    description: "ID único do produto",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Nome do produto",
    example: "Chocolate Nestlé",
  })
  name: string;

  @ApiProperty({
    description: "Descrição detalhada do produto",
    example: "Chocolate ao leite com amendoim",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "ID do subgrupo do produto",
    example: 5,
  })
  productSubgroupId: number;

  @ApiProperty({
    description: "ID da unidade padrão",
    example: 1,
  })
  defaultUnitId: number;

  @ApiProperty({
    description: "Código de barras",
    example: "7891000100103",
    required: false,
  })
  barcode?: string;

  @ApiProperty({
    description: "Tags de categoria separadas por vírgula",
    example: "chocolates,doces,sobremesas",
    required: false,
  })
  categoriesTags?: string;

  @ApiProperty({
    description: "URL da imagem principal do produto",
    example:
      "https://images.openfoodfacts.org/images/products/789/100/010/0103/front_pt.jpg",
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Status ativo do produto",
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: "Data de criação do registro",
    example: "2023-12-01T10:30:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Data da última atualização",
    example: "2023-12-15T14:45:00Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Indica se o produto está em cache local",
    example: true,
  })
  cached: boolean;
}

@Injectable()
export class OpenFoodFactsService {
  private readonly logger = new Logger(OpenFoodFactsService.name);
  private readonly baseUrl = "https://br.openfoodfacts.org";
  private readonly categoryMapper = new CategoryMapper();

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductSubgroup)
    private readonly subgroupRepository: Repository<ProductSubgroup>,
    @InjectRepository(ProductGroup)
    private readonly groupRepository: Repository<ProductGroup>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  /**
   * Busca produto por código de barras
   * Estratégia: Local primeiro, depois Open Food Facts
   */
  // async findProductByBarcode(
  //   barcode: string,
  // ): Promise<ProductSearchResult | null> {
  //   this.logger.log(`Buscando produto por código de barras: ${barcode}`);

  //   // 1. Busca no banco local primeiro
  //   const localProduct = await this.findLocalProductByBarcode(barcode);
  //   if (localProduct) {
  //     this.logger.log(
  //       `Produto encontrado no banco local: ${localProduct.name}`,
  //     );
  //     return {
  //       id: localProduct.id,
  //       name: localProduct.name,
  //       description: localProduct.description,
  //       productSubgroupId: localProduct.productSubgroup?.id || 0,
  //       defaultUnitId: localProduct.defaultUnit?.id || 0,
  //       barcode: localProduct.barcode,
  //       categoriesTags: localProduct.categoriesTags,
  //       imageUrl: localProduct.imageUrl,
  //       active: localProduct.active,
  //       createdAt: localProduct.createdAt,
  //       updatedAt: localProduct.updatedAt,
  //       cached: true,
  //     };
  //   }

  //   // 2. Busca no Open Food Facts
  //   this.logger.log(
  //     `Produto não encontrado localmente, buscando no Open Food Facts...`,
  //   );
  //   const offProduct = await this.fetchProductFromOFF(barcode);

  //   if (!offProduct) {
  //     this.logger.log(`Produto não encontrado no Open Food Facts: ${barcode}`);
  //     return null;
  //   }

  //   // 3. Salva no banco local
  //   const savedProduct = await this.saveProductFromOFF(offProduct);

  //   if (savedProduct) {
  //     this.logger.log(`Produto salvo no banco local: ${savedProduct.name}`);
  //     return {
  //       id: savedProduct.id,
  //       name: savedProduct.name,
  //       description: savedProduct.description,
  //       productSubgroupId: savedProduct.productSubgroup?.id || 0,
  //       defaultUnitId: savedProduct.defaultUnit?.id || 0,
  //       barcode: savedProduct.barcode,
  //       categoriesTags: offProduct.categories_tags?.join(","),
  //       imageUrl: offProduct.image_front_url || offProduct.image_url,
  //       active: savedProduct.active,
  //       createdAt: savedProduct.createdAt,
  //       updatedAt: savedProduct.updatedAt,
  //       cached: true,
  //     };
  //   }

  //   return null;
  // }

  /**
   * Busca produtos por nome
   * Estratégia: Local primeiro, depois Open Food Facts
   */
  // @Transactional()
  // async searchProducts(searchDto: SearchProductDto): Promise<Product[]> {
  //   this.logger.log(`Buscando produtos: ${JSON.stringify(searchDto)}`);

  //   const results: Product[] = [];

  //   // 1. Busca no banco local
  //   const localProducts = await this.searchLocalProducts(searchDto);
  //   results.push(...localProducts);

  //   // 2. Se não encontrou suficientes resultados locais, busca no Open Food Facts
  //   const limit = searchDto.limit || 10000;
  //   if (results.length < limit && searchDto.name) {
  //     this.logger.log(`Buscando produtos adicionais no Open Food Facts...`);
  //     const offProducts = await this.searchProductsInOFF(
  //       searchDto.name,
  //       limit - results.length,
  //     );

  //     for (const offProduct of offProducts) {
  //       // Verifica se já não existe localmente
  //       const existsLocally = await this.findLocalProductByBarcode(
  //         offProduct.code,
  //       );

  //       if (!existsLocally) {
  //         console.log("Produto não encontrado localmente, salvando...");
  //         // Salva no banco local
  //         const savedProduct = await this.saveProductFromOFF(offProduct);
  //         if (savedProduct) {
  //           results.push({
  //             ...savedProduct,
  //           });
  //         }
  //       }
  //     }
  //   }
  //   this.logger.log(`Retornando ${results.length} produtos encontrados`);
  //   console.log("results: ", results.length);
  //   return results.slice(0, limit);
  // }

  /**
   * Busca produto no banco local por código de barras
   */
  // private async findLocalProductByBarcode(
  //   barcode: string,
  // ): Promise<Product | null> {
  //   return await this.productRepository.findOne({
  //     where: { barcode },
  //     relations: ["productSubgroup", "defaultUnit"],
  //   });
  // }

  /**
   * Busca produtos no banco local por nome/marca
   */
  // private async searchLocalProducts(
  //   searchDto: SearchProductDto,
  // ): Promise<Product[]> {
  //   // const queryBuilder = this.productRepository
  //   //   .createQueryBuilder("product")
  //   //   .leftJoinAndSelect("product.productSubgroup", "subgroup")
  //   //   .leftJoinAndSelect("product.defaultUnit", "unit")
  //   //   .where("product.active = :active", { active: true });

  //   // if (searchDto.name) {
  //   //   queryBuilder.andWhere("LOWER(product.name) LIKE LOWER(:name)", {
  //   //     name: `%${searchDto.name}%`,
  //   //   });
  //   // }

  //   // if (searchDto.barcode) {
  //   //   queryBuilder.andWhere("product.barcode = :barcode", {
  //   //     barcode: searchDto.barcode,
  //   //   });
  //   // }

  //   // return await queryBuilder.limit(searchDto.limit || 10).getMany();
  //   return await this.productRepository.find({
  //     where: [
  //       { name: ILike(`%${searchDto.name || ""}%`), active: true },
  //       { barcode: searchDto.barcode, active: true },
  //     ],
  //     relations: {
  //       productSubgroup: true,
  //       defaultUnit: true,
  //     },
  //     take: searchDto.limit || 10,
  //   });
  // }

  /**
   * Busca produto no Open Food Facts por código de barras
   */
  private async fetchProductFromOFF(
    barcode: string,
  ): Promise<OpenFoodFactsProduct | null> {
    try {
      const url = `${this.baseUrl}/api/v0/product/${barcode}.json`;
      this.logger.debug(`Buscando no Open Food Facts: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
          headers: {
            "User-Agent":
              "GenericSaaS/1.0 (https://github.com/PedroHSJ/generic_saas)",
          },
        }),
      );
      console.log(response.data.product);

      if (response.data.status === 1 && response.data.product) {
        return response.data.product as OpenFoodFactsProduct;
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar produto no Open Food Facts: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Busca produtos no Open Food Facts por nome
   */
  private async searchProductsInOFF(
    searchTerm: string,
    limit: number = 10000,
  ): Promise<OpenFoodFactsProduct[]> {
    try {
      const url = `${this.baseUrl}/cgi/search.pl`;
      const params = {
        search_terms: searchTerm,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: limit,
        countries: "Brasil", // Prioriza produtos brasileiros
      };

      this.logger.debug(`Buscando produtos no Open Food Facts: ${searchTerm}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params,
          timeout: 15000,
          headers: {
            "User-Agent": `GenericSaaS/${new Date().toISOString()} (https://github.com/PedroHSJ/generic_saas)`,
          },
        }),
      );
      // this.logger.debug(
      //   `Resposta do Open Food Facts: ${JSON.stringify(response.data)}`,
      // );
      this.logger.debug(
        `Quantidade de produtos encontrados: ${response.data.products?.length}`,
      );
      if (response.data.products) {
        return response.data.products as OpenFoodFactsProduct[];
      }

      return [];
    } catch (error) {
      this.logger.error(
        `Erro ao buscar produtos no Open Food Facts: ${error.message}`,
      );
      return [];
    }
  }

  /**
   * Salva produto do Open Food Facts no banco local
   */
  // private async saveProductFromOFF(
  //   offProduct: OpenFoodFactsProduct,
  // ): Promise<Product | null> {
  //   try {
  //     // Busca ou cria subgrupo baseado na categoria
  //     const subgroup = await this.getOrCreateSubgroup(offProduct);

  //     // Busca unidade padrão (ex: "100g", "1L", etc.)
  //     const unitFromOFF = this.extractUnitFromOFF(offProduct);
  //     const unit = unitFromOFF
  //       ? await this.unitRepository.findOne({
  //           where: { abbreviation: unitFromOFF },
  //         })
  //       : await this.unitRepository.findOne({
  //           where: { name: "Não especificado" }, // Fallback para unidade padrão
  //         });

  //     if (!subgroup || !unit) {
  //       this.logger.error("Não foi possível obter subgrupo ou unidade padrão");
  //       return null;
  //     }

  //     // Monta o nome do produto
  //     const productName = this.extractProductName(offProduct);

  //     if (!productName) {
  //       this.logger.error("Nome do produto não encontrado");
  //       return null;
  //     }

  //     // Cria o produto
  //     const product = this.productRepository.create({
  //       name: productName.substring(0, 200), // Limita o tamanho
  //       description: this.createProductDescription(offProduct),
  //       defaultUnitId: unit.id,
  //       barcode: offProduct.code,
  //       productSubgroup: subgroup,
  //       defaultUnit: unit,
  //       active: true,
  //       imageUrl: offProduct.image_front_url || offProduct.image_url,
  //       categoriesTags: offProduct.categories_tags?.join(",") || "",
  //       productSubgroupId: subgroup.id,
  //       quantity: offProduct["product_quantity"] || 0,
  //     });

  //     const savedProduct = await this.productRepository.save(product);
  //     this.logger.log(`Produto salvo do Open Food Facts: ${savedProduct.name}`);

  //     return savedProduct;
  //   } catch (error) {
  //     this.logger.error(
  //       `Erro ao salvar produto do Open Food Facts: ${error.message}`,
  //     );
  //     return null;
  //   }
  // }

  /**
   * Busca ou cria subgrupo baseado na categoria do Open Food Facts
   * Agora usando o CategoryMapper para mapeamento inteligente
   */
  private async getOrCreateSubgroup(
    offProduct: OpenFoodFactsProduct,
  ): Promise<ProductSubgroup | null> {
    try {
      // Usa o CategoryMapper para extrair informações de categoria
      const categoryInfo = this.categoryMapper.extractCategoryInfo(offProduct);

      // Se não conseguiu extrair das tags, tenta pelo nome do produto
      if (
        !categoryInfo.group ||
        categoryInfo.group === "Alimentos Industrializados"
      ) {
        const nameBasedCategory = this.categoryMapper.extractByProductName(
          offProduct.product_name_pt || offProduct.product_name || "",
        );

        if (nameBasedCategory.group !== "Alimentos Industrializados") {
          categoryInfo.group = nameBasedCategory.group;
          categoryInfo.subgroup = nameBasedCategory.subgroup;
        }
      }

      this.logger.debug(`Categoria extraída: ${JSON.stringify(categoryInfo)}`);

      // Busca ou cria o grupo
      let group = await this.groupRepository.findOne({
        where: { name: categoryInfo.group },
      });

      if (!group) {
        group = await this.groupRepository.save({
          name: categoryInfo.group,
          description: `Grupo de produtos ${categoryInfo.group}`,
          color: this.getGroupColor(categoryInfo.group),
          icon: this.getGroupIcon(categoryInfo.group),
          active: true,
        });
        this.logger.log(`Novo grupo criado: ${categoryInfo.group}`);
      }

      // Define o nome do subgrupo
      const subgroupName =
        categoryInfo.subgroup || `${categoryInfo.group} Diversos`;

      // Busca ou cria o subgrupo
      let subgroup = await this.subgroupRepository.findOne({
        where: {
          name: subgroupName,
          productGroupId: group.id,
        },
      });

      if (!subgroup) {
        subgroup = await this.subgroupRepository.save({
          name: subgroupName,
          description: `Produtos da categoria ${subgroupName} (Open Food Facts)`,
          productGroupId: group.id,
          active: true,
        });
        this.logger.log(`Novo subgrupo criado: ${subgroupName}`);
      }

      return subgroup;
    } catch (error) {
      this.logger.error(`Erro ao buscar/criar subgrupo: ${error.message}`);
      return null;
    }
  }

  /**
   * Define cor para o grupo baseado no nome
   */
  private getGroupColor(groupName: string): string {
    const colorMap: Record<string, string> = {
      "Carnes e Proteínas": "#DC2626",
      "Vegetais e Verduras": "#16A34A",
      Frutas: "#EA580C",
      "Grãos e Cereais": "#A16207",
      Laticínios: "#2563EB",
      Bebidas: "#0891B2",
      "Óleos e Gorduras": "#CA8A04",
      Panificação: "#92400E",
      "Condimentos e Molhos": "#7C2D12",
      "Doces e Sobremesas": "#BE185D",
      "Snacks e Aperitivos": "#7C3AED",
      "Produtos Congelados": "#0F766E",
      "Conservas e Enlatados": "#4338CA",
      "Produtos Funcionais": "#059669",
      "Cereais Matinais": "#D97706",
      "Massas e Farináceos": "#B45309",
      "Alimentos Industrializados": "#6B7280",
    };

    return colorMap[groupName] || "#6B7280";
  }

  /**
   * Define o ícone para o grupo baseado no nome.
   */
  private getGroupIcon(groupName: string): string {
    const iconMap: Record<string, string> = {
      "Carnes e Proteínas": "meat",
      "Vegetais e Verduras": "leaf",
      Frutas: "apple",
      "Grãos e Cereais": "grain",
      Laticínios: "milk",
      Bebidas: "cup",
      "Óleos e Gorduras": "oil",
      Panificação: "bread",
      "Condimentos e Molhos": "bottle",
      "Doces e Sobremesas": "candy",
      "Snacks e Aperitivos": "chips",
      "Produtos Congelados": "snowflake",
      "Conservas e Enlatados": "can",
      "Produtos Funcionais": "pill",
      "Cereais Matinais": "bowl",
      "Massas e Farináceos": "spaghetti",
      "Alimentos Industrializados": "factory",
    };

    return iconMap[groupName] || "box"; // Retorna "box" como padrão caso o grupo não esteja mapeado.
  }

  /**
   * Extrai nome do produto do Open Food Facts
   */
  private extractProductName(offProduct: OpenFoodFactsProduct): string | null {
    const name = offProduct.product_name_pt || offProduct.product_name || null;
    return name ? name.trim().toLocaleUpperCase("pt-BR") : null;
  }

  /**
   * Extrai marca do produto
   */
  private extractBrandFromOFF(
    offProduct: OpenFoodFactsProduct,
  ): string | undefined {
    return offProduct.brands?.split(",")[0]?.trim();
  }

  /**
   * Extrai categoria do produto usando o CategoryMapper
   */
  private extractCategoryFromOFF(offProduct: OpenFoodFactsProduct): string {
    const categoryInfo = this.categoryMapper.extractCategoryInfo(offProduct);

    // Se não conseguiu extrair das tags, tenta pelo nome
    if (
      !categoryInfo.subgroup ||
      categoryInfo.group === "Alimentos Industrializados"
    ) {
      const nameBasedCategory = this.categoryMapper.extractByProductName(
        offProduct.product_name_pt || offProduct.product_name || "",
      );
      return (
        nameBasedCategory.subgroup ||
        nameBasedCategory.group ||
        "Alimentos Diversos"
      );
    }

    return categoryInfo.subgroup || categoryInfo.group || "Alimentos Diversos";
  }

  /**
   * Extrai a unidade do produto do Open Food Facts.
   * Exemplo: "100g", "1L", etc.
   */
  private extractUnitFromOFF(offProduct: OpenFoodFactsProduct): string | null {
    console.log(offProduct["product_quantity_unit"]);

    // Primeiro tenta usar o campo específico
    if (offProduct["product_quantity_unit"]) {
      return offProduct["product_quantity_unit"];
    }

    // Se não tiver, tenta extrair da quantidade
    if (offProduct["quantity"]) {
      const quantity = offProduct["quantity"];

      // Regex para extrair a unidade (letras no final da string)
      const unitMatch = quantity.match(/([a-zA-Z]+)$/);
      if (unitMatch) {
        return unitMatch[1].toLowerCase(); // Retorna em minúsculas (ml, g, kg, etc.)
      }

      // Fallback: tenta encontrar padrões comuns
      const commonUnits = ["ml", "l", "g", "kg", "mg", "oz", "lb", "cl", "dl"];
      for (const unit of commonUnits) {
        if (quantity.toLowerCase().includes(unit)) {
          return unit;
        }
      }
    }

    if (offProduct["nutrition_data_per"]) {
      // Se tiver o campo de dados nutricionais, tenta extrair a unidade
      const nutritionDataPer = offProduct["nutrition_data_per"];
      if (nutritionDataPer) {
        const unitMatch = nutritionDataPer.match(/([a-zA-Z]+)$/);
        if (unitMatch) {
          return unitMatch[1].toLowerCase();
        }
      }
    }

    return null; // Retorna null se não conseguir extrair
  }

  /**
   * Cria uma descrição detalhada do produto com base nos dados do Open Food Facts.
   */
  private createProductDescription(offProduct: OpenFoodFactsProduct): string {
    const descriptionParts: string[] = [];

    if (offProduct.product_name_pt || offProduct.product_name) {
      descriptionParts.push(
        `Nome: ${offProduct.product_name_pt || offProduct.product_name}`,
      );
    }

    if (offProduct.brands) {
      descriptionParts.push(`Marca: ${offProduct.brands}`);
    }

    if (offProduct.categories) {
      descriptionParts.push(`Categorias: ${offProduct.categories}`);
    }

    if (offProduct.ingredients_text_pt || offProduct.ingredients_text) {
      descriptionParts.push(
        `Ingredientes: ${
          offProduct.ingredients_text_pt || offProduct.ingredients_text
        }`,
      );
    }

    if (offProduct.nutriments) {
      const nutriments = offProduct.nutriments;
      descriptionParts.push(
        `Informações nutricionais por 100g: Energia: ${
          nutriments.energy_100g || "N/A"
        }kcal, Proteínas: ${nutriments.proteins_100g || "N/A"}g, Carboidratos: ${
          nutriments.carbohydrates_100g || "N/A"
        }g, Gorduras: ${nutriments.fat_100g || "N/A"}g, Fibras: ${
          nutriments.fiber_100g || "N/A"
        }g, Sódio: ${nutriments.sodium_100g || "N/A"}mg, Açúcares: ${
          nutriments.sugars_100g || "N/A"
        }g`,
      );
    }

    return descriptionParts.join("\n");
  }

  /**
   * Busca produtos mais populares por categoria
   */
  // async getPopularProductsByCategory(
  //   category: string,
  //   limit: number = 10000,
  // ): Promise<ProductSearchResult[]> {
  //   try {
  //     const url = `${this.baseUrl}/category/${category}.json`;
  //     const params = {
  //       page_size: limit,
  //       sort_by: "popularity",
  //     };

  //     const response = await firstValueFrom(
  //       this.httpService.get(url, {
  //         params,
  //         timeout: 15000,
  //         headers: {
  //           "User-Agent":
  //             "GenericSaaS/1.0 (https://github.com/PedroHSJ/generic_saas)",
  //         },
  //       }),
  //     );

  //     if (response.data.products) {
  //       const results: ProductSearchResult[] = [];

  //       for (const offProduct of response.data.products) {
  //         const existingProduct = await this.findLocalProductByBarcode(
  //           offProduct.code,
  //         );
  //         if (!existingProduct) {
  //           const savedProduct = await this.saveProductFromOFF(offProduct);
  //           if (savedProduct) {
  //             results.push({
  //               id: savedProduct.id,
  //               name: savedProduct.name,
  //               description: savedProduct.description,
  //               productSubgroupId: savedProduct.productSubgroup?.id || 0,
  //               defaultUnitId: savedProduct.defaultUnit?.id || 0,

  //               categoriesTags: offProduct.categories_tags?.join(","),

  //               imageUrl: offProduct.image_front_url || offProduct.image_url,

  //               active: savedProduct.active,
  //               createdAt: savedProduct.createdAt,
  //               updatedAt: savedProduct.updatedAt,

  //               cached: true,
  //             });
  //           }
  //         }
  //       }

  //       return results;
  //     }

  //     return [];
  //   } catch (error) {
  //     this.logger.error(`Erro ao buscar produtos populares: ${error.message}`);
  //     return [];
  //   }
  // }
}
