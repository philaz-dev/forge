"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@forge/ui";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const canScan = query.trim().length > 0;

  function handleScan() {
    if (!canScan) return;
    router.push(`/opportunity/result?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="max-w-xl text-center text-2xl font-semibold tracking-tight">
        What business opportunity do you want to explore?
      </h1>
      <form
        className="flex w-full max-w-md flex-col items-center gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleScan();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Business opportunity"
          className="h-11 w-full rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="lg" disabled={!canScan}>
          Scan
        </Button>
      </form>
    </main>
  );
}
