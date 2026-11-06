/**
 * Everything the React detail page shares with the legacy page script (public/app.js) until phase 4:
 * the toast container, localStorage keys, and a few window events.
 */
import { useCallback, useSyncExternalStore } from 'react';
import { CATEGORY_LABELS, MESSAGES, STYLE_LABELS, TYPE_LABELS } from './messages';

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

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

/** Current language plus its translate function. English on the server, the saved language right after hydration. */
export function useI18n(): { lang: Lang; t: Translate } {
  const lang = useSyncExternalStore<Lang>(subscribeLang, readLang, () => 'en');
  const t = useCallback<Translate>((key, vars) => translate(lang, key, vars), [lang]);
  return { lang, t };
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

export const styleLabel = (lang: Lang, id: string): string => STYLE_LABELS[lang]?.[id] ?? STYLE_LABELS.en?.[id] ?? id;
export const typeLabel = (lang: Lang, id: string): string => TYPE_LABELS[lang]?.[id] ?? TYPE_LABELS.en?.[id] ?? id;

/** Live favorites for many cards: re-renders on changes from anywhere. Same array until the stored value changes. */
let favCacheRaw: string | null | undefined;
let favCacheValue: readonly string[] = [];
const EMPTY_FAVORITES: readonly string[] = [];

export function subscribeFavorites(cb: () => void): () => void {
  window.addEventListener('svgcraft:favorites', cb);
  return () => window.removeEventListener('svgcraft:favorites', cb);
}

export function favoritesSnapshot(): readonly string[] {
  const raw = readStorage(FAVORITES_KEY);
  if (raw !== favCacheRaw) {
    favCacheRaw = raw;
    try {
      favCacheValue = JSON.parse(raw || '[]') as string[];
    } catch {
      favCacheValue = EMPTY_FAVORITES;
    }
  }
  return favCacheValue;
}

export const favoritesServerSnapshot = (): readonly string[] => EMPTY_FAVORITES;
