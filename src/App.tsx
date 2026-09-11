import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { RecipeModal } from './components/RecipeModal';
import { IngredientModal } from './components/IngredientModal';
import { LaborCalculatorModal } from './components/LaborCalculatorModal';
import { PricingPlansModal } from './components/PricingPlansModal';
import { AuthModal } from './components/AuthModal';
import { ExportBudgetModal } from './components/ExportBudgetModal';

import { Dashboard } from './pages/Dashboard';
import { RecipesPage } from './pages/RecipesPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { SettingsPage } from './pages/SettingsPage';

import { Recipe, Ingredient } from './types';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals state
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [ingredientToEdit, setIngredientToEdit] = useState<Ingredient | null>(null);

  const [isLaborCalcModalOpen, setIsLaborCalcModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [exportRecipe, setExportRecipe] = useState<Recipe | null>(null);
  const [aiPreselectedRecipe, setAiPreselectedRecipe] = useState<Recipe | null>(null);

  const { getFinancials } = useData();

  // Handlers
  const handleOpenNewRecipe = () => {
    setRecipeToEdit(null);
    setIsRecipeModalOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleOpenNewIngredient = () => {
    setIngredientToEdit(null);
    setIsIngredientModalOpen(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setIngredientToEdit(ingredient);
    setIsIngredientModalOpen(true);
  };

  const handleConsultAi = (recipe: Recipe) => {
    setAiPreselectedRecipe(recipe);
    setActiveTab('ai-chef');
  };

  const handleExportRecipe = (recipe: Recipe) => {
    setExportRecipe(recipe);
  };

  return (
    <div className="app-container">
      {/* Menu Lateral Fixo */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <div className="main-content">
        <Navbar
          onOpenNewRecipe={handleOpenNewRecipe}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenLaborCalc={() => setIsLaborCalcModalOpen(true)}
        />

        <main className="page-container">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenNewRecipe={handleOpenNewRecipe}
              onOpenLaborCalc={() => setIsLaborCalcModalOpen(true)}
              onOpenPricing={() => setIsPricingModalOpen(true)}
              onSelectTab={setActiveTab}
              onEditRecipe={handleEditRecipe}
              onConsultAi={handleConsultAi}
              onExportRecipe={handleExportRecipe}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipesPage
              onOpenNewRecipe={handleOpenNewRecipe}
              onEditRecipe={handleEditRecipe}
              onConsultAi={handleConsultAi}
              onExportRecipe={handleExportRecipe}
            />
          )}

          {activeTab === 'ingredients' && (
            <IngredientsPage
              onOpenNewIngredient={handleOpenNewIngredient}
              onEditIngredient={handleEditIngredient}
            />
          )}

          {activeTab === 'ai-chef' && (
            <AiAdvisorPage
              onOpenPricing={() => setIsPricingModalOpen(true)}
              preselectedRecipe={aiPreselectedRecipe}
            />
          )}

          {activeTab === 'labor-calc' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <LaborCalculatorModal onClose={() => setActiveTab('dashboard')} />
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              onOpenPricing={() => setIsPricingModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modais Globais */}
      {isRecipeModalOpen && (
        <RecipeModal
          recipeToEdit={recipeToEdit}
          onClose={() => setIsRecipeModalOpen(false)}
          onOpenPricing={() => {
            setIsRecipeModalOpen(false);
            setIsPricingModalOpen(true);
          }}
        />
      )}

      {isIngredientModalOpen && (
        <IngredientModal
          ingredientToEdit={ingredientToEdit}
          onClose={() => setIsIngredientModalOpen(false)}
        />
      )}

      {isLaborCalcModalOpen && (
        <LaborCalculatorModal
          onClose={() => setIsLaborCalcModalOpen(false)}
        />
      )}

      {isPricingModalOpen && (
        <PricingPlansModal
          onClose={() => setIsPricingModalOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {exportRecipe && (
        <ExportBudgetModal
          recipe={exportRecipe}
          financials={getFinancials(exportRecipe)}
          onClose={() => setExportRecipe(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
