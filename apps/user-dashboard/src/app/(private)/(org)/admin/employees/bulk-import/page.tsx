import { BulkImportEmployee } from '@/modules/@org/admin/employee';

export const metadata = {
  title: 'Bulk Import Employees',
  description: 'Import multiple employees at once using an Excel spreadsheet.',
};

const BulkImportPage = () => {
  return <BulkImportEmployee />;
};

export default BulkImportPage;
