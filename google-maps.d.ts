declare module '@googlemaps/js-api-loader' {
  export class Loader {
    constructor(options: LoaderOptions);
    load(): Promise<typeof google>;
  }

  interface LoaderOptions {
    apiKey: string;
    version: string;
    libraries?: string[];
    language?: string;
    region?: string;
  }
}
