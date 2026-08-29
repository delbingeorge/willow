import { FeatureGrid } from "@/features/home/components/feature-grid";
import { Hero } from "@/features/home/components/hero";
import { ProductPreview } from "@/features/home/components/product-preview";

export default function Home() {
  return (
    <div className="relative flex flex-col gap-32 overflow-hidden bg-background pt-54 pb-32">
      <Hero />
      <ProductPreview />
      <FeatureGrid />
    </div>
  );
}
