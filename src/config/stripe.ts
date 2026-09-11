export interface StripePlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  stripePriceId?: string;
  stripePaymentLink: string;
  isPopular?: boolean;
  features: string[];
  limitRecipes: number;
  hasAiChef: boolean;
  hasPdfExport: boolean;
  hasMultipleWorkshops: boolean;
}

const LOCAL_STRIPE_LINKS_KEY = 'confeitapro_stripe_links';

export function getSavedStripeLinks(): { pro: string; master: string } {
  try {
    const saved = localStorage.getItem(LOCAL_STRIPE_LINKS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    pro: import.meta.env.VITE_STRIPE_PAYMENT_LINK_PRO || 'https://buy.stripe.com/test_confeitapro_pro',
    master: import.meta.env.VITE_STRIPE_PAYMENT_LINK_MASTER || 'https://buy.stripe.com/test_confeitapro_master'
  };
}

export function saveStripeLinks(links: { pro: string; master: string }) {
  localStorage.setItem(LOCAL_STRIPE_LINKS_KEY, JSON.stringify(links));
}

const initialLinks = getSavedStripeLinks();

export const STRIPE_PLANS: Record<'free' | 'pro' | 'master', StripePlan> = {
  free: {
    id: 'free',
    name: 'Iniciante Doce',
    tagline: 'Ideal para quem está dando os primeiros passos na confeitaria artesanal.',
    priceMonthly: 0,
    stripePaymentLink: '',
    features: [
      'Até 3 receitas cadastradas',
      'Banco de até 15 ingredientes',
      'Calculadora de custo direto',
      'Cálculo de margem de lucro básica',
      'Suporte comunitário'
    ],
    limitRecipes: 3,
    hasAiChef: false,
    hasPdfExport: false,
    hasMultipleWorkshops: false
  },
  pro: {
    id: 'pro',
    name: 'Confeiteira Pro',
    tagline: 'O plano mais amado! Para quem quer viver da confeitaria e nunca mais ter prejuízo.',
    priceMonthly: 29.90,
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_ID_PRO || 'price_1P_pro_monthly',
    stripePaymentLink: initialLinks.pro,
    isPopular: true,
    features: [
      'Receitas e Ingredientes ILIMITADOS',
      '🤖 Chef IA Exclusiva (Otimização de custos & Legendas)',
      'Calculadora de Mão de Obra e Custos Invisíveis (Gás/Luz)',
      'Gerador de Orçamentos prontos para WhatsApp',
      'Exportação de Fichas Técnicas para impressão',
      'Atualização em cascata de preços de ingredientes',
      'Garantia incondicional de 7 dias'
    ],
    limitRecipes: 9999,
    hasAiChef: true,
    hasPdfExport: true,
    hasMultipleWorkshops: false
  },
  master: {
    id: 'master',
    name: 'Ateliê Master',
    tagline: 'Para negócios com equipe, produção sob demanda e alto volume.',
    priceMonthly: 49.90,
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_ID_MASTER || 'price_1P_master_monthly',
    stripePaymentLink: initialLinks.master,
    features: [
      'Tudo do Plano Pro incluído',
      'Gestão de Múltiplos Cardápios e Festas',
      'Controle de Pedidos e Calendário de Entregas',
      'Acesso para até 3 colaboradoras da cozinha',
      'Suporte prioritário VIP via WhatsApp',
      'Treinamento de Precificação em Vídeo incluso'
    ],
    limitRecipes: 9999,
    hasAiChef: true,
    hasPdfExport: true,
    hasMultipleWorkshops: true
  }
};

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  customerPortalUrl: import.meta.env.VITE_STRIPE_PORTAL_URL || 'https://billing.stripe.com/p/login/test'
};
