// TypeScript declarations to allow importing CSS files (global and modules)
declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
