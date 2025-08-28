// Utilitários para Next.js 15 - Compatibilidade com params assíncronos

/**
 * Extrai parâmetros de rota de forma segura para Next.js 15
 * @param params - Parâmetros da rota
 * @returns Parâmetros tipados
 */
export async function extractRouteParams<T extends Record<string, string>>(
  params: Promise<T>
): Promise<T> {
  return await params;
}

/**
 * Extrai um parâmetro específico de forma segura
 * @param params - Parâmetros da rota
 * @param key - Chave do parâmetro
 * @returns Valor do parâmetro
 */
export async function extractRouteParam(
  params: Promise<Record<string, string>>,
  key: string
): Promise<string> {
  const resolvedParams = await params;
  return resolvedParams[key];
}

/**
 * Extrai e converte um parâmetro numérico
 * @param params - Parâmetros da rota
 * @param key - Chave do parâmetro
 * @returns Valor numérico ou null se inválido
 */
export async function extractNumericParam(
  params: Promise<Record<string, string>>,
  key: string
): Promise<number | null> {
  const value = await extractRouteParam(params, key);
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}
