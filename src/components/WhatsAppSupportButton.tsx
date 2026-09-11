import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppSupportButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppSupportButton: React.FC<WhatsAppSupportButtonProps> = ({
  phoneNumber,
  defaultMessage = 'Olá! Gostaria de tirar uma dúvida sobre o DoceLucro / Confeitaria Pro.'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Obtém telefone configurado no localStorage ou variável de ambiente
  const savedPhone = localStorage.getItem('docelucro_support_whatsapp');
  const activePhone = (savedPhone || phoneNumber || import.meta.env.VITE_WHATSAPP_SUPPORT_NUMBER || '5511999999999')
    .replace(/\D/g, '');

  const handleClick = () => {
    const encodedMsg = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${activePhone}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 990,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}
      className="whatsapp-float-container"
    >
      {/* Tooltip convidativo */}
      <div
        style={{
          background: '#FFFFFF',
          color: 'var(--text-main)',
          padding: '0.55rem 0.85rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          animation: 'fadeIn 0.3s ease-in-out'
        }}
        onClick={handleClick}
      >
        <span>Dúvidas? Fale com a gente!</span>
        <span style={{ fontSize: '1rem' }}>💬</span>
      </div>

      {/* Botão Oficial Verde WhatsApp com Efeito Glow */}
      <button
        type="button"
        onClick={handleClick}
        title="Falar com suporte no WhatsApp"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
          transition: 'all 0.25s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.45)';
        }}
      >
        <MessageCircle size={28} />
      </button>

      <style>{`
        @media (max-width: 768px) {
          .whatsapp-float-container {
            bottom: 78px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};
