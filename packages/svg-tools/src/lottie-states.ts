/** Motion states of a Lordicon animation, read from its Lottie markers. Pure data, no DOM. */

export interface MotionState {
  id: string;
  label: string;
  rawName: string;
  isDefault: boolean;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
}

interface LottieMarkers {
  markers?: { cm?: unknown; tm?: unknown; dr?: unknown }[];
  ip?: unknown;
  op?: unknown;
}

/** `default:hover-pinch` → state `hover-pinch` flagged as default. No markers → one state over the whole timeline. */
export function extractLordiconMotionStates(lottie: unknown): MotionState[] {
  const data = (lottie ?? {}) as LottieMarkers;
  const markers = Array.isArray(data.markers) ? data.markers : [];
  if (markers.length === 0) {
    const startFrame = Number(data.ip) || 0;
    const endFrame = Number(data.op) || 60;
    return [
      {
        id: 'default',
        label: 'Default Motion',
        rawName: 'default',
        isDefault: true,
        startFrame,
        endFrame,
        durationFrames: Math.max(1, endFrame - startFrame),
      },
    ];
  }
  return markers.map((m, idx) => {
    const rawName = String(m.cm || `state-${idx + 1}`).trim();
    const cleaned = rawName.replace(/^default:/i, '').replace(/:[\d.]+$/, '');
    const startFrame = Math.max(0, Math.round(Number(m.tm) || 0));
    const durationFrames = Math.max(1, Math.round(Number(m.dr) || 30));
    return {
      id: cleaned || `state-${idx + 1}`,
      label: cleaned
        .split(/[-_]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      rawName,
      isDefault: rawName.startsWith('default:'),
      startFrame,
      endFrame: startFrame + durationFrames,
      durationFrames,
    };
  });
}

/** State to preselect: the marked default, else the first hover state, else the first. */
export function defaultMotionState(states: MotionState[]): MotionState | undefined {
  return states.find((s) => s.isDefault) ?? states.find((s) => s.id.includes('hover')) ?? states[0];
}
