import { IMQAProvider } from "@/components/imqa-provider";
import { DashboardPage } from "@/components/dashboard-page";

export default function Home() {
  return (
    <IMQAProvider>
      <DashboardPage />
    </IMQAProvider>
  );
}
