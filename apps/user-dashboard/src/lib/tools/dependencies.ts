import { EmployeeService } from '@/modules/@org/admin/employee/services/service';
import { LeaveService } from '@/modules/@org/admin/leave/services/service';
import { PayrollService } from '@/modules/@org/admin/payroll/services/service';
import { ResourceService } from '@/modules/@org/admin/resources/services/service';
import { TeamService } from '@/modules/@org/admin/teams/services/service';
import { UserLeaveService } from '@/modules/@org/user/leave/services/service';
import { UserPayslipService } from '@/modules/@org/user/payslip/services/service';
import { UserProfileService } from '@/modules/@org/user/profile/services/service';
import { AuthService } from '@/modules/@org/auth/services/auth.service';
import { OnboardingService } from '@/modules/@org/onboarding/services/service';
import { AppService } from '@/services/app/app.service';

import { HttpAdapter } from '../http/http-adapter';

import { type IDependencyContainer } from './types';

const dependencies = {
  HTTP_ADAPTER: Symbol('httpAdapter'),
  AUTH_SERVICE: Symbol('AuthService'),
  APP_SERVICE: Symbol('AppService'),
  ONBOARDING_SERVICE: Symbol('OnboardingService'),
  EMPLOYEE_SERVICE: Symbol('EmployeeService'),
  TEAM_SERVICE: Symbol('TeamService'),
  RESOURCE_SERVICE: Symbol('ResourceService'),
  PAYROLL_SERVICE: Symbol('PayrollService'),
  LEAVE_SERVICE: Symbol('LeaveService'),
  USER_LEAVE_SERVICE: Symbol('UserLeaveService'),
  USER_PAYSLIP_SERVICE: Symbol('UserPayslipService'),
  USER_PROFILE_SERVICE: Symbol('UserProfileService'),
};

const httpAdapter = new HttpAdapter();
const appService = new AppService(httpAdapter);
const authService = new AuthService(httpAdapter);
const onBoardingService = new OnboardingService(httpAdapter);
const employeeService = new EmployeeService(httpAdapter);
const teamService = new TeamService(httpAdapter);
const resourceService = new ResourceService(httpAdapter);
const payrollService = new PayrollService(httpAdapter);
const leaveService = new LeaveService(httpAdapter);
const userLeaveService = new UserLeaveService(httpAdapter);
const userPayslipService = new UserPayslipService(httpAdapter);
const userProfileService = new UserProfileService(httpAdapter);
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
container.add(dependencies.EMPLOYEE_SERVICE, employeeService);
container.add(dependencies.TEAM_SERVICE, teamService);
container.add(dependencies.RESOURCE_SERVICE, resourceService);
container.add(dependencies.PAYROLL_SERVICE, payrollService);
container.add(dependencies.LEAVE_SERVICE, leaveService);
container.add(dependencies.USER_LEAVE_SERVICE, userLeaveService);
container.add(dependencies.USER_PAYSLIP_SERVICE, userPayslipService);
container.add(dependencies.USER_PROFILE_SERVICE, userProfileService);

export { container, dependencies };
