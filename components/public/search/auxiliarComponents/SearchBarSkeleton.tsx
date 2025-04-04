const SearchBarSkeleton = () => {
  return (
    <div className="bg-white shadow-md py-4 sticky top-0 z-10 animate-pulse">
      <div className="container mx-auto px-4 flex gap-4 flex-wrap">
        <div className="h-12 bg-gray-200 rounded w-full md:w-1/3" />
        <div className="h-12 bg-gray-200 rounded w-full md:w-1/3" />
        <div className="h-12 bg-gray-200 rounded w-full md:w-1/3" />
      </div>
    </div>
  );
};

export default SearchBarSkeleton;
