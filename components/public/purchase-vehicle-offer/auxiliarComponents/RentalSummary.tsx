const RentalSummary = () => (
    <section className="flex flex-col h-[28rem] w-[25rem] gap-6 m-8 mt-5 border border-custom-gray-300 rounded-md p-8 shadow-md">
        <h2 className="text-xl font-bold text-custom-black-800">Resumen de tu Alquiler</h2>
        <div className="flex flex-col gap-2">
            <p className="text-base font-medium text-custom-black-700 flex items-center justify-between">
                Modelo: <span>Mercedes Sprinter 2024</span>
            </p>
            <p className="text-base font-medium text-custom-black-700 flex items-center justify-between">
                Dias de Alquiler: <span>3</span>
            </p>
            <p className="text-base font-medium text-custom-black-700 flex items-center justify-between">
                Prcio por Día: <span>$500</span>
            </p>
        </div>
        <div className="h-[1px] bg-custom-gray-300"></div>
        <div className="flex flex-col gap-2">
            <p className="text-base font-medium text-custom-black-700 flex items-center justify-between">
                Importe: <span>255.00€</span>
            </p>
            <p className="text-base font-medium text-custom-black-700 flex items-center justify-between">
                IVA (21%): <span>53.55€</span>
            </p>
            <h3 className="text-2xl font-bold text-custom-black-800 flex items-center justify-between">
                Importe Final: <span>308.55€</span>
            </h3>
        </div>
        <button className="w-full bg-custom-golden-600 text-custom-white-100 font-bold text-lg rounded-md p-4 shadow-sm hover:bg-custom-golden-700 transition-colors duration-300">
            Ir a pagar
        </button>
    </section>
);

export default RentalSummary;
