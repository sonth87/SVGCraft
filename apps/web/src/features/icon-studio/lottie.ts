/** lottie-web is large and only needed for animated icons: its own chunk, loaded on demand. */
import type { AnimationItem, LottiePlayer } from 'lottie-web';

export type { AnimationItem };

let player: Promise<LottiePlayer> | null = null;

export function loadLottie(): Promise<LottiePlayer> {
  player ??= import('lottie-web').then((m) => m.default);
  return player;
}
