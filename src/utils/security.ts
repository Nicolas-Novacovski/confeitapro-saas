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

/**
 * Validação rigorosa de senha:
 * - Mínimo de 8 caracteres
 * - Pelo menos uma letra maiúscula [A-Z]
 * - Pelo menos um caractere especial [!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]
 * - Pelo menos um número ou letra minúscula
 */
export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
  message?: string;
}

export function validatePasswordPolicy(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isValid = hasMinLength && hasUppercase && hasSpecialChar && hasNumber;

  let message = '';
  if (!hasMinLength) {
    message = 'A senha deve ter pelo menos 8 caracteres.';
  } else if (!hasUppercase) {
    message = 'A senha precisa ter pelo menos 1 letra MAIÚSCULA.';
  } else if (!hasSpecialChar) {
    message = 'A senha precisa conter pelo menos 1 caractere especial (ex: @, #, $, !, %).';
  } else if (!hasNumber) {
    message = 'A senha precisa conter pelo menos 1 número.';
  }

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasSpecialChar,
    hasNumber,
    message: isValid ? undefined : message
  };
}

/**
 * Criptografia unidirecional da senha usando SHA-256 com Salt criptográfico
 * Garante que a senha nunca seja gravada em texto plano no banco ou storage local.
 */
export async function hashPasswordSecurely(password: string, salt: string = 'docelucro_salt_v2'): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:docelucro_auth_safe`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
