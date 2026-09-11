import React, { useState, useEffect } from 'react';
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
import { RoiLossCalculatorModal } from './components/RoiLossCalculatorModal';
import { SecurityPanelModal } from './components/SecurityPanelModal';

import { Dashboard } from './pages/Dashboard';
import { RecipesPage } from './pages/RecipesPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

import { Recipe, Ingredient } from './types';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [showLoginPage, setShowLoginPage] = useState(false);

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
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const { getFinancials } = useData();
  const { upgradePlan } = useAuth();

  // Detecta retorno de sucesso do Stripe Checkout e ativa o plano instantaneamente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasSuccessParam = 
      params.get('subscription') === 'success' || 
      params.get('status') === 'success' || 
      Boolean(params.get('session_id')) ||
      params.get('checkout') === 'success';

    const pendingPlan = localStorage.getItem('confeitapro_pending_checkout_plan');

    if (hasSuccessParam || (pendingPlan && window.location.search.length > 0)) {
      const planToActivate = (params.get('plan') || pendingPlan || 'pro') as 'pro' | 'master';
      upgradePlan(planToActivate);

      setSuccessBanner(
        `🎉 Parabéns! Sua assinatura do Plano ${planToActivate === 'master' ? 'Ateliê Master' : 'Confeiteira Pro'} foi ativada com sucesso! Você agora tem acesso ilimitado a todas as receitas e à Chef IA.`
      );

      try {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#E88B9A', '#9ECDA8', '#F3CA77', '#C2B3E4']
        });
      } catch (e) {}

      localStorage.removeItem('confeitapro_pending_checkout_plan');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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

  if (showLoginPage) {
    return <LoginPage onSuccessLogin={() => setShowLoginPage(false)} />;
  }

  return (
    <div className="app-container">
      {/* Menu Lateral Fixo */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenLoginPage={() => setShowLoginPage(true)}
      />

      {/* Conteúdo Principal */}
      <div className="main-content">
        <Navbar
          onOpenNewRecipe={handleOpenNewRecipe}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenLaborCalc={() => setIsLaborCalcModalOpen(true)}
        />

        {/* Banner de Celebração ao Retornar do Stripe */}
        {successBanner && (
          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
            borderBottom: '2px solid #86EFAC',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#22C55E',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={20} />
              </div>
              <p style={{ fontSize: '0.925rem', fontWeight: 700, color: '#14532D' }}>
                {successBanner}
              </p>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.35rem', color: '#14532D' }}
            >
              <X size={18} />
            </button>
          </div>
        )}

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

          {activeTab === 'roi-calc' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <RoiLossCalculatorModal
                onClose={() => setActiveTab('dashboard')}
                onOpenPricing={() => setIsPricingModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'labor-calc' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <LaborCalculatorModal onClose={() => setActiveTab('dashboard')} />
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ maxWidth: '660px', margin: '0 auto' }}>
              <SecurityPanelModal onClose={() => setActiveTab('dashboard')} />
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
