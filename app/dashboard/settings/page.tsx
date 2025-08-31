export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect integrations and manage your account.</p>
      </div>

      <section className="border rounded-md p-4">
        <h2 className="text-base font-medium">Square Account</h2>
        <p className="text-sm text-muted-foreground mt-1">Connect your Square account to sync orders, catalog, and locations.</p>
        <div className="mt-3">
          <a
            href="#"
            aria-disabled
            className="inline-flex items-center rounded-md bg-black text-white px-3 py-2 text-sm opacity-70 cursor-not-allowed"
            title="Square OAuth coming soon"
          >
            Connect Square (coming soon)
          </a>
        </div>
      </section>
    </div>
  );
}
