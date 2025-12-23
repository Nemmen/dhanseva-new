import EmployeeLayout from '@/components/employee/EmployeeLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EmployeeLayout>{children}</EmployeeLayout>;
}
