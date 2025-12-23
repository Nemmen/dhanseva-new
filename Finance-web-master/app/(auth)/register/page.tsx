import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register | DhanSeva',
  description: 'Create a new DhanSeva account',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join DhanSeva and access our financial services"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
