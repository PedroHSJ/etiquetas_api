// Função para mapear categorias do Open Food Facts para grupos e subgrupos
export class CategoryMapper {
  public groupMappings: Record<string, string>;
  public subgroupMappings: Record<string, string>;

  constructor() {
    // Mapeamento baseado na sua estrutura de dados
    this.groupMappings = {
      "en:meats": "Carnes e Proteínas",
      "en:beef": "Carnes e Proteínas",
      "en:pork": "Carnes e Proteínas",
      "en:poultry": "Carnes e Proteínas",
      "en:fish": "Carnes e Proteínas",
      "en:eggs": "Carnes e Proteínas",
      "en:sausages": "Carnes e Proteínas",

      "en:plant-based-foods": "Vegetais e Verduras",
      "en:fresh-vegetables": "Vegetais e Verduras",
      "en:leafy-vegetables": "Vegetais e Verduras",
      "en:herbs": "Vegetais e Verduras",
      "en:root-vegetables": "Vegetais e Verduras",

      "en:fruits": "Frutas",
      "en:citrus-fruits": "Frutas",
      "en:tropical-fruits": "Frutas",
      "en:temperate-climate-fruits": "Frutas",
      "en:dried-fruits": "Frutas",

      "en:cereals-and-potatoes": "Grãos e Cereais",
      "en:rice": "Grãos e Cereais",
      "en:legumes": "Grãos e Cereais",
      "en:corn": "Grãos e Cereais",
      "en:wheat": "Grãos e Cereais",
      "en:cereals": "Grãos e Cereais",

      "en:dairy": "Laticínios",
      "en:milk": "Laticínios",
      "en:cheese": "Laticínios",
      "en:yogurt": "Laticínios",
      "en:butter": "Laticínios",

      "en:beverages": "Bebidas",
      "en:waters": "Bebidas",
      "en:fruit-juices": "Bebidas",
      "en:sodas": "Bebidas",
      "en:hot-beverages": "Bebidas",

      "en:fats": "Óleos e Gorduras",
      "en:vegetable-oils": "Óleos e Gorduras",
      "en:olive-oils": "Óleos e Gorduras",
      "en:animal-fats": "Óleos e Gorduras",

      "en:breads": "Panificação",
      "en:bread": "Panificação",
      "en:flour": "Panificação",
      "en:baking-aids": "Panificação",

      "en:condiments": "Condimentos e Molhos",
      "en:sugar-and-sweeteners": "Condimentos e Molhos",
      "en:spices": "Condimentos e Molhos",
      "en:sauces": "Condimentos e Molhos",
      "en:vinegars": "Condimentos e Molhos",
      "en:broths": "Condimentos e Molhos",
      "en:seasonings": "Condimentos e Molhos",

      "en:sweet-snacks": "Doces e Sobremesas",
      "en:chocolate": "Doces e Sobremesas",
      "en:sweets": "Doces e Sobremesas",
      "en:ice-cream": "Doces e Sobremesas",
      "en:cakes": "Doces e Sobremesas",
      "en:desserts": "Doces e Sobremesas",
      "en:traditional-sweets": "Doces e Sobremesas",

      "en:salty-snacks": "Snacks e Aperitivos",
      "en:biscuits": "Snacks e Aperitivos",
      "en:crackers": "Snacks e Aperitivos",
      "en:chips": "Snacks e Aperitivos",
      "en:nuts": "Snacks e Aperitivos",
      "en:popcorn": "Snacks e Aperitivos",
      "en:cereal-bars": "Snacks e Aperitivos",

      "en:frozen-foods": "Produtos Congelados",
      "en:frozen-meat": "Produtos Congelados",
      "en:frozen-vegetables": "Produtos Congelados",
      "en:frozen-pasta": "Produtos Congelados",
      "en:frozen-bread": "Produtos Congelados",
      "en:frozen-fruits": "Produtos Congelados",
      "en:frozen-meals": "Produtos Congelados",

      "en:canned-foods": "Conservas e Enlatados",
      "en:canned-vegetables": "Conservas e Enlatados",
      "en:canned-fruits": "Conservas e Enlatados",
      "en:canned-fish": "Conservas e Enlatados",
      "en:tomato-based-sauces": "Conservas e Enlatados",
      "en:canned-legumes": "Conservas e Enlatados",

      "en:functional-foods": "Produtos Funcionais",
      "en:dietary-supplements": "Produtos Funcionais",
      "en:diet-foods": "Produtos Funcionais",
      "en:organic": "Produtos Funcionais",
      "en:probiotics": "Produtos Funcionais",
      "en:whole-grain": "Produtos Funcionais",
      "en:plant-based": "Produtos Funcionais",

      "en:breakfast-cereals": "Cereais Matinais",
      "en:sweetened-cereals": "Cereais Matinais",
      "en:whole-grain-cereals": "Cereais Matinais",
      "en:baby-cereals": "Cereais Matinais",
      "en:seeds": "Cereais Matinais",

      "en:pasta": "Massas e Farináceos",
      "en:fresh-pasta": "Massas e Farináceos",
      "en:special-pasta": "Massas e Farináceos",
      "en:tapioca-products": "Massas e Farináceos",

      "en:prepared-foods": "Alimentos Industrializados",
      "en:miscellaneous": "Alimentos Industrializados",
    };

    this.subgroupMappings = {
      "en:beef": "Carnes Bovinas",
      "en:pork": "Carnes Suínas",
      "en:poultry": "Carnes de Frango",
      "en:fish": "Peixes e Frutos do Mar",
      "en:eggs": "Ovos",
      "en:sausages": "Embutidos",

      "en:fresh-vegetables": "Legumes",
      "en:leafy-vegetables": "Verduras Folhosas",
      "en:herbs": "Temperos Verdes",
      "en:root-vegetables": "Tubérculos",

      "en:citrus-fruits": "Frutas Cítricas",
      "en:tropical-fruits": "Frutas Tropicais",
      "en:temperate-climate-fruits": "Frutas de Clima Temperado",
      "en:dried-fruits": "Frutas Secas",

      "en:rice": "Arroz",
      "en:legumes": "Feijão",
      "en:corn": "Milho",
      "en:wheat": "Trigo",
      "en:cereals": "Outros Grãos",

      "en:milk": "Leites",
      "en:cheese": "Queijos",
      "en:yogurt": "Iogurtes",
      "en:butter": "Manteiga e Margarina",

      "en:waters": "Águas",
      "en:fruit-juices": "Sucos",
      "en:sodas": "Refrigerantes",
      "en:hot-beverages": "Bebidas Quentes",

      "en:vegetable-oils": "Óleos Vegetais",
      "en:olive-oils": "Azeites",
      "en:animal-fats": "Gorduras",

      "en:bread": "Pães",
      "en:flour": "Farinhas",
      "en:baking-aids": "Fermento e Aditivos",

      "en:sugar-and-sweeteners": "Sal e Açúcar",
      "en:spices": "Especiarias",
      "en:sauces": "Molhos",
      "en:vinegars": "Vinagres",
      "en:broths": "Caldos e Sopas",
      "en:seasonings": "Temperos Prontos",

      "en:chocolate": "Chocolates",
      "en:sweets": "Balas e Gomas",
      "en:ice-cream": "Sorvetes e Gelados",
      "en:cakes": "Bolos e Tortas",
      "en:desserts": "Pudins e Mousses",
      "en:traditional-sweets": "Doces Brasileiros",

      "en:biscuits": "Biscoitos Doces",
      "en:crackers": "Biscoitos Salgados",
      "en:chips": "Salgadinhos",
      "en:nuts": "Castanhas e Nozes",
      "en:popcorn": "Pipocas",
      "en:cereal-bars": "Barras de Cereal",

      "en:frozen-meat": "Carnes Congeladas",
      "en:frozen-vegetables": "Vegetais Congelados",
      "en:frozen-pasta": "Massas Congeladas",
      "en:frozen-bread": "Pães Congelados",
      "en:frozen-fruits": "Frutas Congeladas",
      "en:frozen-meals": "Pratos Prontos",

      "en:canned-vegetables": "Vegetais em Conserva",
      "en:canned-fruits": "Frutas em Calda",
      "en:canned-fish": "Peixes e Frutos do Mar Enlatados",
      "en:tomato-based-sauces": "Molhos e Extratos",
      "en:canned-legumes": "Grãos e Leguminosas em Conserva",

      "en:dietary-supplements": "Suplementos",
      "en:diet-foods": "Diet e Light",
      "en:organic": "Orgânicos",
      "en:probiotics": "Probióticos",
      "en:whole-grain": "Integrais",
      "en:plant-based": "Plant-Based",

      "en:sweetened-cereals": "Cereais Açucarados",
      "en:whole-grain-cereals": "Cereais Integrais",
      "en:baby-cereals": "Farinhas Especiais",
      "en:seeds": "Mix de Sementes",

      "en:pasta": "Massas Secas",
      "en:fresh-pasta": "Massas Frescas",
      "en:special-pasta": "Massas Especiais",
      "en:tapioca-products": "Biscoitos de Polvilho",

      "en:prepared-foods": "Produtos Processados",
      "en:miscellaneous": "Alimentos Diversos",
    };
  }

  // Função principal para extrair grupo e subgrupo
  extractCategoryInfo(offProduct) {
    const categories = offProduct.categories_tags || [];

    let group = null;
    let subgroup = null;

    // Procura por subgrupo primeiro (mais específico)
    for (const category of categories) {
      if (this.subgroupMappings[category]) {
        subgroup = this.subgroupMappings[category];
        // Encontra o grupo correspondente
        group = this.findGroupForSubgroup(category);
        break;
      }
    }

    // Se não encontrou subgrupo, procura apenas por grupo
    if (!group) {
      for (const category of categories) {
        if (this.groupMappings[category]) {
          group = this.groupMappings[category];
          break;
        }
      }
    }

    // Fallback para categoria genérica
    if (!group) {
      group = "Alimentos Industrializados";
      subgroup = "Alimentos Diversos";
    }

    return {
      group: group,
      subgroup: subgroup,
      originalCategories: categories,
    };
  }

  // Função auxiliar para encontrar grupo do subgrupo
  findGroupForSubgroup(subgroupCategory) {
    // Primeiro verifica se a categoria do subgrupo também está no mapeamento de grupos
    if (this.groupMappings[subgroupCategory]) {
      return this.groupMappings[subgroupCategory];
    }

    // Se não, usa lógica baseada no nome do subgrupo
    const subgroupName = this.subgroupMappings[subgroupCategory];

    // Mapeamento manual para casos específicos
    const subgroupToGroup = {
      "Carnes Bovinas": "Carnes e Proteínas",
      "Carnes Suínas": "Carnes e Proteínas",
      "Carnes de Frango": "Carnes e Proteínas",
      "Peixes e Frutos do Mar": "Carnes e Proteínas",
      Ovos: "Carnes e Proteínas",
      Embutidos: "Carnes e Proteínas",

      Legumes: "Vegetais e Verduras",
      "Verduras Folhosas": "Vegetais e Verduras",
      "Temperos Verdes": "Vegetais e Verduras",
      Tubérculos: "Vegetais e Verduras",

      "Frutas Cítricas": "Frutas",
      "Frutas Tropicais": "Frutas",
      "Frutas de Clima Temperado": "Frutas",
      "Frutas Secas": "Frutas",
      // ... adicione mais conforme necessário
    };

    return subgroupToGroup[subgroupName] || null;
  }

  // Função para buscar por texto livre (quando OFF não tem categoria específica)
  extractByProductName(productName) {
    const name = productName.toLowerCase();

    // Palavras-chave para identificação
    const keywords = {
      "Carnes e Proteínas": [
        "carne",
        "frango",
        "peixe",
        "ovo",
        "linguiça",
        "presunto",
      ],
      "Vegetais e Verduras": [
        "alface",
        "tomate",
        "cenoura",
        "batata",
        "cebola",
      ],
      Frutas: ["maçã", "banana", "laranja", "uva", "manga", "abacaxi"],
      "Grãos e Cereais": ["arroz", "feijão", "milho", "trigo", "aveia"],
      Laticínios: ["leite", "queijo", "iogurte", "manteiga"],
      Bebidas: ["água", "suco", "refrigerante", "café", "chá"],
      "Doces e Sobremesas": ["chocolate", "bala", "sorvete", "bolo", "doce"],
      "Snacks e Aperitivos": ["biscoito", "chips", "salgadinho", "amendoim"],
      Panificação: ["pão", "farinha", "fermento"],
    };

    for (const [group, words] of Object.entries(keywords)) {
      if (words.some((word) => name.includes(word))) {
        return {
          group: group,
          subgroup: null,
          method: "keyword_matching",
        };
      }
    }

    return {
      group: "Alimentos Industrializados",
      subgroup: "Alimentos Diversos",
      method: "fallback",
    };
  }
}
