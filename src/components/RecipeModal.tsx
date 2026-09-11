import React, { useState, useEffect, useMemo } from 'react';
import { Recipe, RecipeIngredientItem, RecipePackagingItem, RecipeCategory, MeasurementUnit } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { calculateRecipeFinancials, calculateIngredientPortionCost } from '../utils/calculations';
import { formatCurrencyBRL } from '../utils/formatters';
import { X, Plus, Trash2, HelpCircle, Sparkles, DollarSign, Calculator, Info } from 'lucide-react';

interface RecipeModalProps {
  recipeToEdit: Recipe | null;
  onClose: () => void;
  onOpenPricing: () => void;
}

const CATEGORIES: RecipeCategory[] = [
  'Bolos Decorados',
  'Docinhos & Brigadeiros',
  'Sobremesas & Taças',
  'Tortas & Cheesecakes',
  'Cookies & Brownies',
  'Pães & Salgados',
  'Outros'
];

const UNITS: MeasurementUnit[] = ['g', 'kg', 'ml', 'l', 'un'];

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipeToEdit,
  onClose,
  onOpenPricing
}) => {
  const { ingredients, ingredientsMap, addRecipe, updateRecipe, recipes } = useData();
  const { user, isPro } = useAuth();

  // Bloqueio de limite de receitas no plano Free
  const isLimitReached = !isPro && !recipeToEdit && recipes.length >= 3;

  // Form State
  const [title, setTitle] = useState(recipeToEdit?.title || '');
  const [category, setCategory] = useState<RecipeCategory>(recipeToEdit?.category || 'Bolos Decorados');
  const [yieldAmount, setYieldAmount] = useState(recipeToEdit?.yieldAmount || 10);
  const [yieldUnit, setYieldUnit] = useState(recipeToEdit?.yieldUnit || 'fatias');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(recipeToEdit?.prepTimeMinutes || 60);
  const [overheadPercentage, setOverheadPercentage] = useState(recipeToEdit?.overheadPercentage || 15);
  const [desiredProfitMargin, setDesiredProfitMargin] = useState(recipeToEdit?.desiredProfitMargin || 120);
  const [notes, setNotes] = useState(recipeToEdit?.notes || '');

  // Ingredientes da receita
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientItem[]>(() => {
    if (recipeToEdit?.ingredients && recipeToEdit.ingredients.length > 0) {
      return recipeToEdit.ingredients;
    }
    // Linha padrão se estiver vazio
    if (ingredients.length > 0) {
      return [
        {
          id: 'ri_' + Date.now(),
          ingredientId: ingredients[0].id,
          quantity: 200,
          unit: ingredients[0].packageUnit
        }
      ];
    }
    return [];
  });

  // Embalagens da receita
  const [packagings, setPackagings] = useState<RecipePackagingItem[]>(() => {
    if (recipeToEdit?.packagings && recipeToEdit.packagings.length > 0) {
      return recipeToEdit.packagings;
    }
    return [
      { id: 'pk_1', name: 'Caixa / Embalagem de Transporte', quantity: 1, unitCost: 4.50 },
      { id: 'pk_2', name: 'Fita de Cetim e Tag com Logotipo', quantity: 1, unitCost: 1.20 }
    ];
  });

  // Receita virtual para cálculo em tempo real
  const previewRecipe: Recipe = useMemo(() => {
    return {
      id: recipeToEdit?.id || 'temp',
      title,
      category,
      yieldAmount: Math.max(1, Number(yieldAmount) || 1),
      yieldUnit,
      prepTimeMinutes: Math.max(0, Number(prepTimeMinutes) || 0),
      overheadPercentage: Number(overheadPercentage) || 0,
      desiredProfitMargin: Number(desiredProfitMargin) || 0,
      ingredients: recipeIngredients,
      packagings,
      notes,
      createdAt: recipeToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [
    recipeToEdit,
    title,
    category,
    yieldAmount,
    yieldUnit,
    prepTimeMinutes,
    overheadPercentage,
    desiredProfitMargin,
    recipeIngredients,
    packagings,
    notes
  ]);

  const financials = useMemo(() => {
    return calculateRecipeFinancials(
      previewRecipe,
      ingredientsMap,
      user?.hourlyLaborRate || 25.0
    );
  }, [previewRecipe, ingredientsMap, user?.hourlyLaborRate]);

  // Manipulação de Ingredientes
  const handleAddIngredientRow = () => {
    if (ingredients.length === 0) return;
    setRecipeIngredients((prev) => [
      ...prev,
      {
        id: 'ri_' + Date.now() + Math.random().toString(36).substr(2, 4),
        ingredientId: ingredients[0].id,
        quantity: 100,
        unit: ingredients[0].packageUnit
      }
    ]);
  };

  const handleUpdateIngredientRow = (index: number, fields: Partial<RecipeIngredientItem>) => {
    setRecipeIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...fields } : item))
    );
  };

  const handleRemoveIngredientRow = (index: number) => {
    setRecipeIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Manipulação de Embalagens
  const handleAddPackagingRow = () => {
    setPackagings((prev) => [
      ...prev,
      {
        id: 'pk_' + Date.now(),
        name: 'Embalagem Adicional',
        quantity: 1,
        unitCost: 2.00
      }
    ]);
  };

  const handleUpdatePackagingRow = (index: number, fields: Partial<RecipePackagingItem>) => {
    setPackagings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...fields } : item))
    );
  };

  const handleRemovePackagingRow = (index: number) => {
    setPackagings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o nome da receita!');
      return;
    }

    if (isLimitReached) {
      onOpenPricing();
      return;
    }

    const payload = {
      title,
      category,
      yieldAmount: Number(yieldAmount) || 1,
      yieldUnit,
      prepTimeMinutes: Number(prepTimeMinutes) || 0,
      overheadPercentage: Number(overheadPercentage) || 15,
      desiredProfitMargin: Number(desiredProfitMargin) || 100,
      ingredients: recipeIngredients,
      packagings,
      notes
    };

    if (recipeToEdit) {
      updateRecipe(recipeToEdit.id, payload);
    } else {
      addRecipe(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-lg" 
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}
      >
        {/* Cabeçalho */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-canvas)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {recipeToEdit ? 'Editar Receita & Precificação' : 'Nova Receita & Precificação Precisa'}
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Calcule custos de insumos, tempo de cozinha, embalagens e garanta o lucro desejado.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Alerta de Limite Free se atingido */}
        {isLimitReached && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF9EE 0%, #FFF3F5 100%)',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--amber-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👑</span>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--amber-700)' }}>
                  Limite de 3 receitas do Plano Gratuito atingido
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  Faça o upgrade para o Plano Confeiteira Pro por R$ 29,90/mês para cadastrar receitas ilimitadas e liberar a Chef IA!
                </p>
              </div>
            </div>
            <button onClick={onOpenPricing} className="btn btn-pro btn-sm">
              Assinar Pro
            </button>
          </div>
        )}

        {/* Corpo com Scroll */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Linha 1: Dados Gerais da Receita */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nome da Receita / Produto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Bolo Vulcão Ninho c/ Nutella, Caixa c/ 6 Brigadeiros..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Linha 2: Rendimento e Tempo de Mão de Obra */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rendimento Total</label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  className="form-input"
                  placeholder="10"
                  value={yieldAmount}
                  onChange={(e) => setYieldAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Unidade</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: fatias, unidades, potes..."
                  value={yieldUnit}
                  onChange={(e) => setYieldUnit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" title="Tempo gasto preparando, assando e decorando">
                  Tempo de Preparo (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  className="form-input"
                  placeholder="60"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                />
              </div>
            </div>

            {/* SEÇÃO 1: Ingredientes Utilizados */}
            <div style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    1. Ingredientes & Insumos Usados
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    O custo proporcional é calculado instantaneamente com base no preço de compra da embalagem.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddIngredientRow}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={15} />
                  <span>Adicionar Ingrediente</span>
                </button>
              </div>

              {recipeIngredients.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  Nenhum ingrediente adicionado. Clique no botão acima para adicionar.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {recipeIngredients.map((item, index) => {
                    const ing = ingredientsMap.get(item.ingredientId);
                    const portionCost = calculateIngredientPortionCost(ing, item.quantity, item.unit);

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2.5fr 1fr 1fr 1.2fr auto',
                          gap: '0.65rem',
                          alignItems: 'center',
                          background: '#FFFFFF',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        {/* Seletor de Ingrediente */}
                        <select
                          className="form-select"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                          value={item.ingredientId}
                          onChange={(e) => {
                            const newIng = ingredientsMap.get(e.target.value);
                            handleUpdateIngredientRow(index, {
                              ingredientId: e.target.value,
                              unit: newIng?.packageUnit || 'g'
                            });
                          }}
                        >
                          {ingredients.map((ingItem) => (
                            <option key={ingItem.id} value={ingItem.id}>
                              {ingItem.name} {ingItem.brand ? `(${ingItem.brand})` : ''} - {ingItem.packageSize}{ingItem.packageUnit}
                            </option>
                          ))}
                        </select>

                        {/* Quantidade */}
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          className="form-input"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                          placeholder="Qtd"
                          value={item.quantity}
                          onChange={(e) => handleUpdateIngredientRow(index, { quantity: Number(e.target.value) })}
                        />

                        {/* Unidade */}
                        <select
                          className="form-select"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                          value={item.unit}
                          onChange={(e) => handleUpdateIngredientRow(index, { unit: e.target.value as MeasurementUnit })}
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>

                        {/* Custo da Porção */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Custo porção</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {formatCurrencyBRL(portionCost)}
                          </strong>
                        </div>

                        {/* Botão Remover */}
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredientRow(index)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.35rem', color: '#CA5F71' }}
                          title="Remover linha"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>
                  Total em Insumos: <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{formatCurrencyBRL(financials.ingredientsCost)}</strong>
                </span>
              </div>
            </div>

            {/* SEÇÃO 2: Embalagens e Descartáveis */}
            <div style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    2. Embalagens, Fitas & Descartáveis
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Caixas, pratos rígidos, forminhas, laços, sacolas e tags personalizadas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPackagingRow}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={15} />
                  <span>Adicionar Embalagem</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {packagings.map((pack, index) => (
                  <div
                    key={pack.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2.5fr 1fr 1.2fr auto',
                      gap: '0.65rem',
                      alignItems: 'center',
                      background: '#FFFFFF',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                      placeholder="Descrição do item"
                      value={pack.name}
                      onChange={(e) => handleUpdatePackagingRow(index, { name: e.target.value })}
                    />

                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                      placeholder="Qtd"
                      value={pack.quantity}
                      onChange={(e) => handleUpdatePackagingRow(index, { quantity: Number(e.target.value) })}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>R$</span>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        className="form-input"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        placeholder="Valor unit."
                        value={pack.unitCost}
                        onChange={(e) => handleUpdatePackagingRow(index, { unitCost: Number(e.target.value) })}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePackagingRow(index)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.35rem', color: '#CA5F71' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>
                  Total em Embalagens: <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{formatCurrencyBRL(financials.packagingsCost)}</strong>
                </span>
              </div>
            </div>

            {/* SEÇÃO 3: Custos Invisíveis & Mão de Obra */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              {/* Custos Invisíveis */}
              <div style={{
                background: 'var(--amber-50)',
                border: '1px solid var(--amber-300)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--amber-700)' }}>
                    🔥 Custos Invisíveis (Gás/Energia/Água)
                  </label>
                  <strong style={{ fontSize: '1rem', color: 'var(--amber-700)' }}>
                    {overheadPercentage}%
                  </strong>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '0.75rem' }}>
                  Na confeitaria, recomenda-se entre 10% e 25% para cobrir gás, forno ligado, detergente e desgaste de batedeiras.
                </p>

                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={overheadPercentage}
                  onChange={(e) => setOverheadPercentage(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--amber-500)' }}
                />

                <p style={{ fontSize: '0.825rem', marginTop: '0.5rem', color: 'var(--amber-700)' }}>
                  Adiciona: <strong>{formatCurrencyBRL(financials.overheadCost)}</strong> no custo
                </p>
              </div>

              {/* Mão de Obra */}
              <div style={{
                background: 'var(--sage-50)',
                border: '1px solid var(--sage-300)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sage-700)' }}>
                    👩‍🍳 Mão de Obra da Confeiteira
                  </label>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--sage-700)' }}>
                    R$ {user?.hourlyLaborRate?.toFixed(2) || '25.00'}/h
                  </strong>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '0.75rem' }}>
                  Calculado para {prepTimeMinutes} minutos trabalhados nesta receita. Você não pode trabalhar de graça!
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>Valor pago à confeiteira:</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--sage-700)' }}>
                    {formatCurrencyBRL(financials.laborCost)}
                  </strong>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: Margem de Lucro Desejada e Preço Final */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF3F5 100%)',
              border: '2px solid var(--primary-200)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    3. Margem de Lucro Desejada
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Deslize para ver como seu preço e seu lucro líquido reagem imediatamente.
                  </p>
                </div>

                <div style={{
                  background: 'var(--primary-100)',
                  color: 'var(--primary-dark)',
                  padding: '0.35rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '1.2rem'
                }}>
                  {desiredProfitMargin}%
                </div>
              </div>

              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={desiredProfitMargin}
                onChange={(e) => setDesiredProfitMargin(Number(e.target.value))}
                style={{ width: '100%', margin: '1rem 0', accentColor: 'var(--primary)' }}
              />

              {/* Grid com o Resumo Financeiro da Receita */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--primary-200)'
              }}>
                <div style={{ background: '#FFF', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Custo Total de Produção
                  </span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {formatCurrencyBRL(financials.totalCost)}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatCurrencyBRL(financials.costPerUnit)} por {yieldUnit}
                  </span>
                </div>

                <div style={{ background: 'var(--sage-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-300)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--sage-700)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Preço de Venda Sugerido
                  </span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--sage-700)', marginTop: '4px' }}>
                    {formatCurrencyBRL(financials.suggestedSalePrice)}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                    {formatCurrencyBRL(financials.suggestedPricePerUnit)} por {yieldUnit}
                  </span>
                </div>

                <div style={{ background: 'var(--primary-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--primary-dark)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Seu Lucro Líquido
                  </span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '4px' }}>
                    +{formatCurrencyBRL(financials.netProfit)}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                    +{formatCurrencyBRL(financials.netProfitPerUnit)} por {yieldUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Observações da Confeiteira */}
            <div className="form-group">
              <label className="form-label">Dicas do Ponto da Receita / Modo de Conservação</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Ex: Ponto de enrolar firme, não guardar na geladeira confeitado, validade de 5 dias em temperatura ambiente..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Rodapé com Ações */}
          <div style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            position: 'sticky',
            bottom: 0,
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                {recipeToEdit ? 'Atualizar Receita' : 'Salvar e Precificar Receita'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
