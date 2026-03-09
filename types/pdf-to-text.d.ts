declare module 'pdf-to-text' {
  function pdfToText(
    buffer: Buffer,
    options: any,
    callback: (error: Error | null, text: string) => void
  ): void;

  function pdfToText(
    buffer: Buffer,
    callback: (error: Error | null, text: string) => void
  ): void;

  export = pdfToText;
}
