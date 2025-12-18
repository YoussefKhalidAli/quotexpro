// Lightweight shims to avoid compiler errors when @types are not installed.
// These provide minimal types so the project compiles; for full typing,
// install `@types/express` and `@types/cors` in `server`.

declare module "express" {
  export type Request = any;
  export type Response = any;
  export function Router(): any;
  const express: any;
  export default express;
}

declare module "cors" {
  const cors: any;
  export default cors;
}
