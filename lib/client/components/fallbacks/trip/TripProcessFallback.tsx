import BookingSidebarFallback from "./BookingSidebarFallback";
import TripDetailFallback from "./TripDetailFallback";

const TripProcessFallback = () => {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4 animate-pulse">
      <div className="h-10 w-1/3 bg-custom-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TripDetailFallback />
        <BookingSidebarFallback />
      </div>
    </main>
  );
};

export default TripProcessFallback;
