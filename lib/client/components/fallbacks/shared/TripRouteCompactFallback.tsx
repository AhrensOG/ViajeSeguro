const TripRouteCompactFallback = ({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) => {
  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <div className="relative pb-6 animate-pulse">
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-6 items-center justify-between min-w-[50px]">
          <div className={`h-4 w-10 bg-custom-gray-200 rounded ${textSize}`} />
          <div className="h-3 w-8 bg-custom-gray-200 rounded" />
          <div className={`h-4 w-10 bg-custom-gray-200 rounded ${textSize}`} />
        </div>

        <div className="flex flex-col items-center justify-between py-1">
          <div className="h-3 w-3 rounded-full bg-custom-gray-200" />
          <div className="w-1 grow bg-custom-gray-200" />
          <div className="h-3 w-3 rounded-full bg-custom-gray-200" />
        </div>

        <div className="flex flex-col w-full items-start justify-between">
          <div className={`flex flex-col gap-1 ${textSize} w-full`}>
            <div className="h-4 w-1/2 bg-custom-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-custom-gray-200 rounded" />
          </div>
          <div className={`flex flex-col gap-1 ${textSize} w-full`}>
            <div className="h-4 w-1/2 bg-custom-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-custom-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripRouteCompactFallback;
