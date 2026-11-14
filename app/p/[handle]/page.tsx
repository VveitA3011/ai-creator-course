import type { Metadata } from "next";
import { PublicPortfolio } from "@/components/account/public-portfolio";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  return { title: `Portfolio ${handle}` };
}

export default async function Page({ params }: Props) {
  const { handle } = await params;
  return <PublicPortfolio handle={decodeURIComponent(handle).toLowerCase()} />;
}
