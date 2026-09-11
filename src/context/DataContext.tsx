import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Ingredient, Recipe, RecipeFinancials } from '../types';
import { INITIAL_INGREDIENTS, INITIAL_RECIPES } from '../data/initialData';
import { calculateRecipeFinancials, calculateCostPerBaseUnit } from '../utils/calculations';
import { useAuth } from './AuthContext';

interface DataContextType {
  ingredients: Ingredient[];
  recipes: Recipe[];
  ingredientsMap: Map<string, Ingredient>;
  addIngredient: (data: Omit<Ingredient, 'id' | 'costPerBaseUnit' | 'updatedAt'>) => void;
  updateIngredient: (id: string, data: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getFinancials: (recipe: Recipe) => RecipeFinancials;
  totalProductsCount: number;
  averageMargin: number;
  totalMonthlyEstimatedRevenue: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_INGREDIENTS_KEY = 'confeitapro_ingredients_data';
const LOCAL_STORAGE_RECIPES_KEY = 'confeitapro_recipes_data';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Carrega ingredientes do localStorage ou usa lista inicial
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_INGREDIENTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao restaurar ingredientes:', e);
      }
    }
    return INITIAL_INGREDIENTS;
  });

  // Carrega receitas do localStorage ou usa receitas iniciais
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_RECIPES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao restaurar receitas:', e);
      }
    }
    return INITIAL_RECIPES;
  });

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_INGREDIENTS_KEY, JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_RECIPES_KEY, JSON.stringify(recipes));
  }, [recipes]);

  // Mapa rápido de ingredientes por ID
  const ingredientsMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ing) => map.set(ing.id, ing));
    return map;
  }, [ingredients]);

  // 1. Ações de Ingredientes
  const addIngredient = (data: Omit<Ingredient, 'id' | 'costPerBaseUnit' | 'updatedAt'>) => {
    const costPerBaseUnit = calculateCostPerBaseUnit(data.packagePrice, data.packageSize, data.packageUnit);
    const newIngredient: Ingredient = {
      ...data,
      id: 'ing_' + Date.now(),
      costPerBaseUnit,
      updatedAt: new Date().toISOString()
    };
    setIngredients((prev) => [newIngredient, ...prev]);
  };

  const updateIngredient = (id: string, data: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== id) return ing;
        const updated = { ...ing, ...data, updatedAt: new Date().toISOString() };
        // Recalcula custo unitário se preço ou tamanho da embalagem mudou
        if (data.packagePrice !== undefined || data.packageSize !== undefined || data.packageUnit !== undefined) {
          updated.costPerBaseUnit = calculateCostPerBaseUnit(
            updated.packagePrice,
            updated.packageSize,
            updated.packageUnit
          );
        }
        return updated;
      })
    );
  };

  const deleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // 2. Ações de Receitas
  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: 'rec_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const updateRecipe = (id: string, recipeData: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, ...recipeData, updatedAt: new Date().toISOString() } : rec
      )
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((rec) => rec.id !== id));
  };

  // 3. Calculadora financeira em tempo real
  const getFinancials = (recipe: Recipe): RecipeFinancials => {
    return calculateRecipeFinancials(
      recipe,
      ingredientsMap,
      user?.hourlyLaborRate || 25.0
    );
  };

  // Métricas agregadas para o Dashboard
  const totalProductsCount = recipes.length;

  const averageMargin = useMemo(() => {
    if (!recipes.length) return 0;
    const total = recipes.reduce((acc, r) => acc + (r.desiredProfitMargin || 100), 0);
    return Math.round(total / recipes.length);
  }, [recipes]);

  const totalMonthlyEstimatedRevenue = useMemo(() => {
    // Estimativa simples para exibição motivacional no dashboard
    return recipes.reduce((acc, r) => {
      const f = calculateRecipeFinancials(r, ingredientsMap, user?.hourlyLaborRate || 25);
      return acc + f.suggestedSalePrice * 4; // Estimando 4 vendas por mês de cada receita
    }, 0);
  }, [recipes, ingredientsMap, user?.hourlyLaborRate]);

  return (
    <DataContext.Provider
      value={{
        ingredients,
        recipes,
        ingredientsMap,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getFinancials,
        totalProductsCount,
        averageMargin,
        totalMonthlyEstimatedRevenue
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
