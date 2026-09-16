import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { STRIPE_PLANS, StripePlan } from '../config/stripe';
import { formatCurrencyBRL } from '../utils/formatters';
import { StripeCheckoutModal } from './StripeCheckoutModal';
import { X, Check, Crown, ShieldCheck, Zap, Heart, Unlock } from 'lucide-react';
import Swal from 'sweetalert2';

interface PricingPlansModalProps {
  onClose: () => void;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({ onClose }) => {
  const { user, upgradePlan, cancelSubscription } = useAuth();
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<StripePlan | null>(null);

  const isDevAccount = user?.email?.toLowerCase().trim() === 'thiago_tprox@hotmail.com';

  const handleSelectPlan = (plan: StripePlan) => {
    // 1. Volta para o Grátis
    if (plan.id === 'free') {
      upgradePlan('free');
      onClose();
      return;
    }

    // 2. ATALHO MÁGICO DO DESENVOLVEDOR (Ativa o plano na hora sem passar pelo Stripe)
    if (isDevAccount) {
      upgradePlan(plan.id as 'pro' | 'master');
      
      Swal.fire({
        title: 'Modo Dev Ativado!',
        text: `O plano ${plan.name} foi desbloqueado com sucesso na sua conta sem cobranças.`,
        icon: 'success',
        confirmButtonColor: '#9C78DC',
        confirmButtonText: 'Testar Funcionalidades',
        borderRadius: '16px'
      });
      
      onClose();
      return;
    }

    // 3. FLUXO REAL: Redireciona o usuário comum para o link de pagamento seguro do Stripe
    if (plan.stripePaymentLink) {
      // Salva a intenção para a tela de sucesso capturar quando voltar do Stripe
      localStorage.setItem('confeitapro_pending_checkout_plan', plan.id);
      
      // Opcional: Adiciona o e-mail do cliente na URL do Stripe para preencher o checkout automaticamente
      const paymentUrl = new URL(plan.stripePaymentLink);
      if (user?.email) {
        paymentUrl.searchParams.append('prefilled_email', user.email);
      }
      
      window.location.href = paymentUrl.toString();
      return;
    }

    // Fallback caso não tenha link direto (abrirá o modal interno)
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <button
                          disabled
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', opacity: 0.85, cursor: 'default', fontWeight: 700 }}
                        >
                          Seu Plano Atual (Ativo)
                        </button>
                        {plan.id !== 'free' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja cancelar sua assinatura do plano ' + plan.name + ' e interromper a cobrança? Você retornará ao plano Gratuito.')) {
                                cancelSubscription();
                                alert('Assinatura cancelada com sucesso. Cobrança interrompida e conta retornada para o plano Grátis.');
                              }
                            }}
                            className="btn btn-ghost btn-sm"
                            style={{ width: '100%', fontSize: '0.725rem', color: '#E11D48', padding: '0.3rem' }}
                          >
                            Cancelar Assinatura & Cortar Cobrança
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`btn ${isDevAccount && plan.id !== 'free' ? 'btn-secondary' : isPopular ? 'btn-pro' : 'btn-primary'}`}
                        style={{ 
                          width: '100%', 
                          fontWeight: 700, 
                          padding: '0.65rem 1rem',
                          background: isDevAccount && plan.id !== 'free' ? '#1E293B' : undefined,
                          color: isDevAccount && plan.id !== 'free' ? '#FFFFFF' : undefined,
                          border: isDevAccount && plan.id !== 'free' ? 'none' : undefined
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          {plan.id === 'free' 
                            ? 'Voltar para Grátis' 
                            : isDevAccount 
                              ? <><Unlock size={16} /> Desbloquear Modo Dev</>
                              : `Ir para Checkout (${formatCurrencyBRL(plan.priceMonthly)})`}
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

      {/* Modal de Checkout Interno (Fallback) */}
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