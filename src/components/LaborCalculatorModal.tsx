import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateHourlyRate } from '../utils/calculations';
import { formatCurrencyBRL } from '../utils/formatters';
import { X, ChefHat, Check, HeartHandshake, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LaborCalculatorModalProps {
  onClose: () => void;
}

export const LaborCalculatorModal: React.FC<LaborCalculatorModalProps> = ({ onClose }) => {
  const { user, updateProfile } = useAuth();

  const [desiredSalary, setDesiredSalary] = useState<number>(3500);
  const [fixedCosts, setFixedCosts] = useState<number>(650);
  const [workDays, setWorkDays] = useState<number>(22);
  const [hoursPerDay, setHoursPerDay] = useState<number>(6);

  const totalMonthlyHours = workDays * hoursPerDay;
  const calculatedHourlyRate = calculateHourlyRate(desiredSalary, fixedCosts, workDays, hoursPerDay);

  const handleApplyRate = () => {
    updateProfile({
      hourlyLaborRate: Number(calculatedHourlyRate.toFixed(2)),
      monthlyHoursTarget: totalMonthlyHours
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#68A67D', '#E88B9A', '#F3CA77']
      });
    } catch (e) {}

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #F0F7F2 0%, #FFFDF9 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--sage-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sage-700)'
            }}>
              <ChefHat size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Calculadora de Valor da Hora
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Descubra quanto você deve cobrar pelo seu tempo na cozinha.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            background: 'var(--sage-50)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--sage-300)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <HeartHandshake size={20} color="var(--sage-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.825rem', color: 'var(--sage-700)', lineHeight: 1.45 }}>
              O maior erro de confeiteiras é trabalhar apenas pelo lucro da receita e esquecer de pagar o seu próprio salário. O seu tempo amassando, assando e decorando tem um valor sagrado!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Salário Mensal Desejado (Pró-labore)
              </label>
              <input
                type="number"
                step="100"
                className="form-input"
                value={desiredSalary}
                onChange={(e) => setDesiredSalary(Number(e.target.value))}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Quanto você quer tirar livre para você todo mês.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Custos Fixos Mensais (R$)
              </label>
              <input
                type="number"
                step="50"
                className="form-input"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                MEI, internet, telefone, cursos, manutenções.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Dias de Cozinha por Mês: <strong>{workDays} dias</strong>
              </label>
              <input
                type="range"
                min="10"
                max="28"
                step="1"
                value={workDays}
                onChange={(e) => setWorkDays(Number(e.target.value))}
                style={{ accentColor: 'var(--sage-500)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Geralmente de 20 a 24 dias úteis.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Horas Produtivas por Dia: <strong>{hoursPerDay} horas</strong>
              </label>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                style={{ accentColor: 'var(--sage-500)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tempo real mão na massa na produção.
              </span>
            </div>
          </div>

          {/* Resultado em Destaque */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #F0F7F2 100%)',
            border: '2px solid var(--sage-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sage-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Valor Recomendado da Sua Hora de Trabalho
            </p>
            <p style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--sage-700)', margin: '0.35rem 0' }}>
              {formatCurrencyBRL(calculatedHourlyRate)} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ hora</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Baseado em {totalMonthlyHours} horas mensais de trabalho dedicadas.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleApplyRate} className="btn btn-sage btn-lg">
              <Check size={18} />
              <span>Aplicar R$ {calculatedHourlyRate.toFixed(2)}/h em Todas as Receitas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
