import { AuthService } from "@/modules/@org/auth/services/auth.service";
import { OnboardingService } from "@/modules/@org/onboarding/services/service";
import { AppService } from "@/services/app/app.service";

import { HttpAdapter } from "../http/http-adapter";

const dependencies = {
  HTTP_ADAPTER: Symbol("httpAdapter"),
  AUTH_SERVICE: Symbol("AuthService"),
  APP_SERVICE: Symbol("AppService"),
  ONBOARDING_SERVICE: Symbol("OnboardingService"),
};

interface IDependencyContainer {
  add<T>(key: symbol, dependency: T): void;
  get<T>(key: symbol): T;
}

const httpAdapter = new HttpAdapter();
const appService = new AppService(httpAdapter);
const authService = new AuthService(httpAdapter);
const onBoardingService = new OnboardingService(httpAdapter);

class DependencyContainer implements IDependencyContainer {
  _dependencies = {};

  add<T>(key: symbol, dependency: T) {
    Object.defineProperty(this._dependencies, key, {
      value: dependency,
    });
  }

  get<T>(key: symbol): T {
    return Object.getOwnPropertyDescriptor(this._dependencies, key)?.value as T;
  }
}

const container = new DependencyContainer();

container.add(dependencies.HTTP_ADAPTER, httpAdapter);
container.add(dependencies.AUTH_SERVICE, authService);
container.add(dependencies.APP_SERVICE, appService);
container.add(dependencies.ONBOARDING_SERVICE, onBoardingService);

export { container, dependencies };
