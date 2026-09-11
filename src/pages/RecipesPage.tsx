import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe, RecipeCategory } from '../types';
import { Search, Plus, Filter, BookOpen } from 'lucide-react';

interface RecipesPageProps {
  onOpenNewRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onConsultAi: (recipe: Recipe) => void;
  onExportRecipe: (recipe: Recipe) => void;
}

const CATEGORIES = [
  'Todos',
  'Bolos Decorados',
  'Docinhos & Brigadeiros',
  'Sobremesas & Taças',
  'Tortas & Cheesecakes',
  'Cookies & Brownies',
  'Pães & Salgados'
];

export const RecipesPage: React.FC<RecipesPageProps> = ({
  onOpenNewRecipe,
  onEditRecipe,
  onConsultAi,
  onExportRecipe
}) => {
  const { recipes, getFinancials, deleteRecipe } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredRecipes = useMemo(() => {
    return recipes.filter((rec) => {
      const matchesSearch = rec.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || rec.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, search, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Topo da Página */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Minhas Receitas & Fichas Técnicas
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {recipes.length} receitas cadastradas com custos minuciosos de insumos e embalagens.
          </p>
        </div>

        <button onClick={onOpenNewRecipe} className="btn btn-primary">
          <Plus size={18} />
          <span>Cadastrar Nova Receita</span>
        </button>
      </div>

      {/* Barra de Busca e Filtros de Categoria */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Buscar receita pelo nome (ex: brigadeiro, vulcão, ninho...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Pílulas de Categoria */}
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
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Receitas */}
      {filteredRecipes.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Nenhuma receita encontrada
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tente buscar com outras palavras ou cadastre uma nova receita agora mesmo.
          </p>
        </div>
      ) : (
        <div className="grid-cols-auto">
          {filteredRecipes.map((rec) => (
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
  );
};
