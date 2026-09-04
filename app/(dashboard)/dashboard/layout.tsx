import { MemberShell } from '@/app/components/dashboard/MemberShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <MemberShell>{children}</MemberShell>;
}
