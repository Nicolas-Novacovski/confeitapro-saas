import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Plus, ChefHat, LogIn, Crown, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { BRANDING } from '../config/branding';

interface NavbarProps {
  onOpenNewRecipe: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenLaborCalc: () => void;
  onOpenActiveSession?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewRecipe,
  onOpenPricing,
  onOpenAuth,
  onOpenLaborCalc,
  onOpenActiveSession,
  onToggleMobileMenu
}) => {
  const { user, isPro, logout } = useAuth();

  return (
    <header className="navbar" style={{
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Botão Hambúrguer Mobile */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="btn btn-ghost btn-sm mobile-only"
            style={{ padding: '0.4rem', marginRight: '0.2rem' }}
            title="Abrir Menu"
          >
            <Menu size={22} color="var(--text-main)" />
          </button>
        )}

        {/* Logo & Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img 
            src={BRANDING.logoUrl} 
            alt={BRANDING.name}
            className="brand-logo-img"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {BRANDING.prefix}<span style={{ color: 'var(--primary)' }}>{BRANDING.suffix}</span>
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '0.12rem 0.4rem',
                borderRadius: '6px',
                background: isPro ? 'linear-gradient(135deg, #9C78DC 0%, #7653B6 100%)' : 'var(--bg-subtle)',
                color: isPro ? '#FFF' : 'var(--text-muted)',
                letterSpacing: '0.04em'
              }}>
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
              {user?.bakeryName || 'Minha Confeitaria'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Botão de Upgrade Pro se for Free */}
        {!isPro ? (
          <button
            onClick={onOpenPricing}
            className="btn btn-pro btn-sm pulse-pro"
            style={{ fontWeight: 700, padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Crown size={15} />
            <span className="desktop-only">Assinar Plano PRO</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '0.1rem 0.35rem',
              borderRadius: '4px',
              fontSize: '0.7rem'
            }}>
              R$ 29,90
            </span>
          </button>
        ) : (
          <div className="desktop-only" style={{
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--lavender-50)',
            border: '1px solid var(--lavender-300)',
            color: 'var(--lavender-700)',
            fontSize: '0.775rem',
            fontWeight: 700
          }}>
            <Sparkles size={14} />
            <span>Plano Pro Ativo</span>
          </div>
        )}

        {/* Calculadora de Hora rápida (visível em desktop/tablet) */}
        <button
          onClick={onOpenLaborCalc}
          className="btn btn-secondary btn-sm desktop-only"
          title="Calcular o valor da sua hora de trabalho"
        >
          <ChefHat size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem' }}>
            R$ {user?.hourlyLaborRate?.toFixed(2) || '25.00'}/h
          </span>
        </button>

        {/* Botão Adicionar Receita */}
        <button
          onClick={onOpenNewRecipe}
          className="btn btn-primary btn-sm"
          style={{ padding: '0.5rem 0.85rem' }}
        >
          <Plus size={16} />
          <span className="desktop-only">Nova Receita</span>
        </button>

        {/* Usuário / Login / Sessão Ativa */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={onOpenActiveSession || onOpenAuth}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '0.35rem 0.65rem 0.35rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              title={`Sessão ativa: ${user.displayName || user.email}. Clique para ver detalhes da sessão.`}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FCD0D7 0%, #E88B9A 100%)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {(user.displayName || user.email || 'C')[0].toUpperCase()}
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  border: '1.5px solid #FFFFFF'
                }} />
              </div>

              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                  {user.displayName.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.675rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                  Sessão Ativa
                </span>
              </div>
            </button>

            <button
              onClick={logout}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
              title="Sair da Conta (Fazer Logoff)"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn btn-secondary btn-sm"
          >
            <LogIn size={16} />
            <span>Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
};
