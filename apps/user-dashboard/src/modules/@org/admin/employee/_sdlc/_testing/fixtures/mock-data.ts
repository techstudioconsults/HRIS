// Re-export from the API mocks layer so tests and MSW share the same fixtures.
export {
  mockEmployees,
  mockEmployeeListItems,
  mockPaginatedEmployees,
  mockDocuments,
  mockAuditEntries,
  mockDepartments,
  mockRoles,
} from '../../4_api/mocks/mock-data';
