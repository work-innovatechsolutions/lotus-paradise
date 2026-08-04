"use client";

import dynamic from "next/dynamic";

const PageLoader = dynamic(() => import("@/components/page-loader"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/scroll-progress"), { ssr: false });
const GsapInitializer = dynamic(() => import("@/components/gsap-initializer"), { ssr: false });
const DiscountPopup = dynamic(() => import("@/components/discount-popup"), { ssr: false });

export default function AnimationProviders() {
  return (
    <>
      <PageLoader />
      <ScrollProgress />
      <GsapInitializer />
      <DiscountPopup />
    </>
  );
}
