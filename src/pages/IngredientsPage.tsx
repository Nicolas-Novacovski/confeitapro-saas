import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Ingredient, IngredientCategory } from '../types';
import { formatCurrencyBRL } from '../utils/formatters';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  UtensilsCrossed, 
  Zap, 
  Tag,
  ArrowUpDown
} from 'lucide-react';

interface IngredientsPageProps {
  onOpenNewIngredient: () => void;
  onEditIngredient: (ingredient: Ingredient) => void;
}

const CATEGORIES = [
  'Todos',
  'Laticínios',
  'Chocolates & Cacau',
  'Farinhas & Açúcares',
  'Frutas & Castanhas',
  'Embalagens & Descartáveis',
  'Gorduras & Óleos',
  'Outros'
];

export const IngredientsPage: React.FC<IngredientsPageProps> = ({
  onOpenNewIngredient,
  onEditIngredient
}) => {
  const { ingredients, deleteIngredient } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const matchesSearch = ing.name.toLowerCase().includes(search.toLowerCase()) ||
        (ing.brand && ing.brand.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || ing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [ingredients, search, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Topo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Banco Central de Ingredientes & Insumos
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Gerencie os preços de compra do mercado. Qualquer atualização aqui recalcula todas as receitas automaticamente!
          </p>
        </div>

        <button onClick={onOpenNewIngredient} className="btn btn-primary">
          <Plus size={18} />
          <span>Cadastrar Ingrediente</span>
        </button>
      </div>

      {/* Alerta de Atualização em Cascata */}
      <div style={{
        background: 'var(--sage-50)',
        border: '1px solid var(--sage-300)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Zap size={20} color="var(--sage-700)" />
        <p style={{ fontSize: '0.825rem', color: 'var(--sage-700)', lineHeight: 1.4 }}>
          <strong>Efeito Cascata Inteligente:</strong> Se o leite condensado ou o cacau subir de preço no supermercado, basta alterar o valor nesta tabela. Todas as suas receitas, custos unitários e lucros serão recalculados instantaneamente!
        </p>
      </div>

      {/* Busca e Filtros */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Buscar insumo ou marca (ex: Leite Condensado, Nestlé, Sicao...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categorias */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                  background: isSelected ? 'var(--primary-50)' : '#FFFFFF',
                  color: isSelected ? 'var(--primary-dark)' : 'var(--text-body)',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabela de Ingredientes */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Ingrediente</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>Categoria</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>Embalagem Comprada</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>Preço Pago</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>Custo Unitário</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ing) => {
                const isPerUnit = ing.packageUnit === 'un';
                const baseLabel = isPerUnit ? 'unidade' : ing.packageUnit === 'kg' || ing.packageUnit === 'g' ? '1g' : '1ml';

                return (
                  <tr key={ing.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{ing.name}</strong>
                      {ing.brand && (
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Marca: {ing.brand}</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-lavender" style={{ fontSize: '0.725rem' }}>
                        {ing.category}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-body)' }}>
                      <strong>{ing.packageSize}</strong> {ing.packageUnit}
                    </td>

                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrencyBRL(ing.packagePrice)}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: 'var(--sage-50)',
                        color: 'var(--sage-700)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.825rem',
                        fontWeight: 700
                      }}>
                        R$ {ing.costPerBaseUnit.toFixed(4)} / {baseLabel}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => onEditIngredient(ing)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.4rem' }}
                          title="Editar preço do insumo"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteIngredient(ing.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.4rem', color: '#CA5F71' }}
                          title="Excluir ingrediente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
