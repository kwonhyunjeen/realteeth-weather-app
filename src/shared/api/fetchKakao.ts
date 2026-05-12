import { getUnknownErrorMessage, ResponseError } from '../lib/error';

// Proxy of https://dapi.kakao.com
const KAKAO_API_BASE_URL = new URL('/kakao', globalThis.location.origin).toString();

export const fetchKakao = async <ResponseJSON>(pathname: string, parameters: Partial<Record<string, string>>) => {
  const url = new URL(KAKAO_API_BASE_URL + pathname);

  for (const [key, value] of Object.entries(parameters)) {
    if (value) url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (!response.ok) {
    const body: unknown = await response
      .clone()
      .json()
      .catch(() => null);
    const message = getUnknownErrorMessage(body) ?? response.statusText;
    throw new ResponseError(message, response);
  }

  return (await response.json()) as ResponseJSON;
};
