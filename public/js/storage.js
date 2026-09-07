/* =========================================================
   UMKM Digital — Storage & API Helpers
   ========================================================= */

const API_BASE = '';

const Storage = {
  set: (key, value) => localStorage.setItem(`umkm_${key}`, JSON.stringify(value)),
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(`umkm_${key}`)); }
    catch { return null; }
  },
  remove: (key) => localStorage.removeItem(`umkm_${key}`),
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('umkm_'))
      .forEach(k => localStorage.removeItem(k));
  }
};

const Auth = {
  getToken: () => Storage.get('token'),
  getUser: () => Storage.get('user'),
  isLoggedIn: () => !!Storage.get('token'),
  save: (token, user) => { Storage.set('token', token); Storage.set('user', user); },
  logout: () => { Storage.remove('token'); Storage.remove('user'); }
};

async function apiRequest(method, url, data = null, isFormData = false) {
  const headers = {};
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && data) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (data) {
    options.body = isFormData ? data : JSON.stringify(data);
  }

  const res = await fetch(API_BASE + url, options);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || 'Request gagal');
  return json;
}

const api = {
  get: (url) => apiRequest('GET', url),
  post: (url, data) => apiRequest('POST', url, data),
  put: (url, data) => apiRequest('PUT', url, data),
  delete: (url) => apiRequest('DELETE', url),
  postForm: (url, formData) => apiRequest('POST', url, formData, true),
};
