import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Laptop, 
  Crown, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { formatCurrencyBRL } from '../utils/formatters';
import { STRIPE_PLANS } from '../config/stripe';

interface ActiveSessionModalProps {
  onClose: () => void;
  onOpenPricing: () => void;
}

export const ActiveSessionModal: React.FC<ActiveSessionModalProps> = ({ onClose, onOpenPricing }) => {
  const { user, logout, cancelSubscription, isPro, isMaster } = useAuth();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  if (!user) return null;

  const currentPlan = STRIPE_PLANS[user.plan || 'free'];

  // Formata o horário do login
  const sessionTimeFormatted = user.sessionStartedAt
    ? new Date(user.sessionStartedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const sessionDateFormatted = user.sessionStartedAt
    ? new Date(user.sessionStartedAt).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');

  const handleConfirmCancelPlan = () => {
    cancelSubscription();
    setShowCancelConfirm(false);
    setCancelFeedback('Sua assinatura foi cancelada com sucesso. Nenhuma nova cobrança será efetuada.');
    setTimeout(() => {
      setCancelFeedback(null);
    }, 4500);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Cabeçalho */}
        <div style={{
          background: 'linear-gradient(135deg, #FAF4FC 0%, #FFF3F5 100%)',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FCD0D7 0%, #E88B9A 100%)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(232, 139, 154, 0.3)'
            }}>
              {(user.displayName || user.email || 'C')[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Sessão Ativa do Usuário
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
                  boxShadow: '0 0 6px #22C55E'
                }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                  Online & Conectado com Sucesso
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.35rem' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {cancelFeedback && (
            <div style={{
              background: 'var(--sage-50)',
              border: '1px solid var(--sage-300)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--sage-700)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <CheckCircle2 size={16} />
              <span>{cancelFeedback}</span>
            </div>
          )}

          {/* Dados do Usuário */}
          <div style={{
            background: 'var(--bg-canvas)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Nome Confeiteira
                </span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.displayName}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Ateliê / Negócio
                </span>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user.bakeryName}
                </p>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  E-mail de Acesso
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Informações Técnicas da Sessão */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Detalhes da Conexão Atual
            </span>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-body)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--primary)" />
                Início da Sessão:
              </span>
              <strong>{sessionDateFormatted} às {sessionTimeFormatted}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-body)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Laptop size={14} color="var(--lavender-500)" />
                Dispositivo:
              </span>
              <span>Navegador Web Seguro (PC / Desktop)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-body)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--sage-700)" />
                Persistência de Sessão:
              </span>
              <span style={{ color: 'var(--sage-700)', fontWeight: 600 }}>Ativa (Mantém conectado ao reabrir)</span>
            </div>
          </div>

          {/* Gestão do Plano & Cancelamento de Assinatura */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            border: isPro ? '1.5px solid var(--lavender-300)' : '1px solid var(--border-light)',
            background: isPro ? 'linear-gradient(135deg, #FAF7FF 0%, #FFFFFF 100%)' : '#FFFFFF',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Crown size={18} color={isPro ? 'var(--lavender-500)' : 'var(--text-muted)'} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {currentPlan.name}
                </span>
              </div>
              <span className={`badge ${isPro ? 'badge-pro' : 'badge-rose'}`} style={{ fontSize: '0.7rem' }}>
                {isPro ? 'ASSINATURA ATIVA' : 'GRATUITO'}
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {isPro ? (
                <>Sua assinatura está ativa no valor de <strong>{formatCurrencyBRL(currentPlan.priceMonthly)}/mês</strong> com acesso ilimitado à Chef IA e precificações.</>
              ) : (
                'Você está no plano gratuito com até 5 receitas salvas.'
              )}
            </p>

            {isPro ? (
              <div>
                {!showCancelConfirm ? (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#E11D48', borderColor: '#FECDD3', background: '#FFF1F2' }}
                    >
                      <span>Cancelar Assinatura / Cortar Cobrança</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPricing();
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.775rem' }}
                    >
                      Alterar Plano
                    </button>
                  </div>
                ) : (
                  <div style={{
                    background: '#FFF1F2',
                    border: '1px solid #FDA4AF',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      <AlertTriangle size={18} color="#E11D48" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: '#9F1239', display: 'block' }}>
                          Confirmar Cancelamento da Assinatura?
                        </strong>
                        <p style={{ fontSize: '0.775rem', color: '#9F1239', marginTop: '2px', lineHeight: 1.4 }}>
                          Ao cancelar, sua assinatura será interrompida imediatamente, <strong>cortando qualquer cobrança futura do Stripe</strong>. Você retornará ao plano Grátis e não terá mais acesso à Chef IA.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Manter Minha Assinatura
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmCancelPlan}
                        className="btn btn-sm"
                        style={{ background: '#E11D48', color: '#FFF', border: 'none', fontWeight: 700 }}
                      >
                        Sim, Cancelar e Cortar Cobrança
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="btn btn-pro btn-sm"
                style={{ width: '100%' }}
              >
                <Crown size={15} />
                <span>Assinar Plano PRO por R$ 29,90/mês</span>
              </button>
            )}
          </div>

          {/* Botão de LOGOFF / SAIR DA CONTA */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{
                width: '100%',
                color: '#E11D48',
                borderColor: '#FECDD3',
                gap: '0.5rem',
                fontWeight: 700,
                padding: '0.75rem'
              }}
            >
              <LogOut size={16} />
              <span>Sair da Conta (Fazer Logoff)</span>
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Ao deslogar, você voltará para a tela de login. Ao reabrir o site deslogado, será exigido login novamente.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
