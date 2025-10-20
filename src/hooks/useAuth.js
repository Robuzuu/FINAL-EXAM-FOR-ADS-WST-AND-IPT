
import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = '/courier/backend/api';


export function useLocalStorage(key, initialValue = null) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
     
      console.warn('[useLocalStorage] read error for key', key, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === undefined || state === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      
      console.warn('[useLocalStorage] write error for key', key, err);
    }
  }, [key, state]);

  return [state, setState];
}


export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useToggle(initial = false) {
  const [val, setVal] = useState(initial);
  const toggle = useCallback((next) => {
    setVal(v => (typeof next === 'boolean' ? next : !v));
  }, []);
  return [val, toggle];
}


export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export function useInterval(callback, delay) {
  const saved = useRef();
  useEffect(() => { saved.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null || delay === undefined) return;
    const id = setInterval(() => saved.current && saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}


export function useOnMount(fn) {
  useEffect(() => {
    if (typeof fn === 'function') fn();
  
  }, );
}


export function useForm(initial = {}) {
  const [values, setValues] = useState(initial);
  const onChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);
  const reset = useCallback((next = initial) => setValues(next), [initial]);
  return { values, setValues, onChange, reset };
}

// 8) useFetch - lightweight fetch wrapper with GET/POST helper and cancellation
export function useFetch() {
  const controllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  const fetchJson = useCallback(async (url, opts = {}, withAuthToken = null) => {
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;
    const headers = opts.headers || {};
    if (!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    if (withAuthToken) headers['Authorization'] = 'Bearer ' + withAuthToken;
    try {
      const res = await fetch(url, { ...opts, headers, signal });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw json;
      return json;
    } catch (err) {
      if (err && err.name === 'AbortError') throw { error: 'Request aborted' };
      // Avoid empty catch block: rethrow the error for caller to handle
      throw err;
    }
  }, []);

  return { fetchJson };
}

// 9) useAuth - main authentication hook (uses useLocalStorage and useFetch)
// Provides: user, token, login(), register(), logout(), authFetch()
export function useAuth() {
  const [user, setUser] = useLocalStorage('courier_user', null);
  const [token, setToken] = useLocalStorage('courier_token', null);
  const { fetchJson } = useFetch();

  // login: calls backend, stores token & user
  const login = useCallback(async (email, password) => {
    const resp = await fetchJson(`${API_BASE}/user_api.php?action=login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    // Expect resp.user.api_token and resp.user
    const newToken = resp.user?.api_token ?? resp.user?.apiToken ?? null;
    setToken(newToken);
    setUser(resp.user);
    return resp;
  }, [fetchJson, setToken, setUser]);

  // register: create new user and auto-login
  const register = useCallback(async (name, email, password) => {
    const resp = await fetchJson(`${API_BASE}/user_api.php?action=register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    // If backend doesn't return user, auto-login
    let final = resp;
    if (!resp.user) {
      try {
        const loginResp = await fetchJson(`${API_BASE}/user_api.php?action=login`, {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        final = loginResp;
      } catch (e) {
        // fall through, return original resp
      }
    }
    const newToken = final.user?.api_token ?? null;
    setToken(newToken);
    setUser(final.user ?? null);
    return final;
  }, [fetchJson, setToken, setUser]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  // authFetch - wrapper that injects token
  const authFetch = useCallback(async (path, opts = {}) => {
    const headers = opts.headers || {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    opts.headers = headers;
    return fetchJson(`${API_BASE}${path}`, opts, null);
  }, [fetchJson, token]);

  // revalidate/me
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (!token) return;
      try {
        // No /auth/me endpoint on backend; keep token-only flow
        // If backend later supports it, wire it here.
      } catch (err) {
       
        console.warn('[useAuth] revalidate failed', err);
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, [token, fetchJson, setToken, setUser]);

  return {
    user,
    token,
    login,
    register,
    logout,
    authFetch
  };
}

export default useAuth;