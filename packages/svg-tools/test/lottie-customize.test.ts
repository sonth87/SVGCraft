import { describe, expect, it } from 'vitest';
import { applyCustomizationsToLottieJson } from '../src';

// Minimal Lordicon-shaped animation: shapes read their color from a `control` layer via expressions.
const CB5EEE = [0.796078443527, 0.368627458811, 0.933333337307, 1];
const fixture = () => ({
  w: 430,
  h: 430,
  layers: [
    {
      nm: 'control',
      ty: 3,
      ef: [
        { ty: 5, nm: 'stroke', ef: [{ ty: 7, nm: 'Menu', v: { a: 0, k: 2 } }] },
        { ty: 5, nm: 'secondary', ef: [{ ty: 2, nm: 'Color', v: { a: 0, k: [...CB5EEE] } }] },
      ],
    },
    {
      nm: 'shape',
      ty: 4,
      ks: {},
      shapes: [
        { ty: 'fl', c: { a: 0, k: [...CB5EEE], x: "comp('x').layer('control').effect('secondary')('Color')" } },
        {
          ty: 'st',
          c: { a: 1, k: [{ s: [...CB5EEE], e: [0, 0, 0, 1] }] },
          w: { a: 1, k: [{ s: [2] }, { s: [4] }] },
        },
        { ty: 'st', c: { a: 0, k: [0, 0, 0, 1] }, w: { a: 0, k: 3 } },
      ],
    },
    // Image layer: ty 2 but with `ks` — must never be treated as a color effect
    { ty: 2, ks: {}, v: { k: [...CB5EEE] } },
  ],
});

describe('applyCustomizationsToLottieJson', () => {
  it('recolors shape colors AND the Color Control effect that expressions read', () => {
    const out = applyCustomizationsToLottieJson(fixture(), { colorMap: { '#cb5eee': '#ff8000' } });
    const orange = [1, 0.502, 0];
    expect(out.layers[0]!.ef![1]!.ef[0]!.v.k).toEqual([...orange, 1]);
    const shapes = out.layers[1]!.shapes!;
    expect(shapes[0]!.c.k).toEqual([...orange, 1]);
    expect((shapes[1]!.c.k as { s: number[]; e: number[] }[])[0]).toEqual({ s: [...orange, 1], e: [0, 0, 0, 1] });
  });

  it('leaves image layers and unmapped colors alone', () => {
    const out = applyCustomizationsToLottieJson(fixture(), { colorMap: { '#cb5eee': '#ff8000' } });
    expect(out.layers[2]!.v!.k).toEqual(CB5EEE);
    expect(out.layers[1]!.shapes![2]!.c.k).toEqual([0, 0, 0, 1]);
  });

  it('scales static and keyframed stroke widths', () => {
    const out = applyCustomizationsToLottieJson(fixture(), { strokeMode: 'bold' });
    const shapes = out.layers[1]!.shapes!;
    expect(shapes[1]!.w!.k).toEqual([{ s: [2.9] }, { s: [5.8] }]);
    expect(shapes[2]!.w!.k).toBe(4.35);
  });

  it('never mutates the input', () => {
    const input = fixture();
    const snapshot = JSON.stringify(input);
    applyCustomizationsToLottieJson(input, { colorMap: { '#cb5eee': '#000000' }, strokeMode: 'light' });
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
