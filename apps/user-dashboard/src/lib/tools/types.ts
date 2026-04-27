export type UnknownRecord = Record<string, unknown>;

export interface IDependencyContainer {
  add<T>(key: symbol, dependency: T): void;
  get<T>(key: symbol): T;
}
