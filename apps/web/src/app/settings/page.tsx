import { SettingsForm } from "@/components/trip/SettingsForm";

export default function SettingsPage() {
  return (
    <main className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Preferences</h1>
        <p className="mt-1 text-sm text-muted-foreground">Long-term preference saving requires explicit confirmation in production.</p>
      </div>
      <SettingsForm />
    </main>
  );
}
