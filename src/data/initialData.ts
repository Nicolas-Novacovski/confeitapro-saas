import { Ingredient, Recipe, UserProfile } from '../types';
import { calculateCostPerBaseUnit } from '../utils/calculations';

export const INITIAL_USER: UserProfile = {
  uid: 'demo_user_123',
  email: 'confeiteira@docearte.com.br',
  displayName: 'Mariana Silva',
  bakeryName: 'Ateliê Doce Afeto & Confeitaria',
  phone: '(11) 98765-4321',
  pixKey: 'contato@doceafeto.com.br',
  hourlyLaborRate: 28.00, // R$ 28,00 por hora
  monthlyHoursTarget: 140, // 140 horas de produção por mês
  plan: 'free', // Começa no Free para demonstrar a conversão para Pro
  isDemo: true
};

export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: 'ing-1',
    name: 'Leite Condensado Moça',
    brand: 'Nestlé',
    packageSize: 395,
    packageUnit: 'g',
    packagePrice: 7.49,
    costPerBaseUnit: calculateCostPerBaseUnit(7.49, 395, 'g'),
    category: 'Laticínios',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-2',
    name: 'Creme de Leite 20% gordura',
    brand: 'Piracanjuba',
    packageSize: 200,
    packageUnit: 'g',
    packagePrice: 3.89,
    costPerBaseUnit: calculateCostPerBaseUnit(3.89, 200, 'g'),
    category: 'Laticínios',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-3',
    name: 'Chocolate Nobre Meio Amargo Callets',
    brand: 'Callebaut / Sicao',
    packageSize: 1000,
    packageUnit: 'g',
    packagePrice: 58.90,
    costPerBaseUnit: calculateCostPerBaseUnit(58.90, 1000, 'g'),
    category: 'Chocolates & Cacau',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-4',
    name: 'Cacau em Pó 100% Alcalino',
    brand: 'Melken Harald',
    packageSize: 500,
    packageUnit: 'g',
    packagePrice: 28.50,
    costPerBaseUnit: calculateCostPerBaseUnit(28.50, 500, 'g'),
    category: 'Chocolates & Cacau',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-5',
    name: 'Farinha de Trigo Especial sem Fermento',
    brand: 'Venturelli',
    packageSize: 1000,
    packageUnit: 'g',
    packagePrice: 6.20,
    costPerBaseUnit: calculateCostPerBaseUnit(6.20, 1000, 'g'),
    category: 'Farinhas & Açúcares',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-6',
    name: 'Açúcar Refinado Especial',
    brand: 'União',
    packageSize: 1000,
    packageUnit: 'g',
    packagePrice: 4.80,
    costPerBaseUnit: calculateCostPerBaseUnit(4.80, 1000, 'g'),
    category: 'Farinhas & Açúcares',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-7',
    name: 'Manteiga Extra Primeira Qualidade sem sal',
    brand: 'Aviação',
    packageSize: 200,
    packageUnit: 'g',
    packagePrice: 11.50,
    costPerBaseUnit: calculateCostPerBaseUnit(11.50, 200, 'g'),
    category: 'Gorduras & Óleos',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-8',
    name: 'Ovos Grandes Tipo Extra',
    brand: 'Granja do Sol',
    packageSize: 30,
    packageUnit: 'un',
    packagePrice: 22.00,
    costPerBaseUnit: calculateCostPerBaseUnit(22.00, 30, 'un'),
    category: 'Outros',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-9',
    name: 'Granulado Nobre Split Meio Amargo',
    brand: 'Callebaut',
    packageSize: 1000,
    packageUnit: 'g',
    packagePrice: 69.90,
    costPerBaseUnit: calculateCostPerBaseUnit(69.90, 1000, 'g'),
    category: 'Chocolates & Cacau',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ing-10',
    name: 'Morango Fresco Selecionado',
    brand: 'Produtor Local',
    packageSize: 250,
    packageUnit: 'g',
    packagePrice: 8.50,
    costPerBaseUnit: calculateCostPerBaseUnit(8.50, 250, 'g'),
    category: 'Frutas & Castanhas',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Cento de Brigadeiros Gourmet Tradicional Belga',
    category: 'Docinhos & Brigadeiros',
    yieldAmount: 100,
    yieldUnit: 'brigadeiros (18g)',
    prepTimeMinutes: 120, // 2 horas de preparo e enrolar
    overheadPercentage: 15, // 15% gás, luz, embalagem primária
    desiredProfitMargin: 120, // 120% de margem
    ingredients: [
      { id: 'ri-1', ingredientId: 'ing-1', quantity: 790, unit: 'g' }, // 2 latas leite condensado
      { id: 'ri-2', ingredientId: 'ing-2', quantity: 400, unit: 'g' }, // 2 caixas creme de leite
      { id: 'ri-3', ingredientId: 'ing-3', quantity: 200, unit: 'g' }, // chocolate nobre
      { id: 'ri-4', ingredientId: 'ing-4', quantity: 40, unit: 'g' },  // cacau 100%
      { id: 'ri-5', ingredientId: 'ing-7', quantity: 30, unit: 'g' },  // manteiga
      { id: 'ri-6', ingredientId: 'ing-9', quantity: 350, unit: 'g' }  // confeito split
    ],
    packagings: [
      { id: 'pk-1', name: 'Forminhas 4 pétalas marrom kraft', quantity: 100, unitCost: 0.12 },
      { id: 'pk-2', name: 'Caixa de transporte para 100 doces', quantity: 1, unitCost: 4.80 },
      { id: 'pk-3', name: 'Fita de cetim e tag personalizada', quantity: 1, unitCost: 1.50 }
    ],
    notes: 'Ponto ideal é quando o brigadeiro cai em blocos da espátula e abre caminho limpo no fundo da panela (ponto Moisés).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-2',
    title: 'Bolo Vulcão de Cenoura com Brigadeiro Suave',
    category: 'Bolos Decorados',
    yieldAmount: 12,
    yieldUnit: 'fatias generosas',
    prepTimeMinutes: 90, // 1h30
    overheadPercentage: 18, // forno a gás e batedeira
    desiredProfitMargin: 150, // 150% margem
    ingredients: [
      { id: 'ri-21', ingredientId: 'ing-8', quantity: 4, unit: 'un' },  // 4 ovos
      { id: 'ri-22', ingredientId: 'ing-6', quantity: 360, unit: 'g' }, // açúcar
      { id: 'ri-23', ingredientId: 'ing-5', quantity: 300, unit: 'g' }, // farinha de trigo
      { id: 'ri-24', ingredientId: 'ing-1', quantity: 592, unit: 'g' }, // 1.5 lata condensado cobertura
      { id: 'ri-25', ingredientId: 'ing-2', quantity: 300, unit: 'g' }, // 1.5 creme de leite
      { id: 'ri-26', ingredientId: 'ing-4', quantity: 50, unit: 'g' }   // cacau cobertura
    ],
    packagings: [
      { id: 'pk-21', name: 'Prato laminado dourado rígido n° 4', quantity: 1, unitCost: 3.20 },
      { id: 'pk-22', name: 'Caixa alta de acetato com tampa transparente', quantity: 1, unitCost: 7.90 },
      { id: 'pk-23', name: 'Laço pronto e adesivo lacre de segurança', quantity: 1, unitCost: 1.80 }
    ],
    notes: 'Bater as cenouras com o óleo e ovos por 4 minutos para não deixar grumos. Não bater demais a farinha.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
