// Extracts plain text from an uploaded PDF buffer.
// Isolated in its own module so the resume feature can be swapped/tested independently.
// Note: uses pdf-parse@1.x (not v2) because v2 bundles pdfjs-dist's canvas rendering path,
// which crashes at import time in this server's bundled build (no DOM/canvas available).

// Import the inner lib module directly (not the package's index.js), because
// esbuild's bundling makes pdf-parse's index.js think it's the program entry
// point, tripping a debug branch that tries to read a bundled test PDF file.
// @ts-expect-error - no type declarations for the inner lib module (see comment above)
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const result = await pdfParse(buffer);
  return (result.text ?? "").trim();
}
