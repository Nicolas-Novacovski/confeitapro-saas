export type MeasurementUnit = 'g' | 'kg' | 'ml' | 'l' | 'un';

export type IngredientCategory = 
  | 'Laticínios' 
  | 'Chocolates & Cacau' 
  | 'Farinhas & Açúcares' 
  | 'Frutas & Castanhas' 
  | 'Embalagens & Descartáveis' 
  | 'Aromas & Corantes' 
  | 'Gorduras & Óleos' 
  | 'Outros';

export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  packageSize: number;       // Ex: 395
  packageUnit: MeasurementUnit; // Ex: 'g'
  packagePrice: number;      // Ex: 6.50
  costPerBaseUnit: number;   // Custo por 1g ou 1ml ou 1un
  category: IngredientCategory;
  updatedAt: string;
}

export interface RecipeIngredientItem {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: MeasurementUnit;
}

export interface RecipePackagingItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export type RecipeCategory = 
  | 'Bolos Decorados' 
  | 'Docinhos & Brigadeiros' 
  | 'Sobremesas & Taças' 
  | 'Tortas & Cheesecakes' 
  | 'Cookies & Brownies' 
  | 'Pães & Salgados' 
  | 'Outros';

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  yieldAmount: number;       // Ex: 30
  yieldUnit: string;         // Ex: 'unidades', 'fatias', 'potes'
  prepTimeMinutes: number;   // Ex: 90 min
  overheadPercentage: number;// Ex: 15% (gás, água, energia, desgaste)
  desiredProfitMargin: number; // Ex: 120%
  ingredients: RecipeIngredientItem[];
  packagings: RecipePackagingItem[];
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFinancials {
  ingredientsCost: number;
  packagingsCost: number;
  directCost: number;
  overheadCost: number;
  laborCost: number;
  totalCost: number;
  costPerUnit: number;
  suggestedSalePrice: number;
  suggestedPricePerUnit: number;
  netProfit: number;
  netProfitPerUnit: number;
  marginRealPercentage: number;
  breakEvenUnits: number;
}

export type UserPlan = 'free' | 'pro' | 'master';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  bakeryName: string;
  phone?: string;
  pixKey?: string;
  hourlyLaborRate: number; // Ex: 25.00
  monthlyHoursTarget: number; // Ex: 160h
  plan: UserPlan;
  isDemo?: boolean;
  stripeCustomerId?: string;
  subscriptionExpiresAt?: string;
  sessionStartedAt?: string;
  isEmailVerified?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
