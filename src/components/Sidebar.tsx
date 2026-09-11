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
  ChevronRight
} from 'lucide-react';

export type NavTab = 'dashboard' | 'recipes' | 'ingredients' | 'ai-chef' | 'labor-calc' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPricing: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenPricing
}) => {
  const { isPro } = useAuth();

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
    { id: 'labor-calc' as NavTab, label: 'Calcular Minha Hora', icon: Clock },
    { id: 'settings' as NavTab, label: 'Configurações', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p style={{
          fontSize: '0.725rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          color: 'var(--text-light)',
          letterSpacing: '0.05em',
          padding: '0.2rem 0.75rem 0.5rem'
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
                padding: '0.75rem 0.85rem',
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
                fontSize: '0.925rem',
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
                  size={19} 
                  color={isActive 
                    ? (item.isSpecial ? 'var(--lavender-500)' : 'var(--primary)') 
                    : 'var(--text-muted)'
                  } 
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: isPro ? 'var(--sage-100)' : 'linear-gradient(135deg, #A27BDB 0%, #7653B6 100%)',
                  color: isPro ? 'var(--sage-700)' : '#FFF'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Banner de Upgrade para o Plano PRO se for Free */}
      {!isPro ? (
        <div style={{
          background: 'linear-gradient(145deg, #F9F5FE 0%, #FFF3F5 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1rem',
          border: '1.5px solid var(--lavender-300)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(232, 139, 154, 0.15)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Crown size={18} color="#8E7AC4" />
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#523A84' }}>
              Plano Pro Confeitaria
            </span>
          </div>

          <p style={{ fontSize: '0.775rem', color: 'var(--text-body)', lineHeight: 1.45, marginBottom: '0.9rem' }}>
            Receitas ilimitadas, IA gastronômica para reduzir custos e orçamentos para WhatsApp.
          </p>

          <button
            onClick={onOpenPricing}
            className="btn btn-pro btn-sm"
            style={{ width: '100%', fontSize: '0.825rem', padding: '0.55rem' }}
          >
            <span>Liberar por R$ 29,90</span>
            <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div style={{
          background: 'var(--sage-50)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          border: '1px solid var(--sage-300)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--sage-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--sage-700)'
          }}>
            <Crown size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--sage-700)' }}>
              Assinatura Ativa
            </p>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Acesso total ilimitado
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
