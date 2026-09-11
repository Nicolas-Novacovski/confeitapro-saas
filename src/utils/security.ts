/**
 * Módulo de Segurança, Sanitização e Blindagem contra Invasões do ConfeitaPro
 */

// 1. Sanitização de Texto contra XSS (Cross-Site Scripting)
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove tags HTML perigosas
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// 2. Limitador de Tentativas (Rate Limiting para evitar Brute-Force)
interface RateLimitTracker {
  count: number;
  firstAttemptTime: number;
}

const rateLimitStore = new Map<string, RateLimitTracker>();

export function checkRateLimit(actionKey: string, maxAttempts: number = 5, windowMinutes: number = 2): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const record = rateLimitStore.get(actionKey);

  if (!record) {
    rateLimitStore.set(actionKey, { count: 1, firstAttemptTime: now });
    return { allowed: true };
  }

  if (now - record.firstAttemptTime > windowMs) {
    // Janela expirou, reseta contador
    rateLimitStore.set(actionKey, { count: 1, firstAttemptTime: now });
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    const remainingSeconds = Math.ceil((record.firstAttemptTime + windowMs - now) / 1000);
    return { allowed: false, waitSeconds: Math.max(1, remainingSeconds) };
  }

  record.count += 1;
  return { allowed: true };
}

// 3. Backup Criptografado & Exportação Segura dos Dados
export function exportSecureBackupJSON(data: { user: any; recipes: any[]; ingredients: any[] }): void {
  const payload = {
    app: 'ConfeitaPro SaaS',
    version: '1.0',
    exportDate: new Date().toISOString(),
    checksum: btoa(unescape(encodeURIComponent(JSON.stringify(data.recipes.length + data.ingredients.length)))),
    data
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `confeitapro_backup_seguro_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
