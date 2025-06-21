/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */

import { container } from "@/lib/tools/dependencies";
import { ComponentProps } from "react";

type DependencyInjector = (Component: React.ElementType, dependencies: { [key: string]: symbol }) => any;

type ResolveDependencies = {
  [key: string]: object;
};

export const WithDependency: DependencyInjector = (Component, dependencies) => {
  const resolvedDependencies: ResolveDependencies = {};

  for (const property of Object.keys(dependencies)) {
    const dependencyKey: symbol = Object.getOwnPropertyDescriptor(dependencies, property)?.value;

    if (dependencyKey) {
      Object.defineProperty(resolvedDependencies, property, {
        value: container.get(dependencyKey),
        enumerable: true,
      });
    } else {
      throw new Error(`Dependency ${property} not found`);
    }
  }

  return (properties: ComponentProps<typeof Component>) => <Component {...properties} {...resolvedDependencies} />;
};
