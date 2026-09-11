import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StripePlan } from '../config/stripe';
import { formatCurrencyBRL } from '../utils/formatters';
import { X, Lock, CreditCard, ShieldCheck, Check, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StripeCheckoutModalProps {
  plan: StripePlan;
  onClose: () => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({ plan, onClose }) => {
  const { user, upgradePlan } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• ••••');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState(user?.displayName || 'Mariana Silva');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('11/29');
    setCvc('888');
  };

  const handleOpenExternalStripe = () => {
    if (plan.stripePaymentLink) {
      window.open(plan.stripePaymentLink, '_blank');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      upgradePlan(plan.id as 'pro' | 'master');

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#E88B9A', '#9ECDA8', '#F3CA77', '#C2B3E4']
        });
      } catch (e) {}

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Topo estilo Stripe */}
        <div style={{
          background: '#0A2540',
          color: '#FFFFFF',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💳</span>
              <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>
                Stripe <span style={{ fontWeight: 400, opacity: 0.85 }}>Checkout</span>
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', opacity: 0.75, marginTop: '2px' }}>
              Ambiente Seguro e Criptografado de 256 bits
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              MODO TESTE
            </span>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF', padding: '0.35rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div style={{
          background: '#F8FAFC',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Assinatura Mensal Recorrente
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {plan.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Cobrança mensal no valor de {formatCurrencyBRL(plan.priceMonthly)}. Cancele quando quiser.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
              {formatCurrencyBRL(plan.priceMonthly)}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>/mês</span>
          </div>
        </div>

        {isSuccess ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--sage-100)',
              color: 'var(--sage-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Assinatura Ativada com Sucesso!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', maxWidth: '400px' }}>
              Parabéns! Sua conta foi atualizada para o <strong>{plan.name}</strong>. Agora você tem receitas ilimitadas e acesso à Chef IA!
            </p>
          </div>
        ) : (
          <div style={{ padding: '1.5rem' }}>
            
            {/* Opções de Pagamento */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: paymentMethod === 'card' ? '#635BFF' : '#E2E8F0',
                  background: paymentMethod === 'card' ? '#F4F3FF' : '#FFFFFF',
                  color: paymentMethod === 'card' ? '#635BFF' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <CreditCard size={18} />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: paymentMethod === 'pix' ? '#00BDAE' : '#E2E8F0',
                  background: paymentMethod === 'pix' ? '#F0FDFB' : '#FFFFFF',
                  color: paymentMethod === 'pix' ? '#00BDAE' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <QrCode size={18} />
                <span>Pix Instantâneo</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label className="form-label" style={{ fontSize: '0.825rem' }}>Informações do Cartão</label>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#635BFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Usar Cartão Teste Stripe</span>
                  </button>
                </div>

                <div style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFFFF',
                  overflow: 'hidden'
                }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ border: 'none', borderRadius: 0, borderBottom: '1px solid #E2E8F0', padding: '0.75rem' }}
                    placeholder="Número do Cartão"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ border: 'none', borderRadius: 0, borderRight: '1px solid #E2E8F0', padding: '0.75rem' }}
                      placeholder="MM / AA"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ border: 'none', borderRadius: 0, padding: '0.75rem' }}
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.825rem' }}>Nome impresso no Cartão</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nome Completo"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.825rem' }}>CPF / CNPJ do Titular</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#635BFF',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 91, 255, 0.4)',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Lock size={16} />
                  <span>
                    {isProcessing ? 'Processando pagamento seguro...' : `Pagar ${formatCurrencyBRL(plan.priceMonthly)} & Ativar`}
                  </span>
                </button>
              </form>
            ) : (
              /* Pix */
              <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '160px',
                  height: '160px',
                  background: '#F1F5F9',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #00BDAE'
                }}>
                  <QrCode size={120} color="#00BDAE" />
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Escaneie o QR Code no app do seu banco. A liberação do plano é <strong>imediata</strong> após o Pix!
                </p>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#00BDAE',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {isProcessing ? 'Verificando Pix...' : 'Já realizei o Pix (Confirmar)'}
                </button>
              </div>
            )}

            {/* Link Externo do Stripe */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={handleOpenExternalStripe}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: 'underline'
                }}
              >
                <span>Ou pagar diretamente na página oficial hospedada do Stripe</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
