'use client';

/** Popover body, in its own chunk: the color library only loads when a well is first opened. */
import { useEffect, useState } from 'react';
import { hexToHsva, hsvaToHexa, type HsvaColor } from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import { normalizeColorValue } from '@svg-hub/svg-tools';
import type { Translate } from '@/features/shared/bridge';
import styles from './ColorPicker.module.css';

interface ColorPopoverProps {
  t: Translate;
  value: string;
  originals: string[];
  recents: string[];
  onChange(value: string): void;
}

export default function ColorPopover({ t, value, originals, recents, onChange }: ColorPopoverProps) {
  // HSVA is the source of truth while open: converting through hex would lose the hue on black, white and gray
  const [hsva, setHsva] = useState<HsvaColor>(() => hexToHsva(value));
  const [hexText, setHexText] = useState(value);

  // Follow changes from outside (quick picks, reset)
  useEffect(() => {
    const current = normalizeColorValue(hsvaToHexa(hsva));
    if (normalizeColorValue(value) !== current) {
      setHsva(hexToHsva(value));
      setHexText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the outside value
  }, [value]);

  const apply = (next: HsvaColor) => {
    setHsva(next);
    const out = normalizeColorValue(hsvaToHexa(next)) ?? value;
    setHexText(out);
    onChange(out);
  };

  const pick = (color: string) => {
    setHsva(hexToHsva(color));
    setHexText(color);
    onChange(color);
  };

  const swatches = (title: string, colors: string[]) =>
    colors.length > 0 && (
      <div className={styles.group}>
        <span className={styles.groupLabel}>{title}</span>
        <div className={styles.swatches}>
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className={styles.swatch}
              title={c.toUpperCase()}
              aria-label={c}
              onClick={() => pick(c)}
            >
              <span style={{ background: c }} />
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <>
      <Colorful color={hsva} onChange={(c) => apply(c.hsva)} style={{ width: '100%' }} />
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>{t('pickerHex')}</span>
          <input
            type="text"
            value={hexText}
            spellCheck={false}
            maxLength={9}
            onChange={(e) => {
              const text = e.target.value.trim();
              setHexText(text);
              const next = normalizeColorValue(text.startsWith('#') ? text : `#${text}`);
              if (next) {
                setHsva(hexToHsva(next));
                onChange(next);
              }
            }}
            onBlur={() => setHexText(value)}
          />
        </label>
        <label className={`${styles.field} ${styles.opacity}`}>
          <span>{t('pickerOpacity')}</span>
          <input
            type="number"
            min={0}
            max={100}
            value={Math.round(hsva.a * 100)}
            onChange={(e) => {
              const pct = Math.max(0, Math.min(100, Number(e.target.value) || 0));
              apply({ ...hsva, a: pct / 100 });
            }}
          />
        </label>
      </div>
      {swatches(t('pickerOriginal'), originals)}
      {swatches(t('pickerRecent'), recents)}
    </>
  );
}
