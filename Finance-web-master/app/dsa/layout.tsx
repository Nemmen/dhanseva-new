import DsaLayout from '@/components/dsa/DsaLayout';

export default function DsaRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DsaLayout>{children}</DsaLayout>;
}
