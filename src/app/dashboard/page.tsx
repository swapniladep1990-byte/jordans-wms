import AppLayout from "@/components/layout/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>

      <h1 className="text-3xl font-bold text-white">
        Jordans WMS Dashboard
      </h1>

      <p className="mt-2 text-slate-400">
        Warehouse overview will appear here.
      </p>

    </AppLayout>
  );
}