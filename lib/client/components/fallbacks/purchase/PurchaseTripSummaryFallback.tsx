import TripRouteCompactFallback from "../shared/TripRouteCompactFallback";

const PurchaseTripSummaryFallback = () => (
  <div className="p-6 rounded-md bg-custom-white-100 shadow-md border-2 border-custom-gray-300 space-y-4 animate-pulse">
    <div className="h-6 w-1/3 bg-custom-gray-200 rounded" />
    <div className="h-4 w-1/4 bg-custom-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-custom-gray-200 rounded" />
    <TripRouteCompactFallback />
    <div className="h-4 w-1/3 bg-custom-gray-200 rounded" />
  </div>
);

export default PurchaseTripSummaryFallback;
