// Any content inside this file will be shared accross dashboard. Layout.tsx is a special file that provides shared layout to all component of dashboard
// This component does not re-render on navigation of routs. So, switching between customers and invoices in dashboard won't reload this.

import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
