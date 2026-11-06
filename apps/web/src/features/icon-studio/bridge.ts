/**
 * Everything the React detail page shares with the legacy page script (public/app.js) until phase 4:
 * the toast container, localStorage keys, and a few window events. Browser only.
 */
import { MESSAGES, CATEGORY_LABELS } from './messages';

const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export function showToast(msg: string): void {
  const box = document.getElementById('toastContainer');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = CHECK_ICON;
  const span = document.createElement('span');
  span.textContent = msg;
  el.appendChild(span);
  box.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode or quota: the preference just isn't remembered */
  }
}

// --- Language ---------------------------------------------------------------

export type Lang = 'en' | 'vi';
export type MessageKey = keyof (typeof MESSAGES)['en'];

export const readLang = (): Lang => (readStorage('svg_hub_lang') === 'vi' ? 'vi' : 'en');

export function subscribeLang(cb: () => void): () => void {
  window.addEventListener('svgcraft:lang', cb);
  return () => window.removeEventListener('svgcraft:lang', cb);
}

export function translate(lang: Lang, key: MessageKey, vars: Record<string, string | number> = {}): string {
  let str: string = MESSAGES[lang][key] ?? MESSAGES.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) str = str.split(`{${k}}`).join(String(v));
  return str;
}

export const categoryLabel = (lang: Lang, id: string): string =>
  CATEGORY_LABELS[lang]?.[id] ?? CATEGORY_LABELS.en?.[id] ?? id ?? 'General';

// --- Favorites ---------------------------------------------------------------

const FAVORITES_KEY = 'svg_hub_favs';

function readFavorites(): Set<string> {
  try {
    return new Set(JSON.parse(readStorage(FAVORITES_KEY) || '[]') as string[]);
  } catch {
    return new Set();
  }
}

export const isFavorite = (keys: string[]): boolean => {
  const favs = readFavorites();
  return keys.some((k) => favs.has(k));
};

/** Toggle and tell app.js, which keeps its own copy for the grid. Returns the new state. */
export function toggleFavorite(keys: string[]): boolean {
  const favs = readFavorites();
  const wasOn = keys.some((k) => favs.has(k));
  if (wasOn) keys.forEach((k) => favs.delete(k));
  else favs.add(keys[0]!);
  writeStorage(FAVORITES_KEY, JSON.stringify([...favs]));
  window.dispatchEvent(new Event('svgcraft:favorites'));
  return !wasOn;
}

// --- Page decoration owned by the shell ----------------------------------------

export function setBrandGlow(color: string | null): void {
  const orb = document.getElementById('brandGlowOrb');
  const backdrop = document.getElementById('brandGlowBackdrop');
  if (!orb || !backdrop) return;
  if (color === null) {
    backdrop.classList.remove('active');
    return;
  }
  const safe = /^#[0-9a-fA-F]{3,8}$/.test(color) ? color.slice(0, 7) : '#f97316';
  orb.style.background = `radial-gradient(ellipse 62% 95% at 55% 0%, ${safe}40, transparent 72%)`;
  backdrop.classList.add('active');
}
