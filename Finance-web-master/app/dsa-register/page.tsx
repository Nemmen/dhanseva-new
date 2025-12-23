import DsaAuthLayout from '@/components/dsa/DsaAuthLayout';
import DsaRegistrationForm from '@/components/dsa/DsaRegistrationForm';

export default function DsaRegisterPage() {
  return (
    <DsaAuthLayout
      title="Become a DSA Partner"
      subtitle="Join our network and start earning commissions on every successful application"
      showBackButton={true}
      backHref="/"
    >
      <DsaRegistrationForm />
    </DsaAuthLayout>
  );
}
