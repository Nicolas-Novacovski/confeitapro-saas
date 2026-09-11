import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { RecipeCard } from '../components/RecipeCard';
import { formatCurrencyBRL } from '../utils/formatters';
import { Recipe } from '../types';
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Plus, 
  ChefHat, 
  Crown,
  Lightbulb
} from 'lucide-react';

interface DashboardProps {
  onOpenNewRecipe: () => void;
  onOpenLaborCalc: () => void;
  onOpenPricing: () => void;
  onSelectTab: (tab: any) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onConsultAi: (recipe: Recipe) => void;
  onExportRecipe: (recipe: Recipe) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewRecipe,
  onOpenLaborCalc,
  onOpenPricing,
  onSelectTab,
  onEditRecipe,
  onConsultAi,
  onExportRecipe
}) => {
  const { recipes, getFinancials, deleteRecipe, totalProductsCount, averageMargin, totalMonthlyEstimatedRevenue } = useData();
  const { user, isPro } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner de Boas-Vindas */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF1F3 0%, #FAF5FD 50%, #F5F9F6 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: '#FFFFFF', borderRadius: 'var(--radius-full)', border: '1px solid var(--primary-200)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem' }}>✨</span>
            <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
              Painel Financeiro & Precificação
            </span>
          </div>

          <h1 className="font-serif" style={{ fontSize: '1.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Olá, {user?.displayName || 'Confeiteira'}! 🧁
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
            Bem-vinda ao <strong>{user?.bakeryName || 'seu ateliê'}</strong>. Aqui você tem controle absoluto de cada centavo gasto com ingredientes, gás, embalagens e tempo de produção.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onOpenNewRecipe}
            className="btn btn-primary btn-lg"
          >
            <Plus size={18} />
            <span>Precificar Nova Receita</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Métrica 1: Receitas Cadastradas */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--primary-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Receitas Cadastradas
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {totalProductsCount} {!isPro ? <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 3 (Free)</span> : ''}
            </p>
          </div>
        </div>

        {/* Métrica 2: Margem Média de Lucro */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--sage-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--sage-700)'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sage-700)', textTransform: 'uppercase' }}>
              Margem Média Desejada
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sage-700)' }}>
              {averageMargin}%
            </p>
          </div>
        </div>

        {/* Métrica 3: Valor da Mão de Obra */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={onOpenLaborCalc}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--amber-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber-700)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-700)', textTransform: 'uppercase' }}>
              Valor da Sua Hora
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatCurrencyBRL(user?.hourlyLaborRate || 25)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/h</span>
            </p>
          </div>
        </div>

        {/* Métrica 4: Faturamento Estimado */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--lavender-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lavender-700)'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-700)', textTransform: 'uppercase' }}>
              Faturamento Estimado
            </span>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatCurrencyBRL(totalMonthlyEstimatedRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Dica da Chef IA */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F4FD 0%, #FFF3F5 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        border: '1px solid var(--lavender-300)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #9C78DC 0%, #7653B6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              💡 Dica Gastronômica de Ouro da Chef IA:
            </p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-body)' }}>
              "Nunca venda brigadeiro ou doces finos sem somar o custo das forminhas de 4 pétalas e sacolas kraft. Pequenos custos invisíveis somados comem até 30% do seu lucro no fim do mês!"
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('ai-chef')}
          className="btn btn-pro btn-sm"
        >
          <Sparkles size={15} />
          <span>Falar com a Chef IA</span>
        </button>
      </div>

      {/* Seção de Receitas Recentes */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Receitas Precificadas
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Acompanhe o custo por porção e o lucro líquido de cada doce.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('recipes')}
            className="btn btn-secondary btn-sm"
          >
            <span>Ver Todas ({recipes.length})</span>
          </button>
        </div>

        {recipes.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '2px dashed var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Nenhuma receita cadastrada ainda
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Comece adicionando seu primeiro bolo ou docinho para ver a mágica do cálculo automático de custos.
            </p>
            <button onClick={onOpenNewRecipe} className="btn btn-primary">
              <Plus size={16} />
              <span>Criar Minha Primeira Receita</span>
            </button>
          </div>
        ) : (
          <div className="grid-cols-auto">
            {recipes.map((rec) => (
              <RecipeCard
                key={rec.id}
                recipe={rec}
                financials={getFinancials(rec)}
                onEdit={onEditRecipe}
                onDelete={deleteRecipe}
                onConsultAi={onConsultAi}
                onExport={onExportRecipe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
