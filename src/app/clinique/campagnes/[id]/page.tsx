import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/clinic/campaign-detail";
import { CAMPAIGNS, getCampaign } from "@/data/campaigns";

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ id: c.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getCampaign(id)) notFound();
  return <CampaignDetail id={id} />;
}
