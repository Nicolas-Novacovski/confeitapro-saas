import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Plus, ChefHat, LogIn, Crown, LogOut, Menu } from 'lucide-react';
import { BRANDING } from '../config/branding';
import Swal from 'sweetalert2';

interface NavbarProps {
  onOpenNewRecipe: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenLaborCalc: () => void;
  onOpenActiveSession?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewRecipe, // Mantido na interface para não quebrar o App.tsx, mas o botão foi removido
  onOpenPricing,
  onOpenAuth,
  onOpenLaborCalc,
  onOpenActiveSession,
  onToggleMobileMenu
}) => {
  const { user, isPro, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: 'Sair da conta?',
      text: 'Tem certeza que deseja desconectar do seu ateliê?',
      icon: 'warning',
      iconColor: '#FDA4AF',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
        actions: 'custom-swal-actions'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
      }
    });
  };

  return (
    <>
      <style>{`
        .custom-swal-popup { border-radius: 16px !important; padding: 1.5rem 1.25rem !important; box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; }
        .custom-swal-title { font-family: ui-sans-serif, system-ui, sans-serif !important; font-weight: 700 !important; color: #334155 !important; font-size: 1.25rem !important; }
        .custom-swal-text { color: #64748B !important; font-size: 0.9rem !important; margin-top: 0.35rem !important; }
        .custom-swal-actions { gap: 0.75rem; margin-top: 1.5rem !important; width: 100%; justify-content: center; display: flex; }
        .custom-swal-confirm { 
          background: #FFF1F2 !important; 
          color: #E11D48 !important; 
          border: 1px solid #FECDD3 !important; 
          border-radius: 8px !important; 
          padding: 0.6rem 1.25rem !important; 
          font-weight: 600 !important; 
          font-size: 0.875rem !important;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: none !important;
        }
        .custom-swal-confirm:hover { background: #FFE4E6 !important; }
        .custom-swal-cancel { 
          background: #F8FAFC !important; 
          color: #64748B !important; 
          border: 1px solid #E2E8F0 !important; 
          border-radius: 8px !important; 
          font-weight: 600 !important; 
          font-size: 0.875rem !important;
          padding: 0.6rem 1.25rem !important;
          cursor: pointer;
          transition: all 0.2s;
        }
        .custom-swal-cancel:hover { background: #F1F5F9 !important; color: #475569 !important; }
      `}</style>

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
        {/* Lado Esquerdo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
            <img 
              src={BRANDING.logoUrl} 
              alt={BRANDING.name}
              style={{ width: '28px', height: '28px' }}
            />
            <span className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {BRANDING.prefix}<span style={{ color: 'var(--primary)' }}>{BRANDING.suffix}</span>
            </span>
          </div>
        </div>

        {/* Lado Direito */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

          {/* O botão "Nova Receita" foi removido daqui */}

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
                title={`Sessão ativa: ${user.displayName || user.email}. Clique para ver detalhes.`}
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

                <div className="desktop-only" style={{ textAlign: 'left', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                    {user.displayName.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.675rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                    Sessão Ativa
                  </span>
                </div>
              </button>

              <button
                onClick={handleLogout}
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
              <span className="desktop-only">Entrar</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
};