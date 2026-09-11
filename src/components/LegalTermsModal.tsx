import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { BRANDING } from '../config/branding';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms'
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1100,
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        inset: 0,
        background: 'rgba(30, 24, 25, 0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.75rem',
          borderRadius: 'var(--radius-xl)',
          margin: 'auto',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--lavender-50)',
              color: 'var(--lavender-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeTab === 'terms' ? <FileText size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {activeTab === 'terms' ? 'Termos de Uso do Serviço' : 'Política de Privacidade & LGPD'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {BRANDING.name} • Atualizado em Setembro de 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.35rem',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Seletor de Abas */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'terms' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'terms' ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: activeTab === 'terms' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Termos de Uso
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'privacy' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'privacy' ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: activeTab === 'privacy' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Política de Privacidade (LGPD)
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          fontSize: '0.85rem',
          lineHeight: 1.65,
          color: 'var(--text-body)',
          paddingRight: '0.5rem'
        }}>
          {activeTab === 'terms' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  1. Finalidade da Plataforma
                </h3>
                <p>
                  O <strong>{BRANDING.name}</strong> é um software como serviço (SaaS) projetado para auxiliar profissionais de confeitaria, panificação e docerias na precificação precisa de receitas, gestão de custos e auxílio estratégico com Inteligência Artificial.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  2. Assinaturas, Pagamento & Cancelamento Stripe
                </h3>
                <p>
                  Os planos de assinatura (Confeiteira Pro e Ateliê Master) operam em modelo de recorrência mensal gerenciada de forma segura pelo <strong>Stripe</strong>. O assinante pode cancelar sua assinatura a qualquer momento através do painel de Configurações, interrompendo imediatamente futuras cobranças sem multas ou taxas rescisórias.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  3. Propriedade Intelectual das Receitas
                </h3>
                <p>
                  Todas as fórmulas, fichas técnicas, segredos de receitas e dados inseridos pelo usuário são de <strong>exclusiva propriedade da confeiteira</strong>. O {BRANDING.name} não reivindica qualquer direito de propriedade sobre suas criações culinárias.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  4. Responsabilidade Financeira e Sugestões da Chef IA
                </h3>
                <p>
                  As sugestões geradas pela Chef IA e os cálculos fornecidos são ferramentas analíticas de apoio à decisão. A precificação final ao consumidor e a gestão tributária/financeira permanecem sob a responsabilidade do titular do ateliê.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  1. Compromisso com a Privacidade (Lei 13.709/2018 - LGPD)
                </h3>
                <p>
                  O {BRANDING.name} respeita integralmente a privacidade dos seus usuários. Cumprimos rigorosamente as diretrizes da Lei Geral de Proteção de Dados (LGPD), garantindo transparência, consentimento e segurança.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  2. Quais Dados Coletamos
                </h3>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.3rem' }}>
                  <li><strong>Dados Cadastrais:</strong> Nome completo, endereço de e-mail e nome da confeitaria/ateliê.</li>
                  <li><strong>Dados Operacionais:</strong> Ingredientes, receitas, fichas técnicas e estimativas de tempo de preparo.</li>
                  <li><strong>Dados de Pagamento:</strong> Processados diretamente pelo Stripe com conformidade PCI-DSS. Não armazenamos números de cartão de crédito.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  3. Segurança & Criptografia das Senhas
                </h3>
                <p>
                  Senhas de acesso são protegidas por algoritmos de dispersão criptográfica (SHA-256 com salting dinâmico). Nenhuma senha é salva em texto plano em nossos bancos de dados.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  4. Não Compartilhamento com Terceiros
                </h3>
                <p>
                  O {BRANDING.name} <strong>nunca vende, aluga ou transfere</strong> dados pessoais ou receitas para terceiros para fins de marketing ou publicidade.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  5. Direitos do Titular & Exclusão de Conta
                </h3>
                <p>
                  Você tem o direito de solicitar cópia ou a exclusão permanente de todos os seus dados a qualquer momento através do suporte ou do próprio painel de gerenciamento.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Botão Fechar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={onClose} className="btn btn-primary btn-sm">
            Entendi e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
