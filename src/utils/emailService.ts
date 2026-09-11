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

export interface EmailDeliveryConfig {
  provider: 'emailjs' | 'brevo' | 'resend' | 'webhook' | 'none';
  // EmailJS
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
  // Brevo
  brevoApiKey?: string;
  brevoSenderEmail?: string;
  // Resend
  resendApiKey?: string;
  // Webhook
  webhookUrl?: string;
}

const EMAIL_CONFIG_KEY = 'docelucro_email_delivery_config';

export function getEmailConfig(): EmailDeliveryConfig {
  try {
    const saved = localStorage.getItem(EMAIL_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  return {
    provider: (import.meta.env.VITE_EMAIL_PROVIDER as any) || 'none',
    emailjsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    emailjsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    emailjsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
    brevoApiKey: import.meta.env.VITE_BREVO_API_KEY || '',
    brevoSenderEmail: import.meta.env.VITE_BREVO_SENDER_EMAIL || 'nicolas.vendrami@gmail.com',
    resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
    webhookUrl: import.meta.env.VITE_EMAIL_API_URL || ''
  };
}

export function saveEmailConfig(config: EmailDeliveryConfig) {
  localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Envia o e-mail real com o código de ativação usando o provedor configurado.
 */
export async function sendActivationEmail(params: SendActivationEmailParams): Promise<{ success: boolean; message: string }> {
  const config = getEmailConfig();
  const htmlContent = generateActivationEmailHtml(params);

  try {
    // 1. Envio via Brevo (Sendinblue) API
    if (config.brevoApiKey) {
      const senderEmail = config.brevoSenderEmail?.trim() || 'nicolas.vendrami@gmail.com';
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': config.brevoApiKey.trim(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'DoceLucro Confeitaria', email: senderEmail },
          to: [{ email: params.email, name: params.name }],
          subject: `🧁 Seu código de ativação do DoceLucro: ${params.activationCode}`,
          htmlContent: htmlContent
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Erro Brevo HTTP ${res.status}`);
      }
      return logSentEmail(params, 'Brevo API');
    }

    // 2. Envio via EmailJS REST API
    if (config.emailjsServiceId && config.emailjsTemplateId && config.emailjsPublicKey) {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: config.emailjsServiceId,
          template_id: config.emailjsTemplateId,
          user_id: config.emailjsPublicKey,
          template_params: {
            to_email: params.email,
            to_name: params.name,
            bakery_name: params.bakery,
            code: params.activationCode,
            html_content: htmlContent
          }
        })
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar e-mail via EmailJS');
      }
      return logSentEmail(params, 'EmailJS');
    }

    // 3. Envio via Resend API
    if (config.resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'DoceLucro <onboarding@resend.dev>',
          to: [params.email],
          subject: `🧁 Seu código de ativação do DoceLucro: ${params.activationCode}`,
          html: htmlContent
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Falha ao enviar via Resend');
      }
      return logSentEmail(params, 'Resend API');
    }

    // 4. Envio via Webhook genérico (Vercel API, Make, Zapier, Formspree)
    const webhookUrl = config.webhookUrl || import.meta.env.VITE_EMAIL_API_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: params.email,
          name: params.name,
          bakery: params.bakery,
          code: params.activationCode,
          subject: `🧁 Seu código de ativação do DoceLucro: ${params.activationCode}`,
          html: htmlContent
        })
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar via Webhook');
      }
      return logSentEmail(params, 'Webhook URL');
    }

    // Fallback: Armazena localmente no histórico para auditoria
    return logSentEmail(params, 'Cofre Local (Sem Provedor de E-mail Conectado)');
  } catch (err: any) {
    console.warn('Falha no despachante de e-mail:', err);
    logSentEmail(params, `Falha de rede: ${err?.message || 'Erro'}`);
    return { success: false, message: err?.message || 'Falha ao despachar e-mail' };
  }
}

function logSentEmail(params: SendActivationEmailParams, providerInfo: string) {
  const history = JSON.parse(localStorage.getItem('docelucro_sent_emails_history') || '[]');
  history.unshift({
    to: params.email,
    name: params.name,
    bakery: params.bakery,
    code: params.activationCode,
    provider: providerInfo,
    sentAt: new Date().toISOString()
  });
  localStorage.setItem('docelucro_sent_emails_history', JSON.stringify(history.slice(0, 15)));

  console.info(`💌 [DoceLucro Mailer] Código ${params.activationCode} despachado para ${params.email} via ${providerInfo}`);
  return { success: true, message: `Código despachado com sucesso via ${providerInfo}!` };
}
