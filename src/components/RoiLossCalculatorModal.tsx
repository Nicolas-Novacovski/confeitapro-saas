import React, { useState } from 'react';
import { formatCurrencyBRL } from '../utils/formatters';
import { X, TrendingDown, TrendingUp, Sparkles, Check, Crown, AlertTriangle, ArrowRight } from 'lucide-react';

interface RoiLossCalculatorModalProps {
  onClose: () => void;
  onOpenPricing: () => void;
}

export const RoiLossCalculatorModal: React.FC<RoiLossCalculatorModalProps> = ({
  onClose,
  onOpenPricing
}) => {
  const [monthlySalesCount, setMonthlySalesCount] = useState<number>(45);
  const [estimatedLossPerItem, setEstimatedLossPerItem] = useState<number>(6.50);

  const monthlyLostMoney = monthlySalesCount * estimatedLossPerItem;
  const yearlyLostMoney = monthlyLostMoney * 12;
  const proMonthlyCost = 29.90;
  const netSavedMonthly = monthlyLostMoney - proMonthlyCost;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Topo de Impacto */}
        <div style={{
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFFDF9 100%)',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#FEE2E2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Calculadora de Dinheiro Perdido por Mês
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Descubra quanto você deixa na mesa por não precificar custos invisíveis.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{
            background: 'var(--amber-50)',
            border: '1px solid var(--amber-300)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.825rem',
            color: 'var(--amber-700)',
            lineHeight: 1.45
          }}>
            <strong>O perigo dos custos invisíveis:</strong> Gás de forno ligado, detergente, água, desgaste da batedeira, forminhas e fita. Quem não soma isso em cada doce, tira dinheiro do próprio bolso sem perceber.
          </div>

          {/* Sliders Interativos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.875rem' }}>
                  Quantos doces / bolos / sobremesas você vende por mês?
                </label>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  {monthlySalesCount} unidades
                </strong>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={monthlySalesCount}
                onChange={(e) => setMonthlySalesCount(Number(e.target.value))}
                style={{ accentColor: 'var(--primary)' }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.875rem' }}>
                  Prejuízo invisível médio estimado por doce não precificado:
                </label>
                <strong style={{ fontSize: '1.1rem', color: '#EF4444' }}>
                  {formatCurrencyBRL(estimatedLossPerItem)}
                </strong>
              </div>
              <input
                type="range"
                min="2.00"
                max="25.00"
                step="0.50"
                value={estimatedLossPerItem}
                onChange={(e) => setEstimatedLossPerItem(Number(e.target.value))}
                style={{ accentColor: '#EF4444' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Média nacional: R$ 4,00 a R$ 12,00 por produto (gás, perda de calda na panela e embalagem).
              </span>
            </div>
          </div>

          {/* Card de Diagnóstico & Comparativo Financeiro */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)',
            border: '2px solid #FCA5A5',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Dinheiro que está escorrendo pelo ralo
            </span>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#DC2626', margin: '0.25rem 0' }}>
              -{formatCurrencyBRL(monthlyLostMoney)} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/mês</span>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', fontWeight: 600 }}>
              Isso representa <strong style={{ color: '#DC2626' }}>{formatCurrencyBRL(yearlyLostMoney)}</strong> de prejuízo no final do ano!
            </p>
          </div>

          {/* A Solução e o Retorno do Investimento (ROI) */}
          <div style={{
            background: 'var(--sage-50)',
            border: '1.5px solid var(--sage-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--sage-700)" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--sage-700)' }}>
                O ConfeitaPro custa apenas R$ 29,90 por mês:
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-body)' }}>
              <span>Prejuízo mensal evitado:</span>
              <strong style={{ color: 'var(--sage-700)' }}>+{formatCurrencyBRL(monthlyLostMoney)}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-body)' }}>
              <span>Custo da ferramenta Pro:</span>
              <span style={{ color: 'var(--text-muted)' }}>-R$ 29,90</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px dashed var(--sage-300)',
              paddingTop: '0.65rem',
              fontSize: '1rem'
            }}>
              <strong style={{ color: 'var(--sage-700)' }}>Dinheiro limpo a mais no seu bolso:</strong>
              <strong style={{ fontSize: '1.25rem', color: 'var(--sage-700)' }}>
                +{formatCurrencyBRL(netSavedMonthly)}/mês
              </strong>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="btn btn-pro btn-lg"
            style={{ width: '100%', fontSize: '1.05rem', fontWeight: 800 }}
          >
            <Crown size={20} />
            <span>Quero Parar de Perder Dinheiro (Assinar por R$ 29,90)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
