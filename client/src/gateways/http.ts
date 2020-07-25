export const http = {
  async post<T, K>(url: string, payload: T): Promise<K> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.json();
  },
};
