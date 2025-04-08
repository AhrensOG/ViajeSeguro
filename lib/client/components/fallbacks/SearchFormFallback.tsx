const SearchFormFallback = () => {
  return (
    <div className="w-full h-auto bg-custom-white-100 shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col lg:flex-row gap-2 w-full">
            {/* Primer grupo: Origen y Destino */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="h-12 w-full bg-custom-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-custom-gray-200 rounded animate-pulse" />
            </div>

            {/* Segundo grupo: Fecha y Servicio */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="h-12 w-full bg-custom-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-custom-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Botón Buscar */}
          <div className="flex justify-center">
            <div className="h-12 w-full md:h-full md:w-32 bg-custom-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFormFallback;
