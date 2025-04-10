const TripCardFallback = () => {
  return (
    <div className="animate-pulse bg-custom-white-100 rounded-lg shadow-md border border-custom-gray-200 overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          {/* Línea de tiempo: salida - duración - llegada */}
          <div className="flex items-center max-w-sm">
            <div className="flex gap-2 items-center">
              <div className="h-4 w-14 bg-custom-gray-200 rounded" />
              <div className="w-3 h-3 rounded-full border-2 border-custom-gray-200 bg-custom-white-100" />
            </div>
            <div className="flex-1 relative">
              <div className="h-1 bg-custom-gray-200 w-full absolute top-1/2 -translate-y-1/2" />
              <div className="text-xs text-center bg-custom-white-100 px-2 relative inline-block left-1/2 -translate-x-1/2">
                <div className="h-4 w-12 bg-custom-gray-200 rounded" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 rounded-full border-2 border-custom-gray-200 bg-custom-gray-200" />
              <div className="h-4 w-14 bg-custom-gray-200 rounded" />
            </div>
          </div>

          {/* Ubicaciones */}
          <div className="max-w-sm flex justify-between text-sm mt-2">
            <div className="h-3 w-32 bg-custom-gray-200 rounded" />
            <div className="h-3 w-32 bg-custom-gray-200 rounded" />
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-end md:w-32">
          <div className="text-right">
            <div className="h-8 w-20 bg-custom-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Footer: nombre de empresa y botón */}
      <div className="border-t border-custom-gray-300 px-4 py-3 flex items-center justify-between">
        <div className="h-4 w-24 bg-custom-gray-200 rounded" />
        <div className="h-8 w-24 bg-custom-gray-200 rounded" />
      </div>
    </div>
  );
};

export default TripCardFallback;
