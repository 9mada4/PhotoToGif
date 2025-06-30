declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    transparent?: string;
    dither?: boolean | string;
  }

  interface FrameOptions {
    delay?: number;
    copy?: boolean;
  }

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(image: HTMLImageElement | HTMLCanvasElement | CanvasRenderingContext2D, options?: FrameOptions): void;
    on(event: string, callback: (blob: Blob) => void): void;
    render(): void;
  }

  export = GIF;
}
