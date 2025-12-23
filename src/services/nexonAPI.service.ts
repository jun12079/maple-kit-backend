/**
 * Nexon MapleStory API Service
 * 後端版本 - 安全地處理 API Key 並呼叫 Nexon Open API
 */

const BASE_URL = 'https://open.api.nexon.com';
const API_VERSION = 'maplestorytw/v1';

/**
 * 取得 API Key
 */
function getAPIKey(): string {
  const apiKey = process.env.MAPLE_API_KEY;
  if (!apiKey) {
    throw new Error('MAPLE_API_KEY is not configured in environment variables');
  }
  return apiKey;
}

/**
 * 通用 Nexon API 請求函數
 */
export async function makeNexonAPIRequest<T = any>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  const apiKey = getAPIKey();
  const url = new URL(`${BASE_URL}/${API_VERSION}${endpoint}`);

  // 添加查詢參數
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-nxopen-api-key': apiKey,
  };

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw {
        status: response.status,
        message: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        code: errorData.error?.name,
      };
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 500,
      message: `Network error: ${error.message}`,
    };
  }
}

/**
 * 驗證必填參數
 */
export function validateRequiredParams(params: Record<string, any>): string | null {
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      return `${key} is required`;
    }
  }
  return null;
}
