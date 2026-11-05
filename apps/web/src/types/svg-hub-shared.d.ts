// Minimal types for the legacy CommonJS package (only what the web app still uses: R2 + SVG parsing).
declare module '@svg-hub/shared' {
  export const OUTPUT_DIR: string;
  export class R2Client {
    publicUrl: string;
    hasCredentials(): boolean;
    getSvgObject(objectKey: string): Promise<string | null>;
    getQuotaSummary(): Record<string, unknown>;
  }
  export function parseSvgMetadata(svg: string): {
    width?: string;
    height?: string;
    viewBox?: string;
    gridSize?: string;
    fileSizeBytes?: number;
    colorPalette?: string[];
  };
}
