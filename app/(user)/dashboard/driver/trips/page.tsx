import type { Metadata } from "next";
import TripsPanel from "@/components/driver/trips/TripsPanel";

export const metadata: Metadata = {
  title: "Mis viajes",
  robots: { index: false, follow: false },
};

const TripsPage = () => {
    return <TripsPanel />;
};

export default TripsPage;
