import { EmployeeTable } from "../../_components/employee-table";

const departments = ["Product", "Engineering", "Marketing", "Admin"];
const roles = ["Product Designer", "Front-end Developer", "Administrator", "Social Media Manager", "Graphic Designer"];

const employees = [
  {
    id: "1",
    name: "Otka Rhye",
    email: "olfuk@techstudio.com",
    role: "Product Designer",
    department: "Product",
    status: "Active",
  },
  {
    id: "2",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "3",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "4",
    name: "Otka Rhye",
    email: "olfuk@techstudio.com",
    role: "Product Designer",
    department: "Product",
    status: "Active",
  },
  {
    id: "5",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "6",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "7",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "Active",
  },
  {
    id: "8",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "9",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "Active",
  },
  {
    id: "10",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "11",
    name: "Kapodayug",
    email: "kapodayug@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "Active",
  },
];

export const Employees = () => {
  return (
    <div className="space-y-7">
      <EmployeeTable employees={employees} departments={departments} roles={roles} />
    </div>
  );
};
