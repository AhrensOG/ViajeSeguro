import Link from "next/link";

const PurchaseHeader = () => (
  <header className="bg-custom-white-100 shadow-sm py-3 px-4 flex justify-between items-center">
    <Link href="/" className="flex items-center">
      <div className="font-bold text-2xl flex items-center">
        <span className="text-custom-black-800">Viaje</span>
        <span className="text-custom-golden-600">Seguro</span>
      </div>
    </Link>
  </header>
);

export default PurchaseHeader;
