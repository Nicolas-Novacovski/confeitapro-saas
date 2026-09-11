import React, { useState } from 'react';
import { Ingredient, IngredientCategory, MeasurementUnit } from '../types';
import { useData } from '../context/DataContext';
import { calculateCostPerBaseUnit } from '../utils/calculations';
import { formatCurrencyBRL } from '../utils/formatters';
import { X, Sparkles, AlertCircle } from 'lucide-react';

interface IngredientModalProps {
  ingredientToEdit: Ingredient | null;
  onClose: () => void;
}

const CATEGORIES: IngredientCategory[] = [
  'Laticínios',
  'Chocolates & Cacau',
  'Farinhas & Açúcares',
  'Frutas & Castanhas',
  'Embalagens & Descartáveis',
  'Aromas & Corantes',
  'Gorduras & Óleos',
  'Outros'
];

const UNITS: MeasurementUnit[] = ['g', 'kg', 'ml', 'l', 'un'];

export const IngredientModal: React.FC<IngredientModalProps> = ({
  ingredientToEdit,
  onClose
}) => {
  const { addIngredient, updateIngredient } = useData();

  const [name, setName] = useState(ingredientToEdit?.name || '');
  const [brand, setBrand] = useState(ingredientToEdit?.brand || '');
  const [category, setCategory] = useState<IngredientCategory>(ingredientToEdit?.category || 'Laticínios');
  const [packageSize, setPackageSize] = useState<number>(ingredientToEdit?.packageSize || 1000);
  const [packageUnit, setPackageUnit] = useState<MeasurementUnit>(ingredientToEdit?.packageUnit || 'g');
  const [packagePrice, setPackagePrice] = useState<number>(ingredientToEdit?.packagePrice || 10.00);

  // Custo unitário calculado em tempo real
  const currentCostPerBase = calculateCostPerBaseUnit(Number(packagePrice) || 0, Number(packageSize) || 1, packageUnit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, digite o nome do ingrediente!');
      return;
    }

    if (packagePrice <= 0 || packageSize <= 0) {
      alert('Informe um preço e peso/tamanho válidos!');
      return;
    }

    const payload = {
      name,
      brand,
      category,
      packageSize: Number(packageSize),
      packageUnit,
      packagePrice: Number(packagePrice)
    };

    if (ingredientToEdit) {
      updateIngredient(ingredientToEdit.id, payload);
    } else {
      addIngredient(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-canvas)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {ingredientToEdit ? 'Editar Ingrediente' : 'Novo Ingrediente no Estoque'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cadastre com o preço da embalagem fechada comprada no mercado.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nome do Ingrediente</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Leite Condensado, Chocolate Meio Amargo, Ovos..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Marca (opcional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Nestlé, Sicao, Harald..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as IngredientCategory)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              📦 Dados da Embalagem de Compra
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Tamanho / Peso</label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  className="form-input"
                  placeholder="395"
                  value={packageSize}
                  onChange={(e) => setPackageSize(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unidade</label>
                <select
                  className="form-select"
                  value={packageUnit}
                  onChange={(e) => setPackageUnit(e.target.value as MeasurementUnit)}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preço Pago (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="7.50"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Resultado do custo por grama/ml */}
            <div style={{
              background: '#FFFFFF',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--sage-300)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                Custo exato por {packageUnit === 'un' ? 'unidade' : packageUnit === 'kg' || packageUnit === 'g' ? 'grama (1g)' : 'ml (1ml)'}:
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--sage-700)' }}>
                R$ {currentCostPerBase.toFixed(4)}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {ingredientToEdit ? 'Atualizar Preço' : 'Salvar Ingrediente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
