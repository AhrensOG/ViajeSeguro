import PaymentOptionFallback from "./PaymentOptionFallback";
import PaymentTrustInfoFallback from "./PaymentTrustInfoFallback";
import PurchaseTripSummaryFallback from "./PurchaseTripSummaryFallback";

const PurchaseProcessFallback = () => (
  <main className="container mx-auto p-8 grow">
    {/* Fallback del título */}
    <div className="w-full max-w-md h-9 mb-2 bg-custom-gray-200 mx-auto rounded-md" />

    {/* Fallback del párrafo */}
    <div className="w-full max-w-xs h-6 mb-8 bg-custom-gray-100 mx-auto rounded-md" />

    <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-8 w-full">
      <div className="flex-1 space-y-6">
        <PaymentOptionFallback />
        <PaymentOptionFallback />
        <PaymentTrustInfoFallback />
      </div>
      <div className="lg:w-lg mb-6 lg:mb-0">
        <PurchaseTripSummaryFallback />
      </div>
    </div>
  </main>
);

export default PurchaseProcessFallback;
