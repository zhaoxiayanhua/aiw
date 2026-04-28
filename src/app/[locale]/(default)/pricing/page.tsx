import Pricing from "@/components/blocks/pricing";
import PricingComparisonTable from "@/components/pricing/pricing-comparison-table";
import { getPricingPage } from "@/services/page";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPricingPage(locale);

  return (
    <div className="pricing-page-scale">
      {page.pricing && <Pricing pricing={page.pricing} />}
      <PricingComparisonTable />
    </div>
  );
}
