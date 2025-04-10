import TripRouteCompactFallback from "../shared/TripRouteCompactFallback";

const TripDetailFallback = () => {
  return (
    <div className="lg:col-span-2 space-y-4 animate-pulse">
      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <TripRouteCompactFallback />
      </div>

      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-custom-gray-200" />
          <div className="h-6 w-1/3 bg-custom-gray-200 rounded" />
        </div>
        <div className="mt-4 h-4 w-1/4 bg-custom-gray-200 rounded" />
        <div className="mt-4 h-4 w-3/4 bg-custom-gray-200 rounded" />
        <div className="mt-6 h-4 w-full bg-custom-gray-200 rounded" />
        <div className="mt-6 w-full h-10 bg-custom-gray-200 rounded" />
      </div>
    </div>
  );
};

export default TripDetailFallback;
