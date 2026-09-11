import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { STRIPE_PLANS, StripePlan } from '../config/stripe';
import { formatCurrencyBRL } from '../utils/formatters';
import { StripeCheckoutModal } from './StripeCheckoutModal';
import { X, Check, Crown, ShieldCheck, Zap, Heart, ExternalLink } from 'lucide-react';

interface PricingPlansModalProps {
  onClose: () => void;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({ onClose }) => {
  const { user, upgradePlan } = useAuth();
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<StripePlan | null>(null);

  const handleSelectPlan = (plan: StripePlan) => {
    if (plan.id === 'free') {
      upgradePlan('free');
      onClose();
      return;
    }

    if (plan.stripePaymentLink) {
      // Redireciona imediatamente para a página de checkout oficial do Stripe
      window.open(plan.stripePaymentLink, '_blank') || (window.location.href = plan.stripePaymentLink);
      return;
    }

    setSelectedPlanForCheckout(plan);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className="modal-content modal-content-lg" 
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '960px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: 0,
            borderRadius: 'var(--radius-xl)'
          }}
        >
          {/* Topo Promocional Pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #F9F4FC 0%, #FFF2F4 50%, #FAF6EE 100%)',
            padding: '1.25rem 2rem 1rem',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-light)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{ position: 'absolute', top: '0.85rem', right: '1rem', padding: '0.4rem' }}
            >
              <X size={20} />
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.25rem 0.85rem',
              background: 'var(--lavender-100)',
              color: 'var(--lavender-700)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '0.4rem'
            }}>
              <Crown size={14} />
              <span>NUNCA MAIS TENHA PREJUÍZO NA CONFEITARIA</span>
            </div>

            <h2 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Planos Feitos sob Medida para Seu Negócio Lucrar
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', maxWidth: '640px', margin: '0 auto' }}>
              Desbloqueie receitas ilimitadas, a <strong>Chef IA para redução de custos</strong> e ferramentas de vendas pelo WhatsApp por menos de <strong>R$ 1,00 por dia</strong>.
            </p>
          </div>

          {/* Grid dos 3 Planos */}
          <div style={{
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            background: '#FFFFFF'
          }}>
            {(['free', 'pro', 'master'] as const).map((key) => {
              const plan = STRIPE_PLANS[key];
              const isCurrent = user?.plan === plan.id;
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  style={{
                    background: isPopular ? 'linear-gradient(180deg, #FAF6FF 0%, #FFFFFF 100%)' : '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    border: isPopular ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                    boxShadow: isPopular ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                    padding: '1.35rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  {isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #9C78DC 0%, #7653B6 100%)',
                      color: '#FFFFFF',
                      padding: '0.2rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      boxShadow: '0 2px 8px rgba(142, 122, 196, 0.4)',
                      whiteSpace: 'nowrap'
                    }}>
                      ⭐ MAIS ESCOLHIDO PELAS CONFEITEIRAS
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {plan.name}
                      </h3>
                      {isCurrent && (
                        <span className="badge badge-sage" style={{ fontSize: '0.65rem' }}>
                          Plano Atual
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minHeight: '32px', marginBottom: '0.75rem' }}>
                      {plan.tagline}
                    </p>

                    {/* Preço */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {formatCurrencyBRL(plan.priceMonthly)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          /mês
                        </span>
                      </div>
                      {plan.priceMonthly > 0 && (
                        <span style={{ fontSize: '0.725rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                          Apenas R$ {(plan.priceMonthly / 30).toFixed(2)} por dia
                        </span>
                      )}
                    </div>

                    {/* Lista de Recursos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {plan.features.map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.775rem', color: 'var(--text-body)' }}>
                          <Check size={15} color={isPopular ? 'var(--lavender-500)' : 'var(--sage-500)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <div>
                    {isCurrent ? (
                      <button
                        disabled
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', opacity: 0.7, cursor: 'default' }}
                      >
                        Seu Plano Atual
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`btn ${isPopular ? 'btn-pro' : 'btn-primary'}`}
                        style={{ width: '100%', fontWeight: 700, padding: '0.65rem 1rem' }}
                      >
                        <span>
                          {plan.id === 'free' ? 'Voltar para Grátis' : `Ir para o Checkout (${formatCurrencyBRL(plan.priceMonthly)})`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé com Selos de Confiança */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-body)' }}>
              <ShieldCheck size={16} color="var(--sage-700)" />
              <span>Garantia de 7 dias com reembolso total</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-body)' }}>
              <Zap size={16} color="var(--amber-500)" />
              <span>Checkout 100% criptografado e seguro via Stripe</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-body)' }}>
              <Heart size={16} color="var(--primary)" />
              <span>Cancele sua assinatura quando quiser</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout do Stripe Integrado */}
      {selectedPlanForCheckout && (
        <StripeCheckoutModal
          plan={selectedPlanForCheckout}
          onClose={() => {
            setSelectedPlanForCheckout(null);
            onClose();
          }}
        />
      )}
    </>
  );
};
