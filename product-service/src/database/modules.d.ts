declare namespace NodeJS {
  export interface ProcessEnv {
    PG_HOST: string;
    PG_DATABASE: string;
    PG_PORT: string;
    PG_USER: string;
    PG_PASSWORD: string;
  }
}
