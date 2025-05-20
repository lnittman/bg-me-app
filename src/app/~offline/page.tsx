export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-2">You are offline</h1>
      <p className="text-muted-foreground">Please check your internet connection and try again.</p>
    </div>
  );
}
