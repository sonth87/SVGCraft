'use client';

/** Color well that opens a popover (color area, opacity, HEX, original and recent colors). */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { readStorage, writeStorage } from './bridge';
import type { Translate } from './IconStudio';
import styles from './ColorPicker.module.css';

const ColorPopover = dynamic(() => import('./ColorPopover'), { ssr: false });

const RECENT_KEY = 'svgcraft:recent-colors';
const RECENT_MAX = 12;

export function readRecentColors(): string[] {
  try {
    const list = JSON.parse(readStorage(RECENT_KEY) || '[]') as unknown;
    return Array.isArray(list) ? list.filter((c): c is string => typeof c === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function rememberRecentColor(color: string) {
  writeStorage(
    RECENT_KEY,
    JSON.stringify([color, ...readRecentColors().filter((c) => c !== color)].slice(0, RECENT_MAX))
  );
}

interface ColorPickerProps {
  t: Translate;
  value: string;
  label: string;
  /** The icon's own colors, offered as quick picks */
  originals: string[];
  dimmed?: boolean;
  compact?: boolean;
  onChange(value: string): void;
}

const POPOVER_W = 248;
const POPOVER_H = 420;

export default function ColorPicker({ t, value, label, originals, dimmed, compact, onChange }: ColorPickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const openedWith = useRef(value);

  const close = () => {
    if (openedWith.current !== value) rememberRecentColor(value);
    setPos(null);
  };

  const toggle = () => {
    if (pos) {
      close();
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    openedWith.current = value;
    // Beside the well when there is room, so the stage above stays visible while picking
    if (window.innerWidth - rect.right > POPOVER_W + 16) {
      setPos({
        left: rect.right + 8,
        top: Math.max(8, Math.min(window.innerHeight - POPOVER_H - 8, rect.top - 120)),
      });
      return;
    }
    const roomBelow = window.innerHeight - rect.bottom > POPOVER_H;
    setPos({
      left: Math.max(8, Math.min(window.innerWidth - POPOVER_W - 8, rect.left)),
      top: roomBelow ? rect.bottom + 6 : Math.max(8, rect.top - POPOVER_H - 6),
    });
  };

  useEffect(() => {
    if (!pos) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!popRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Esc on the page means "leave the detail view"; here it only closes the popover
        e.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `close` reads the latest value through this re-run
  }, [pos, value]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`color-well-item ${styles.well}`}
        style={{
          maxWidth: compact ? 96 : undefined,
          minWidth: compact ? 96 : undefined,
          opacity: dimmed ? 0.45 : undefined,
        }}
        title={`${label}: ${value.toUpperCase()}`}
        aria-label={`${t('pickerEdit')}: ${label}`}
        aria-expanded={Boolean(pos)}
        onClick={toggle}
      >
        <span className={styles.wellFill} style={{ background: value }} />
        <span className="color-well-tag">{value}</span>
      </button>
      {pos &&
        createPortal(
          <div ref={popRef} className={styles.popover} style={pos} role="dialog" aria-label={label}>
            <ColorPopover t={t} value={value} originals={originals} recents={readRecentColors()} onChange={onChange} />
          </div>,
          document.body
        )}
    </>
  );
}
