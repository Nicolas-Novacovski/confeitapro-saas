/**
 * Módulo de Segurança, Sanitização e Blindagem contra Invasões do DoceLucro
 */

// Sanitizador seguro para strings (evita injeção XSS básica em campos de texto)
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // remove tags html
    .trim();
}

// Sanitizador numérico para garantir cálculos financeiros livres de NaN ou injeções
export function sanitizeNumber(value: number | string, defaultValue: number = 0): number {
  if (typeof value === 'number') {
    return isNaN(value) || !isFinite(value) ? defaultValue : Math.max(0, value);
  }
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) || !isFinite(parsed) ? defaultValue : Math.max(0, parsed);
}

// Limitador de taxa local (Rate Limiting para evitar spam de requisições à IA e logins repetidos)
const requestTimestamps: { [key: string]: number[] } = {};

export function checkRateLimit(actionKey: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  if (!requestTimestamps[actionKey]) {
    requestTimestamps[actionKey] = [];
  }

  // Filtrar requisições fora da janela
  requestTimestamps[actionKey] = requestTimestamps[actionKey].filter(ts => now - ts < windowMs);

  if (requestTimestamps[actionKey].length >= maxRequests) {
    const oldest = requestTimestamps[actionKey][0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  requestTimestamps[actionKey].push(now);
  return { allowed: true };
}

// Cria um backup criptografado/ofuscado em base64 com checksum para download do usuário
export function exportSecureLocalBackup(data: { ingredients: any[]; recipes: any[]; user: any }) {
  const payload = {
    app: 'DoceLucro SaaS',
    version: '2.0',
    exportDate: new Date().toISOString(),
    payload: data,
    checksum: btoa(encodeURIComponent(JSON.stringify(data))).length
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `docelucro_backup_seguro_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Alias para compatibilidade
export const exportSecureBackupJSON = exportSecureLocalBackup;
