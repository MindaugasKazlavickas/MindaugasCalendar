import { APIResponse } from "../consts/types";

async function apiRequest<T>(
  url: string,
  method: string,
  payload?: T,
  id?: T
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(payload && {
        body: JSON.stringify(payload),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      data: (payload ?? id ?? null) as T,
      error: (error as Error).message ?? String(error),
    };
  }
}
export default apiRequest;
