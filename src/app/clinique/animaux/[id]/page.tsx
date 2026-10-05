import { notFound } from "next/navigation";
import { AnimalDetail } from "@/components/clinic/animal-detail";
import { repository } from "@/data/repository";

export function generateStaticParams() {
  return repository.listAnimals().map((a) => ({ id: a.id }));
}

export default async function AnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!repository.getAnimal(id)) notFound();
  return <AnimalDetail id={id} />;
}
