/**
 * Minimal binary container: `MAGIC | u32 headerLength | header JSON | padding | sections…`.
 * Sections are typed arrays aligned to 4 bytes so they can be viewed in place (zero copy) after one file read.
 */

const MAGIC = 'SVGCIDX1';
const ALIGN = 4;

export type SectionKind = 'u8' | 'u16' | 'u32';

export interface SectionRef {
  kind: SectionKind;
  offset: number;
  /** Element count */
  length: number;
}

type TypedArray = Uint8Array | Uint16Array | Uint32Array;

function kindOf(arr: TypedArray): SectionKind {
  if (arr instanceof Uint32Array) return 'u32';
  if (arr instanceof Uint16Array) return 'u16';
  return 'u8';
}

const BYTES: Record<SectionKind, number> = { u8: 1, u16: 2, u32: 4 };

const pad = (n: number) => (n + ALIGN - 1) & ~(ALIGN - 1);

export function encodeContainer<H extends object>(header: H, sections: Record<string, TypedArray>): Uint8Array {
  const refs: Record<string, SectionRef> = {};
  let cursor = 0;
  for (const [name, arr] of Object.entries(sections)) {
    refs[name] = { kind: kindOf(arr), offset: cursor, length: arr.length };
    cursor = pad(cursor + arr.byteLength);
  }
  const headerBytes = new TextEncoder().encode(JSON.stringify({ ...header, sections: refs }));
  const dataStart = pad(MAGIC.length + 4 + headerBytes.length);
  const out = new Uint8Array(dataStart + cursor);

  out.set(new TextEncoder().encode(MAGIC), 0);
  new DataView(out.buffer).setUint32(MAGIC.length, headerBytes.length, true);
  out.set(headerBytes, MAGIC.length + 4);
  for (const [name, arr] of Object.entries(sections)) {
    const ref = refs[name]!;
    out.set(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength), dataStart + ref.offset);
  }
  return out;
}

export interface DecodedContainer<H> {
  header: H;
  u8(name: string): Uint8Array;
  u16(name: string): Uint16Array;
  u32(name: string): Uint32Array;
}

export function decodeContainer<H>(input: Uint8Array): DecodedContainer<H> {
  // Typed-array views need an aligned base; Node may hand back a pooled, unaligned Buffer
  const bytes = input.byteOffset % ALIGN === 0 ? input : input.slice();
  const magic = new TextDecoder().decode(bytes.subarray(0, MAGIC.length));
  if (magic !== MAGIC) throw new Error('Not a catalog index file (bad magic)');
  const headerLength = new DataView(bytes.buffer, bytes.byteOffset).getUint32(MAGIC.length, true);
  const headerStart = MAGIC.length + 4;
  const parsed = JSON.parse(new TextDecoder().decode(bytes.subarray(headerStart, headerStart + headerLength))) as H & {
    sections: Record<string, SectionRef>;
  };
  const dataStart = bytes.byteOffset + pad(headerStart + headerLength);

  const view = (name: string, kind: SectionKind) => {
    const ref = parsed.sections[name];
    if (!ref) throw new Error(`Catalog index is missing section "${name}"`);
    if (ref.kind !== kind) throw new Error(`Section "${name}" is ${ref.kind}, expected ${kind}`);
    const start = dataStart + ref.offset;
    if (kind === 'u32') return new Uint32Array(bytes.buffer, start, ref.length);
    if (kind === 'u16') return new Uint16Array(bytes.buffer, start, ref.length);
    return new Uint8Array(bytes.buffer, start, ref.length * BYTES.u8);
  };

  return {
    header: parsed,
    u8: (n) => view(n, 'u8') as Uint8Array,
    u16: (n) => view(n, 'u16') as Uint16Array,
    u32: (n) => view(n, 'u32') as Uint32Array,
  };
}
