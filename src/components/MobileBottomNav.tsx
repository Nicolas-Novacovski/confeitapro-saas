import React from 'react';
import { NavTab } from './Sidebar';
import { LayoutDashboard, BookOpen, UtensilsCrossed, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMoreMenu
}) => {
  const { isPro } = useAuth();

  return (
    <nav className="mobile-bottom-nav">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
      >
        <LayoutDashboard size={20} />
        <span>Início</span>
      </button>

      <button
        onClick={() => onSelectTab('recipes')}
        className={`mobile-nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
      >
        <BookOpen size={20} />
        <span>Receitas</span>
      </button>

      <button
        onClick={() => onSelectTab('ingredients')}
        className={`mobile-nav-item ${activeTab === 'ingredients' ? 'active' : ''}`}
      >
        <UtensilsCrossed size={20} />
        <span>Insumos</span>
      </button>

      <button
        onClick={() => onSelectTab('ai-chef')}
        className={`mobile-nav-item ${activeTab === 'ai-chef' ? 'active' : ''}`}
        style={{ position: 'relative' }}
      >
        <Sparkles size={20} color={activeTab === 'ai-chef' ? 'var(--lavender-500)' : undefined} />
        <span style={{ color: activeTab === 'ai-chef' ? 'var(--lavender-700)' : undefined }}>Chef IA</span>
        {!isPro && (
          <span style={{
            position: 'absolute',
            top: '3px',
            right: '18%',
            fontSize: '0.55rem',
            background: 'linear-gradient(135deg, #A27BDB 0%, #7653B6 100%)',
            color: '#FFF',
            padding: '1px 3px',
            borderRadius: '3px',
            fontWeight: 800
          }}>
            PRO
          </span>
        )}
      </button>

      <button
        onClick={onOpenMoreMenu}
        className="mobile-nav-item"
      >
        <Menu size={20} />
        <span>Mais</span>
      </button>
    </nav>
  );
};
