import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  UtensilsCrossed, 
  Sparkles, 
  Clock, 
  Settings, 
  TrendingDown, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { BRANDING } from '../config/branding';

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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  // Mantemos apenas isPro e isAdmin para gerenciar as cores e tags (badges) do menu
  const { isPro, isAdmin } = useAuth();

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

  const renderNavContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        
        {/* Topo da Sidebar: Logo Maior e Clicável */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.25rem 0.5rem 0.5rem',
          marginBottom: '0.25rem'
        }}>
          <div 
            onClick={() => {
              onSelectTab('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            title="Ir para a Visão Geral"
          >
            <img 
              src={BRANDING.logoUrl} 
              alt={BRANDING.name} 
              className="brand-logo-img" 
              style={{ width: '44px', height: '44px' }} 
            />
            <div>
              <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }}>
                {BRANDING.prefix}<span style={{ color: 'var(--primary)' }}>{BRANDING.suffix}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Gestão & Lucratividade
              </span>
            </div>
          </div>
          
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="btn btn-ghost btn-sm mobile-only"
              style={{ padding: '0.35rem' }}
              title="Fechar Menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

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
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
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
    </div>
  );

  return (
    <>
      <aside 
        className="desktop-only"
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#FFFFFF',
          borderRight: '1px solid var(--border-light)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1rem',
          flexShrink: 0,
          overflowY: 'auto',
          zIndex: 30
        }}
      >
        {renderNavContent()}
      </aside>

      {isMobileOpen && (
        <div className="mobile-drawer-overlay" onClick={onCloseMobile}>
          <div 
            className="mobile-drawer-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '1.25rem 1rem' }}
          >
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};