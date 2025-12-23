import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | DhanSeva',
  description: 'Login to your DhanSeva account',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your account and manage your services"
    >
      <LoginForm />
    </AuthLayout>
  );
}
