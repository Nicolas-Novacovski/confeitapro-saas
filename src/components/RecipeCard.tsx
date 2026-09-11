import React from 'react';
import { Recipe, RecipeFinancials } from '../types';
import { formatCurrencyBRL, formatMinutesToHours } from '../utils/formatters';
import { 
  Sparkles, 
  Share2, 
  Edit3, 
  Trash2, 
  Clock, 
  PieChart, 
  TrendingUp, 
  Box,
  Flame
} from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  financials: RecipeFinancials;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onConsultAi: (recipe: Recipe) => void;
  onExport: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  financials,
  onEdit,
  onDelete,
  onConsultAi,
  onExport
}) => {
  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1.25rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Topo do Card: Categoria, Título e Rendimento */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span className="badge badge-rose">
            {recipe.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Clock size={14} />
            <span>{formatMinutesToHours(recipe.prepTimeMinutes)}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          {recipe.title}
        </h3>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Rende: <strong>{recipe.yieldAmount} {recipe.yieldUnit}</strong>
        </p>
      </div>

      {/* Bloco Financeiro Principal */}
      <div style={{
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        border: '1px solid var(--border-light)',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.85rem'
      }}>
        {/* Custo Total */}
        <div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Custo Total
          </span>
          <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {formatCurrencyBRL(financials.totalCost)}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({formatCurrencyBRL(financials.costPerUnit)}/un)
          </span>
        </div>

        {/* Preço de Venda Sugerido */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--sage-700)', textTransform: 'uppercase', fontWeight: 700 }}>
            Preço de Venda
          </span>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sage-700)', marginTop: '2px' }}>
            {formatCurrencyBRL(financials.suggestedSalePrice)}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--sage-700)', fontWeight: 600 }}>
            ({formatCurrencyBRL(financials.suggestedPricePerUnit)}/un)
          </span>
        </div>
      </div>

      {/* Barra de Lucro e Margem */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0.85rem',
        background: 'var(--sage-50)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--sage-300)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={16} color="var(--sage-700)" />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--sage-700)' }}>
            Seu Lucro Líquido:
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong style={{ fontSize: '0.95rem', color: 'var(--sage-700)' }}>
            +{formatCurrencyBRL(financials.netProfit)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--sage-700)', marginLeft: '0.35rem' }}>
            ({recipe.desiredProfitMargin}% margem)
          </span>
        </div>
      </div>

      {/* Alerta Inteligente de Saúde Financeira DoceLucro */}
      {recipe.desiredProfitMargin < 60 ? (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-sm)',
          padding: '0.4rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          color: '#B91C1C',
          fontWeight: 600
        }}>
          <span>⚠️</span>
          <span>Margem baixa ({recipe.desiredProfitMargin}%). Risco de pagar para trabalhar se os insumos subirem!</span>
        </div>
      ) : (
        <div style={{
          background: 'var(--sage-50)',
          border: '1px solid var(--sage-200)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.3rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.725rem',
          color: 'var(--sage-700)',
          fontWeight: 600
        }}>
          <span>✨ Margem Saudável & Blindada</span>
          <span>Retorno Seguro</span>
        </div>
      )}

      {/* Mini decomposição de custos */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px dashed var(--border-light)',
        paddingTop: '0.65rem'
      }}>
        <span title="Ingredientes diretos">
          Insumos: <strong>{formatCurrencyBRL(financials.ingredientsCost)}</strong>
        </span>
        <span title="Embalagens e laços">
          Emb.: <strong>{formatCurrencyBRL(financials.packagingsCost)}</strong>
        </span>
        <span title="Gás, luz e água (custos invisíveis)">
          Gás/Luz: <strong>{formatCurrencyBRL(financials.overheadCost)}</strong>
        </span>
        <span title="Valor pago pela sua mão de obra">
          Mão de Obra: <strong>{formatCurrencyBRL(financials.laborCost)}</strong>
        </span>
      </div>

      {/* Ações do Card - Organizadas com responsividade e sem overflow */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            onClick={() => onConsultAi(recipe)}
            className="btn btn-pro btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.6rem', width: '100%' }}
            title="Dicas da Chef IA para otimizar custo e criar legenda"
          >
            <Sparkles size={14} />
            <span>Chef IA</span>
          </button>

          <button
            onClick={() => onExport(recipe)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.6rem', width: '100%' }}
            title="Exportar orçamento para WhatsApp ou imprimir ficha técnica"
          >
            <Share2 size={14} />
            <span>Orçamento</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.15rem' }}>
          <button
            onClick={() => onEdit(recipe)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.6rem', color: 'var(--text-body)', gap: '0.35rem' }}
          >
            <Edit3 size={14} />
            <span>Editar</span>
          </button>

          <button
            onClick={() => onDelete(recipe.id)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.6rem', color: '#CA5F71', gap: '0.35rem' }}
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
