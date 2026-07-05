import { Button } from "@forge/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Forge</h1>
      <p className="text-muted-foreground">No Brand yet</p>
      <Button>Create Brand</Button>
    </main>
  );
}
