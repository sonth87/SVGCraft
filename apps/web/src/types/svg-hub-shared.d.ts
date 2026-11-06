// Minimal types for the legacy CommonJS package (only what the web app uses: R2, SVG parsing, Lordicon).
declare module '@svg-hub/shared' {
  export const OUTPUT_DIR: string;
  export class R2Client {
    publicUrl: string;
    hasCredentials(): boolean;
    getObjectText(objectKey: string): Promise<string | null>;
    getQuotaSummary(): Record<string, unknown>;
  }
  export function parseLordiconCollectionSlug(slug: string): { family: string; style: string } | null;
  export function lottieFilePath(outputDir: string, collectionSlug: string, iconSlug: string): string;
  export function parseSvgMetadata(svg: string): {
    width?: string;
    height?: string;
    viewBox?: string;
    gridSize?: string;
    fileSizeBytes?: number;
    colorPalette?: string[];
  };
}
