export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  teamId: string;
  roleId: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  id: string;
}

export interface EmployeeQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  teamId?: string;
  roleId?: string;
}
