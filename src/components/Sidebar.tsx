import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  UtensilsCrossed, 
  Sparkles, 
  Clock, 
  Settings, 
  Crown,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'recipes' 
  | 'ingredients' 
  | 'ai-chef' 
  | 'labor-calc' 
  | 'roi-calc' 
  | 'security' 
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPricing: () => void;
  onOpenLoginPage: () => void;
  onOpenActiveSession?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenPricing,
  onOpenLoginPage,
  onOpenActiveSession
}) => {
  const { isPro, user, logout, isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'recipes' as NavTab, label: 'Minhas Receitas', icon: BookOpen },
    { id: 'ingredients' as NavTab, label: 'Ingredientes & Preços', icon: UtensilsCrossed },
    { 
      id: 'ai-chef' as NavTab, 
      label: 'Chef IA Confeiteira', 
      icon: Sparkles,
      badge: 'PRO',
      isSpecial: true
    },
    { 
      id: 'roi-calc' as NavTab, 
      label: 'Calculadora de Prejuízo', 
      icon: TrendingDown,
      badge: 'NOVO',
      badgeColor: '#EF4444'
    },
    { id: 'labor-calc' as NavTab, label: 'Calcular Minha Hora', icon: Clock },
    ...(isAdmin ? [{ 
      id: 'security' as NavTab, 
      label: 'Blindagem & Segurança', 
      icon: ShieldCheck,
      badge: 'DEV',
      badgeColor: '#6366F1'
    }] : []),
    { id: 'settings' as NavTab, label: 'Configurações', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#FFFFFF',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1rem',
      flexShrink: 0,
      overflowY: 'auto',
      zIndex: 30
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <p style={{
          fontSize: '0.725rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          color: 'var(--text-light)',
          letterSpacing: '0.05em',
          padding: '0.2rem 0.75rem 0.4rem'
        }}>
          Menu Principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive 
                  ? (item.isSpecial ? 'var(--lavender-50)' : 'var(--primary-50)') 
                  : 'transparent',
                color: isActive 
                  ? (item.isSpecial ? 'var(--lavender-700)' : 'var(--primary-dark)') 
                  : 'var(--text-body)',
                border: '1px solid',
                borderColor: isActive 
                  ? (item.isSpecial ? 'var(--lavender-300)' : 'var(--primary-200)') 
                  : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-body)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon 
                  size={18} 
                  color={isActive 
                    ? (item.isSpecial ? 'var(--lavender-500)' : 'var(--primary)') 
                    : 'var(--text-muted)'
                  } 
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  background: item.badgeColor ? '#FEE2E2' : isPro ? 'var(--sage-100)' : 'linear-gradient(135deg, #A27BDB 0%, #7653B6 100%)',
                  color: item.badgeColor || (isPro ? 'var(--sage-700)' : '#FFF')
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem' }}>
        {/* Banner de Upgrade para o Plano PRO se for Free */}
        {!isPro ? (
          <div style={{
            background: 'linear-gradient(145deg, #F9F5FE 0%, #FFF3F5 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem 1rem',
            border: '1.5px solid var(--lavender-300)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Crown size={16} color="#8E7AC4" />
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#523A84' }}>
                Plano Pro Confeitaria
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              Receitas ilimitadas, IA gastronômica para reduzir custos e orçamentos para WhatsApp.
            </p>

            <button
              onClick={onOpenPricing}
              className="btn btn-pro btn-sm"
              style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
            >
              <span>Liberar por R$ 29,90</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--sage-50)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            border: '1px solid var(--sage-300)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <Crown size={18} color="var(--sage-700)" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sage-700)' }}>
                Assinatura Pro Ativa
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Acesso total liberado
              </p>
            </div>
          </div>
        )}

        {/* Card da Sessão Ativa e Logoff */}
        {user ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '0.75rem',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div 
              onClick={onOpenActiveSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: onOpenActiveSession ? 'pointer' : 'default'
              }}
              title="Clique para ver detalhes da sessão ou gerenciar assinatura"
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FCD0D7 0%, #E88B9A 100%)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {(user.displayName || user.email || 'C')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    display: 'inline-block'
                  }} />
                  <strong style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {user.displayName}
                  </strong>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {user.bakeryName}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
              {onOpenActiveSession && (
                <button
                  type="button"
                  onClick={onOpenActiveSession}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1, fontSize: '0.725rem', padding: '0.35rem 0.4rem', color: 'var(--text-body)' }}
                >
                  <UserCheck size={13} />
                  <span>Sessão</span>
                </button>
              )}
              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost btn-sm"
                style={{ flex: 1, fontSize: '0.725rem', padding: '0.35rem 0.4rem', color: '#E11D48' }}
                title="Desconectar do ConfeitaPro e voltar para a tela de login"
              >
                <LogOut size={13} />
                <span>Sair (Logoff)</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenLoginPage}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem', gap: '0.4rem' }}
          >
            <LogIn size={15} />
            <span>Fazer Login</span>
          </button>
        )}
      </div>
    </aside>
  );
};
