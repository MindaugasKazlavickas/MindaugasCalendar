import { APIResponse } from "../consts/types";

async function apiRequest<T>(
  url: string,
  method: string,
  payload?: T,
  id?: T
): Promise<APIResponse<T>> {
  try {
    let response;
    if (payload) {
      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    if (payload) {
      return {
        status: 500,
        data: payload,

        error: (error as Error).message,
      };
    } else if (id) {
      return {
        status: 500,
        data: id,
        error: (error as Error).message,
      };
    } else {
      return {
        status: 500,
        data: null as unknown as T,
        error: (error as Error).message,
      };
    }
  }
}
export default apiRequest;
