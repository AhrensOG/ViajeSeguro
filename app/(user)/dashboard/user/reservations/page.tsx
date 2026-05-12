import type { Metadata } from "next";
import ReservationsPage from "@/components/user/reservations/ReservationsPage";

export const metadata: Metadata = {
  title: "Mis reservas",
  robots: { index: false, follow: false },
};

const Reservations = () => {
  return <ReservationsPage />;
};

export default Reservations;
