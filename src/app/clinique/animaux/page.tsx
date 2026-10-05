import { Suspense } from "react";
import { AnimalList } from "@/components/clinic/animal-list";

export const metadata = { title: "Animaux — Vita" };

export default function AnimalsPage() {
  return (
    <Suspense fallback={null}>
      <AnimalList />
    </Suspense>
  );
}
