/** Sorted posting-list helpers (ascending icon ordinals). */

/** Split text into lowercase search tokens (letters/digits, any script). */
export function tokenize(text: string): string[] {
  return String(text || '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** Intersect sorted lists. Smallest list drives; others are probed with galloping search. */
export function intersectSorted(lists: Uint32Array[]): Uint32Array {
  if (lists.length === 0) return new Uint32Array(0);
  if (lists.length === 1) return lists[0]!;
  const sorted = [...lists].sort((a, b) => a.length - b.length);
  const [first, ...rest] = sorted as [Uint32Array, ...Uint32Array[]];
  const out = new Uint32Array(first.length);
  const cursors = new Array<number>(rest.length).fill(0);
  let n = 0;
  outer: for (let i = 0; i < first.length; i++) {
    const v = first[i]!;
    for (let r = 0; r < rest.length; r++) {
      const list = rest[r]!;
      const pos = gallop(list, v, cursors[r]!);
      cursors[r] = pos;
      if (pos >= list.length) break outer;
      if (list[pos] !== v) continue outer;
    }
    out[n++] = v;
  }
  return out.subarray(0, n);
}

/** First index >= `from` whose value is >= `target`. */
export function gallop(list: Uint32Array, target: number, from = 0): number {
  let lo = from;
  let step = 1;
  let hi = from;
  while (hi < list.length && list[hi]! < target) {
    lo = hi + 1;
    hi += step;
    step *= 2;
  }
  hi = Math.min(hi, list.length);
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (list[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Union of many lists via a bitmap over the ordinal space (fast when lists are large or numerous). */
export function unionSorted(lists: Uint32Array[], universe: number): Uint32Array {
  if (lists.length === 0) return new Uint32Array(0);
  if (lists.length === 1) return lists[0]!;
  const mark = new Uint8Array(universe);
  let count = 0;
  for (const list of lists) {
    for (let i = 0; i < list.length; i++) {
      const v = list[i]!;
      if (mark[v] === 0) {
        mark[v] = 1;
        count++;
      }
    }
  }
  const out = new Uint32Array(count);
  let n = 0;
  for (let v = 0; v < universe && n < count; v++) if (mark[v] === 1) out[n++] = v;
  return out;
}

export function rangeList(n: number): Uint32Array {
  const out = new Uint32Array(n);
  for (let i = 0; i < n; i++) out[i] = i;
  return out;
}
