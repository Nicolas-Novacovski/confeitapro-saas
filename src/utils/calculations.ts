import { Ingredient, MeasurementUnit, Recipe, RecipeFinancials } from '../types';

/**
 * Normaliza qualquer quantidade para a unidade base ('g', 'ml', ou 'un')
 */
export function normalizeToBaseQuantity(amount: number, unit: MeasurementUnit): { baseAmount: number; baseType: 'mass' | 'volume' | 'count' } {
  switch (unit) {
    case 'kg':
      return { baseAmount: amount * 1000, baseType: 'mass' };
    case 'g':
      return { baseAmount: amount, baseType: 'mass' };
    case 'l':
      return { baseAmount: amount * 1000, baseType: 'volume' };
    case 'ml':
      return { baseAmount: amount, baseType: 'volume' };
    case 'un':
    default:
      return { baseAmount: amount, baseType: 'count' };
  }
}

/**
 * Calcula o custo por unidade base ('g', 'ml', ou 'un') a partir do tamanho da embalagem e preço
 */
export function calculateCostPerBaseUnit(price: number, size: number, unit: MeasurementUnit): number {
  if (size <= 0 || price <= 0) return 0;
  const { baseAmount } = normalizeToBaseQuantity(size, unit);
  return price / baseAmount;
}

/**
 * Calcula o custo de uma porção de ingrediente usada na receita
 */
export function calculateIngredientPortionCost(
  ingredient: Ingredient | undefined,
  quantity: number,
  unit: MeasurementUnit
): number {
  if (!ingredient || quantity <= 0) return 0;

  const { baseAmount: requiredBase } = normalizeToBaseQuantity(quantity, unit);
  return requiredBase * ingredient.costPerBaseUnit;
}

/**
 * Calcula todos os indicadores financeiros e de precificação de uma receita
 */
export function calculateRecipeFinancials(
  recipe: Recipe,
  ingredientsMap: Map<string, Ingredient>,
  hourlyLaborRate: number = 25.0
): RecipeFinancials {
  // 1. Custos diretos de ingredientes
  let ingredientsCost = 0;
  recipe.ingredients.forEach((item) => {
    const ing = ingredientsMap.get(item.ingredientId);
    ingredientsCost += calculateIngredientPortionCost(ing, item.quantity, item.unit);
  });

  // 2. Custos de embalagens e descartáveis
  let packagingsCost = 0;
  recipe.packagings.forEach((pack) => {
    packagingsCost += (pack.quantity || 1) * (pack.unitCost || 0);
  });

  const directCost = ingredientsCost + packagingsCost;

  // 3. Custos indiretos / Custos invisíveis (gás, energia, água, produtos de limpeza)
  const overheadRate = Math.max(0, recipe.overheadPercentage || 15) / 100;
  const overheadCost = directCost * overheadRate;

  // 4. Mão de Obra (tempo em horas * valor da hora da confeiteira)
  const prepTimeHours = Math.max(0, recipe.prepTimeMinutes || 0) / 60;
  const effectiveHourlyRate = hourlyLaborRate > 0 ? hourlyLaborRate : 25;
  const laborCost = prepTimeHours * effectiveHourlyRate;

  // 5. Custo Total de Produção
  const totalCost = directCost + overheadCost + laborCost;

  // 6. Custo Unitário por porção/unidade
  const yieldAmount = Math.max(1, recipe.yieldAmount || 1);
  const costPerUnit = totalCost / yieldAmount;

  // 7. Preço Sugerido com base na Margem de Lucro Desejada
  const profitMarginDecimal = Math.max(0, recipe.desiredProfitMargin || 100) / 100;
  const suggestedSalePrice = totalCost * (1 + profitMarginDecimal);
  const suggestedPricePerUnit = suggestedSalePrice / yieldAmount;

  // 8. Lucro Líquido
  const netProfit = suggestedSalePrice - totalCost;
  const netProfitPerUnit = netProfit / yieldAmount;

  // Margem sobre a venda (% do preço final que é lucro puro)
  const marginRealPercentage = suggestedSalePrice > 0 ? (netProfit / suggestedSalePrice) * 100 : 0;

  // Ponto de equilíbrio (quantas unidades precisa vender para cobrir o custo total)
  const breakEvenUnits = suggestedPricePerUnit > 0 ? Math.ceil(totalCost / suggestedPricePerUnit) : 1;

  return {
    ingredientsCost,
    packagingsCost,
    directCost,
    overheadCost,
    laborCost,
    totalCost,
    costPerUnit,
    suggestedSalePrice,
    suggestedPricePerUnit,
    netProfit,
    netProfitPerUnit,
    marginRealPercentage,
    breakEvenUnits
  };
}

/**
 * Calculadora da Hora de Trabalho da Confeiteira
 * Fórmula: (Salário Desejado + Custos Fixos Mensais) / (Dias trabalhados no mês * Horas produtivas por dia)
 */
export function calculateHourlyRate(
  desiredMonthlySalary: number,
  monthlyFixedCosts: number,
  workDaysPerMonth: number = 22,
  productiveHoursPerDay: number = 6
): number {
  const totalMonthlyNeed = (desiredMonthlySalary || 0) + (monthlyFixedCosts || 0);
  const totalMonthlyHours = Math.max(1, (workDaysPerMonth || 22) * (productiveHoursPerDay || 6));
  return totalMonthlyNeed / totalMonthlyHours;
}
