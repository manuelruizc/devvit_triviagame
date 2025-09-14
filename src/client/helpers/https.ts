export const POST_REQUEST = async (endpoint: string, body: Record<string, any>) => {
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
    };
  }
};

export const GET_REQUEST = async (endpoint: string, member: string) => {
  try {
    const res = await fetch(`${endpoint}/${member}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: any = await res.json();
    return { ...data, error: false };
  } catch (err) {
    return {
      error: true,
    };
  }
};
