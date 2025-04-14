import SearchFormFallback from "./SearchFormFallback";
import TripCardFallback from "../shared/TripCardFallback";
import ImageFallback from "./ImageFallback";

const SearchProcessFallback = () => {
  return (
    <div className="flex flex-col gap-2 grow w-full">
      <SearchFormFallback />

      <div className="container mx-auto px-4 py-4 flex gap-2 grow h-[calc(100vh-316px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)]">
        <div className="w-1/3 relative rounded-md hidden lg:block">
          <ImageFallback />
        </div>
        <div className="w-full lg:w-2/3 space-y-4 overflow-y-auto scrollbar-none">
          {[...Array(6)].map((_, i) => (
            <TripCardFallback key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchProcessFallback;
