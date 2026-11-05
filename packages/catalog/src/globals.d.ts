// Web-standard globals available in both Node ≥18 and browsers. Declared here instead of pulling in
// the whole DOM lib, so this package can't accidentally depend on browser (or Node) APIs.
declare class TextEncoder {
  encode(input?: string): Uint8Array;
}
declare class TextDecoder {
  constructor(label?: string);
  decode(input?: Uint8Array): string;
}
declare function atob(data: string): string;
declare function btoa(data: string): string;
