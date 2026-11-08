// Определяем, открыт ли сайт локально (через Live Server) или на GitHub Pages
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname === '';

// Если вы задеплоите сервер на Render.com, вставьте его ссылку сюда:
const PRODUCTION_API_URL = 'https://your-server-url.onrender.com'; 

const BASE_URL = isLocalhost ? 'http://localhost:3001' : PRODUCTION_API_URL;

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    if (res.status === 204) return null;

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message = data && data.error ? data.error : `HTTP ${res.status}`;
      throw new Error(message);
    }
    return data;
  } catch (err) {
    // Если мы на GitHub Pages, а сервер локальный — выдаем понятную ошибку
    if (!isLocalhost && err.message === 'Failed to fetch') {
      throw new Error('Сервер не запущен. Для проверки запустите сервер локально (npm start).');
    }
    throw err;
  }
}

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  getCategories: () => request('/categories'),
  createCategory: (payload) => request('/categories', { method: 'POST', body: JSON.stringify(payload) }),
  getTransactions: (filters) => request(`/transactions${buildQuery(filters)}`),
  createTransaction: (payload) => request('/transactions', { method: 'POST', body: JSON.stringify(payload) }),
  updateTransaction: (id, payload) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
};