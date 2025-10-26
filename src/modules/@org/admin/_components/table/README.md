# Advanced Data Table Component

A powerful, feature-rich table component that combines the simplicity of the `DashboardTable` with advanced features from TanStack Table.

## Features

- ✅ **Simple Column Definition**: Uses `IColumnDefinition<T>[]` format (same as DashboardTable)
- ✅ **Mobile Responsive**: Automatic card view on mobile devices
- ✅ **Backend & Client Pagination**: Support for both server-side and client-side pagination
- ✅ **Row Actions**: Dropdown menu with custom actions per row
- ✅ **Drag & Drop**: Reorder rows with drag and drop
- ✅ **Row Selection**: Multi-select rows with checkboxes
- ✅ **Column Visibility**: Show/hide columns dynamically
- ✅ **Sorting**: Client-side sorting
- ✅ **Filtering**: Client-side filtering
- ✅ **Custom Renderers**: Custom cell rendering via column definitions

## Basic Usage

### 1. Define Your Columns

```typescript
import { IColumnDefinition } from "@/modules/@org/admin/types";

const employeeColumns: IColumnDefinition<Employee>[] = [
  {
    header: "Name",
    accessorKey: "firstName",
    render: (_, employee) => (
      <div className="flex items-center gap-2">
        <img src={employee.avatar} alt={employee.firstName} className="h-8 w-8 rounded-full" />
        <span>{`${employee.firstName} ${employee.lastName}`}</span>
      </div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "email",
    render: (_, employee) => <span>{employee?.employmentDetails?.role?.name}</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, employee) => (
      <Badge className={employee.status === "active" ? "bg-success" : "bg-warning"}>
        {employee.status}
      </Badge>
    ),
  },
];
```

### 2. Define Row Actions (Optional)

```typescript
const getRowActions = (employee: Employee): IRowAction<Employee>[] => [
  {
    label: "View Details",
    onClick: (employee) => router.push(`/employees/${employee.id}`),
  },
  {
    label: "Edit",
    onClick: (employee) => router.push(`/employees/edit/${employee.id}`),
  },
];
```

### 3. Use the Table Component

#### Simple Table (Like DashboardTable)

```tsx
import { AdvancedDataTable } from "@/components/shared/table/table";

<AdvancedDataTable
  data={employees}
  columns={employeeColumns}
  rowActions={getRowActions}
  onRowClick={(employee) => console.log(employee)}
  showPagination={true}
  currentPage={1}
  totalPages={10}
  itemsPerPage={10}
  hasNextPage={true}
  hasPreviousPage={false}
  onPageChange={(page) => console.log(page)}
/>
```

#### Advanced Table (With All Features)

```tsx
<AdvancedDataTable
  data={employees}
  columns={employeeColumns}
  
  // Row Actions
  rowActions={getRowActions}
  onRowClick={(employee) => handleRowClick(employee)}
  
  // Backend Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  itemsPerPage={10}
  hasNextPage={hasNextPage}
  hasPreviousPage={hasPreviousPage}
  onPageChange={setCurrentPage}
  showPagination={true}
  
  // Advanced Features
  enableDragAndDrop={true}
  enableRowSelection={true}
  enableColumnVisibility={true}
  enableSorting={true}
  enableFiltering={true}
  
  // UI Customization
  mobileCardView={true}
  showColumnCustomization={true}
  showAddButton={true}
  addButtonText="Add Employee"
  onAddClick={handleAddEmployee}
  
  // Tabs (Optional)
  tabs={[
    { value: "all", label: "All" },
    { value: "active", label: "Active", badge: "10" },
    { value: "inactive", label: "Inactive", badge: "5" },
  ]}
  defaultTab="all"
  onTabChange={handleTabChange}
/>
```

## Props

### IAdvancedTableProperties<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **Required** | Array of data items to display |
| `columns` | `IColumnDefinition<T>[]` | **Required** | Column definitions |
| `currentPage` | `number` | `1` | Current page number (for backend pagination) |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `totalPages` | `number` | `1` | Total number of pages |
| `itemsPerPage` | `number` | `10` | Items per page |
| `hasNextPage` | `boolean` | `false` | Whether there's a next page |
| `hasPreviousPage` | `boolean` | `false` | Whether there's a previous page |
| `rowActions` | `(row: T) => IRowAction<T>[]` | - | Function returning row actions |
| `onRowClick` | `(row: T) => void` | - | Callback when row is clicked |
| `showPagination` | `boolean` | `false` | Show backend pagination controls |
| `enableDragAndDrop` | `boolean` | `false` | Enable drag and drop reordering |
| `enableRowSelection` | `boolean` | `false` | Enable row selection checkboxes |
| `enableColumnVisibility` | `boolean` | `true` | Enable column visibility toggle |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableFiltering` | `boolean` | `true` | Enable column filtering |
| `enablePagination` | `boolean` | `false` | Enable client-side pagination |
| `mobileCardView` | `boolean` | `true` | Show card view on mobile |
| `showColumnCustomization` | `boolean` | `true` | Show column customization button |
| `showAddButton` | `boolean` | `false` | Show add button |
| `addButtonText` | `string` | `"Add Item"` | Text for add button |
| `onAddClick` | `() => void` | - | Callback for add button |
| `tabs` | `Array<{value: string, label: string, badge?: string \| number}>` | - | Tab configuration |
| `defaultTab` | `string` | `"outline"` | Default selected tab |
| `onTabChange` | `(tab: string) => void` | - | Callback when tab changes |

## Column Definition

```typescript
interface IColumnDefinition<T> {
  header: string;
  accessorKey: keyof T;
  render?: (value: T[keyof T], row: T) => ReactNode;
}
```

## Row Action

```typescript
interface IRowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
}
```

## Examples

See `src/modules/@org/admin/employee/_views/employee-table-example.tsx` for complete working examples.

## Migration from DashboardTable

The `AdvancedDataTable` is a drop-in replacement for `DashboardTable`:

```tsx
// Before (DashboardTable)
<DashboardTable
  data={employees}
  columns={employeeColumns}
  rowActions={getRowActions}
  showPagination={true}
  currentPage={1}
  totalPages={10}
/>

// After (AdvancedDataTable)
<AdvancedDataTable
  data={employees}
  columns={employeeColumns}
  rowActions={getRowActions}
  showPagination={true}
  currentPage={1}
  totalPages={10}
  // Plus all the additional features!
  enableDragAndDrop={true}
  enableRowSelection={true}
/>
```

## Notes

- The component automatically converts `IColumnDefinition` to TanStack Table's `ColumnDef` format
- Mobile card view is responsive and shows automatically on small screens
- Backend pagination (`showPagination=true`) and client pagination (`enablePagination=true`) can't be used together
- All advanced features are opt-in and can be disabled for simpler use cases