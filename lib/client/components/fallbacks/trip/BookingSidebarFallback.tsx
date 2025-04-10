import TripRouteCompactFallback from "../shared/TripRouteCompactFallback";

const BookingSidebarFallback = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <div className="h-6 w-1/2 bg-custom-gray-200 rounded mb-4" />
        <TripRouteCompactFallback />
        <div className="h-4 w-1/4 bg-custom-gray-200 rounded mb-4" />
        <div className="h-8 w-full bg-custom-gray-200 rounded mb-4" />
        <div className="h-10 w-full bg-custom-gray-200 rounded" />
      </div>
    </div>
  );
};

export default BookingSidebarFallback;
