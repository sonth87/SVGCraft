'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { categoryLabel, styleLabel, typeLabel, useI18n, writeStorage, readStorage } from '../shared/bridge';
import { Icon, categoryIconName, styleIconName, typeIconName } from '../shared/icons';
import { LineIcon } from '../shared/line-icons';
import { useAppRouter } from '../shared/nav';
import { useSummary } from '../shared/summary';
import { DEFAULT_STATE, type CatalogFilters } from '../catalog/filters';
import { useCatalogState } from '../catalog/useCatalogState';

const TONES = ['auto', 'dark', 'light', 'checker'] as const;
type Tone = (typeof TONES)[number];

type TagKey = 'category' | 'iconType' | 'styleType' | 'collection';

function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="30" height="30">
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="7.5"
        fill="var(--bg-card)"
        stroke="var(--border-hover)"
        strokeWidth="1.2"
      />
      <line x1="16" y1="3" x2="16" y2="29" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
      <path
        d="M7.5 20.5L16 25.2L24.5 20.5"
        stroke="#6366f1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 16.2L16 20.9L24.5 16.2"
        stroke="#fb923c"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6.8L24.5 11.6L16 16.4L7.5 11.6L16 6.8Z"
        fill="rgba(249, 115, 22, 0.22)"
        stroke="#f97316"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect x="14.4" y="5.2" width="3.2" height="3.2" rx="0.8" fill="#f97316" />
      <rect x="22.9" y="10" width="3.2" height="3.2" rx="0.8" fill="#f97316" />
      <rect x="5.9" y="10" width="3.2" height="3.2" rx="0.8" fill="#f97316" />
      <circle cx="16" cy="16.4" r="2.1" fill="var(--bg-surface)" stroke="#f97316" strokeWidth="1.6" />
    </svg>
  );
}

export default function Topbar() {
  const { lang, t } = useI18n();
  const { summary, collections, ensureCollections } = useSummary();
  const { state, go, onCatalog } = useCatalogState();
  const router = useAppRouter();
  const { filters } = state;

  // ---- Search box
  const [text, setText] = useState('');
  const [popOpen, setPopOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastQ = useRef('');

  // The box follows the URL (reset, back/forward, chips)
  useEffect(() => {
    lastQ.current = filters.q;
    setText(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const q = text.trim();
    if (q === lastQ.current) return;
    const timer = setTimeout(() => {
      lastQ.current = q;
      go({ ...state, filters: { ...state.filters, q } }, { replace: onCatalog });
    }, 320);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `state` is read when the debounce fires
  }, [text]);

  useEffect(() => {
    if (!popOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPopOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setPopOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [popOpen]);

  // Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const setFilter = (patch: Partial<CatalogFilters>) => go({ ...state, filters: { ...state.filters, ...patch } });

  const tags: { key: TagKey; label: string; icon: string }[] = [];
  if (filters.category) {
    const cat = summary.categories.find((c) => c.id === filters.category);
    tags.push({
      key: 'category',
      label: categoryLabel(lang, filters.category, cat?.label).split(' & ')[0]!,
      icon: categoryIconName(filters.category),
    });
  }
  if (filters.iconType)
    tags.push({ key: 'iconType', label: typeLabel(lang, filters.iconType), icon: typeIconName(filters.iconType) });
  if (filters.styleType)
    tags.push({
      key: 'styleType',
      label: styleLabel(lang, filters.styleType).split(' (')[0]!,
      icon: styleIconName(filters.styleType),
    });
  if (filters.collection) {
    const name = collections?.find((c) => c.slug === filters.collection)?.name ?? filters.collection;
    tags.push({ key: 'collection', label: name.length > 16 ? `${name.slice(0, 15)}…` : name, icon: 'folder' });
  }

  const togglePop = (key: 'iconType' | 'category' | 'styleType', value: string) => {
    setFilter({ [key]: filters[key] === value ? '' : value } as Partial<CatalogFilters>);
    inputRef.current?.focus();
  };

  // ---- Tone / theme / language
  const [tone, setTone] = useState<Tone>('auto');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const savedTone = readStorage('svg_hub_tone');
    if ((TONES as readonly string[]).includes(savedTone ?? '')) setTone(savedTone as Tone);
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const cycleTone = () => {
    const next = TONES[(TONES.indexOf(tone) + 1) % TONES.length]!;
    setTone(next);
    document.body.dataset.previewTone = next;
    writeStorage('svg_hub_tone', next);
    window.dispatchEvent(new Event('svgcraft:tone'));
  };
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    writeStorage('svg_hub_theme', next);
  };
  const toggleLang = () => {
    const next = lang === 'en' ? 'vi' : 'en';
    writeStorage('svg_hub_lang', next);
    document.documentElement.lang = next;
    window.dispatchEvent(new Event('svgcraft:lang'));
  };
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const topCols = (collections ?? []).slice(0, 8);
  const pills = summary.categories.filter((c) => c.id !== 'animation' && c.count > 0);
  const stripParen = (s: string) => s.split(' (')[0]!;

  return (
    <div className="topbar-wrapper">
      <header className="topbar-glass">
        <Link
          href="/"
          prefetch={false}
          className="brand-link"
          id="logoResetBtn"
          aria-label="SVGCraft Trang chủ"
          onClick={() => go(DEFAULT_STATE)}
        >
          <div className="brand-logo-mark" aria-hidden="true">
            <Logo />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">SVGCraft</span>
          </div>
        </Link>

        <div className="search-box" id="searchBoxWrap" ref={wrapRef}>
          <LineIcon name="search" className="search-icon" size={16} />
          <div className="search-inline-chips">
            {tags.map((tag) => (
              <span key={tag.key} className="search-inline-chip">
                <span className="icon-inline" style={{ width: 12, height: 12 }}>
                  <Icon name={tag.icon} />
                </span>
                <span>{tag.label}</span>
                <button
                  type="button"
                  title={t('removeFilterTag')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter({ [tag.key]: '' } as Partial<CatalogFilters>);
                    inputRef.current?.focus();
                  }}
                >
                  <Icon name="close" />
                </button>
              </span>
            ))}
          </div>
          <input
            ref={inputRef}
            type="search"
            id="searchInput"
            value={text}
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            onChange={(e) => setText(e.target.value)}
            onFocus={() => {
              setPopOpen(true);
              void ensureCollections();
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Backspace' || text !== '') return;
              // Backspace on an empty box removes the last filter tag
              for (const key of ['collection', 'styleType', 'iconType', 'category'] as const) {
                if (filters[key]) {
                  setFilter({ [key]: '' });
                  break;
                }
              }
            }}
          />
          <span className="kbd-hint">⌘K</span>

          <div
            id="searchFocusPopover"
            className={`search-focus-popover ${popOpen ? 'open' : ''}`}
            role="dialog"
            aria-label="Quick search filters"
          >
            <div className="search-pop-group">
              <div className="search-pop-title">
                <span>{t('popIconKindTitle')}</span>
                <span style={{ fontWeight: 500, textTransform: 'none' }}>{t('popIconKindHint')}</span>
              </div>
              <div className="search-pop-pills">
                {summary.iconTypes.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    className={`search-pop-pill ${filters.iconType === it.id ? 'active' : ''}`}
                    onClick={() => togglePop('iconType', it.id)}
                  >
                    <span className="icon-inline">
                      <Icon name={typeIconName(it.id)} />
                    </span>
                    <span>{typeLabel(lang, it.id, it.label)}</span>
                    <span className="pill-count">{it.count.toLocaleString('en-US')}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="search-pop-group">
              <div className="search-pop-title">
                <span>{t('popCategoriesTitle')}</span>
              </div>
              <div className="search-pop-pills">
                {pills.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`search-pop-pill ${filters.category === c.id ? 'active' : ''}`}
                    onClick={() => togglePop('category', c.id)}
                  >
                    <span className="icon-inline">
                      <Icon name={categoryIconName(c.id)} />
                    </span>
                    <span>{categoryLabel(lang, c.id, c.label)}</span>
                    <span className="pill-count">{c.count.toLocaleString('en-US')}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="search-pop-group">
              <div className="search-pop-title">
                <span>{t('popStylesTitle')}</span>
              </div>
              <div className="search-pop-pills">
                {summary.styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`search-pop-pill ${filters.styleType === s.id ? 'active' : ''}`}
                    onClick={() => togglePop('styleType', s.id)}
                  >
                    <span className="icon-inline">
                      <Icon name={styleIconName(s.id)} />
                    </span>
                    <span>{stripParen(styleLabel(lang, s.id, s.label))}</span>
                    <span className="pill-count">{s.count.toLocaleString('en-US')}</span>
                  </button>
                ))}
              </div>
            </div>
            {topCols.length > 0 && (
              <div className="search-pop-group">
                <div className="search-pop-title">
                  <span>{t('popTopColsTitle')}</span>
                </div>
                <div className="search-pop-pills">
                  {topCols.map((col) => (
                    <button
                      key={col.slug}
                      type="button"
                      className="search-pop-pill"
                      onClick={() => {
                        setPopOpen(false);
                        router.push(`/collection/${encodeURIComponent(col.slug)}`);
                      }}
                    >
                      <span className="icon-inline">
                        <Icon name="folder" />
                      </span>
                      <span>{col.name}</span>
                      <span className="pill-count">{col.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="topbar-actions">
          <button type="button" className="pill-btn" title={t('toneTitle')} onClick={cycleTone}>
            <LineIcon name="tone" size={15} />
            <span>
              {t('tonePrefix')} <strong>{tone.charAt(0).toUpperCase() + tone.slice(1)}</strong>
            </span>
          </button>
          <button type="button" className="pill-btn" title={t('themeTitle')} onClick={toggleTheme}>
            <span className="icon-inline">
              <LineIcon name={theme === 'dark' ? 'moon' : 'sun'} size={14} />
            </span>
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
          <button
            type="button"
            className="pill-btn"
            title={t('langTitle')}
            aria-label={t('langTitle')}
            onClick={toggleLang}
          >
            <LineIcon name="globe" size={14} />
            <strong>{lang.toUpperCase()}</strong>
          </button>
        </div>
      </header>
    </div>
  );
}
