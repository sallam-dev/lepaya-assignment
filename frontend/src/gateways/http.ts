export const http = {
  async post<T, K>(url: string, payload: T): Promise<K> {
    const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) })
    return response.json();
  }
}
