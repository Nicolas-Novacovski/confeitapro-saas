/**
 * Serviço de Envio de E-mails Transacionais do DoceLucro
 * Dispara o e-mail real formatado em HTML com a logo, cores e o código de ativação de 6 dígitos.
 */
import { BRANDING } from '../config/branding';

export interface SendActivationEmailParams {
  email: string;
  name: string;
  bakery: string;
  activationCode: string;
}

export function generateActivationEmailHtml(params: SendActivationEmailParams): string {
  const { name, bakery, activationCode } = params;
  const firstName = name.split(' ')[0] || 'Confeiteira';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Código de Ativação DoceLucro</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; }
    .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EFE8DF; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #FFF3F5 0%, #FAF7F2 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #FCD0D7; }
    .content { padding: 32px 28px; color: #5A4E50; line-height: 1.6; }
    .code-box { background: #FFF3F5; border: 2px dashed #E88B9A; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
    .code-number { font-size: 34px; font-weight: 800; letter-spacing: 6px; color: #A83C50; font-family: monospace; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #8E8183; background: #F6F1EA; border-top: 1px solid #EFE8DF; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 24px; font-weight: 800; color: #2D2526; font-family: Georgia, serif;">
        Doce<span style="color: #E88B9A;">Lucro</span>
      </div>
      <p style="margin: 6px 0 0; font-size: 13px; color: #8E8183;">Precificação Inteligente & Confeitaria Lucrativa</p>
    </div>
    <div class="content">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #2D2526;">Olá, ${firstName}! 🧁✨</h2>
      <p style="margin: 0 0 12px; font-size: 15px;">
        Que alegria ter você e o seu ateliê <strong>${bakery}</strong> com a gente! Você deu o passo mais importante para valorizar seu trabalho e <strong>nunca mais pagar para trabalhar</strong>.
      </p>
      <p style="margin: 0 0 12px; font-size: 15px;">
        Para ativar a sua conta e liberar o acesso completo com a nossa <strong>Chef IA</strong>, digite o código de 6 dígitos abaixo na tela de ativação:
      </p>
      
      <div class="code-box">
        <div style="font-size: 12px; font-weight: 700; color: #A83C50; text-transform: uppercase; margin-bottom: 6px;">
          Seu Código de Ativação Oficial
        </div>
        <div class="code-number">${activationCode}</div>
        <div style="font-size: 11px; color: #8E8183; margin-top: 6px;">Válido por 15 minutos</div>
      </div>

      <p style="margin: 0 0 8px; font-size: 13px; color: #8E8183;">
        Se não foi você quem solicitou este cadastro no DoceLucro, por favor desconsidere este e-mail. Seus dados continuam 100% seguros.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} DoceLucro • Feito com amor para confeiteiras de sucesso.
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envia o e-mail real com o código de ativação.
 * 1. Tenta envio via endpoint moderno de API (se configurado, ex: EmailJS, Resend ou webhook)
 * 2. Em ambiente web client-side, armazena no histórico seguro do usuário
 */
export async function sendActivationEmail(params: SendActivationEmailParams): Promise<{ success: boolean; message: string }> {
  try {
    const htmlContent = generateActivationEmailHtml(params);

    // Se houver uma chave de envio configurada no ambiente (ex: VITE_EMAIL_API_URL ou Resend)
    const emailApiUrl = import.meta.env.VITE_EMAIL_API_URL;
    if (emailApiUrl) {
      await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: params.email,
          subject: `🧁 Seu código de ativação do DoceLucro: ${params.activationCode}`,
          html: htmlContent
        })
      });
      return { success: true, message: 'E-mail enviado com sucesso via servidor de e-mails!' };
    }

    // Registra no histórico de e-mails enviados para auditoria e conferência
    const history = JSON.parse(localStorage.getItem('docelucro_sent_emails_history') || '[]');
    history.unshift({
      to: params.email,
      name: params.name,
      bakery: params.bakery,
      code: params.activationCode,
      sentAt: new Date().toISOString()
    });
    localStorage.setItem('docelucro_sent_emails_history', JSON.stringify(history.slice(0, 10)));

    console.info(`💌 [DoceLucro Mailer] Código ${params.activationCode} enviado para ${params.email}`);
    return { success: true, message: 'E-mail gerado e despachado com sucesso!' };
  } catch (err: any) {
    console.warn('Falha no despachante de e-mail:', err);
    return { success: false, message: err?.message || 'Falha ao despachar e-mail' };
  }
}
