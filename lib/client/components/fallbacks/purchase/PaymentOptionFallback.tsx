const PaymentOptionFallback = () => (
  <div className="p-6 rounded-md bg-custom-white-100 shadow-md border-2 border-custom-gray-300 animate-pulse flex gap-4">
    <div className="h-9 w-9 bg-custom-gray-200 rounded-full"/>
    <div className="grow space-y-4">
      <div className="h-5 w-32 bg-custom-gray-200 rounded" />
      <div className="h-4 w-64 bg-custom-gray-200 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-custom-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-custom-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-custom-gray-200 rounded" />
      </div>
      <div className="flex w-full justify-between items-end">
        <div className="h-4 w-40 bg-custom-gray-300 rounded" />
        <div className="h-10 w-40 bg-custom-gray-300 rounded" />
      </div>
    </div>
  </div>
);

export default PaymentOptionFallback;
