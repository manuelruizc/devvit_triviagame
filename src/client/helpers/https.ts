export type APIResponse<T> = T & {
  error: boolean;
};

export const POST_REQUEST = async <T>(
  endpoint: string,
  body: Record<string, any>
): Promise<APIResponse<T>> => {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: any = await res.json();
    return { ...data, error: false };
  } catch (err) {
    return {
      error: true,
    } as APIResponse<T>;
  }
};

export const GET_REQUEST = async <T>(
  endpoint: string,
  member?: string
): Promise<APIResponse<T>> => {
  try {
    let finalEndPoint = endpoint;
    if (member && member.length > 0) {
      finalEndPoint += '/' + member;
    }
    const res = await fetch(finalEndPoint);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data: any = await res.json();
    return { ...data, error: false };
  } catch (err) {
    return {
      error: true,
    } as APIResponse<T>;
  }
};
