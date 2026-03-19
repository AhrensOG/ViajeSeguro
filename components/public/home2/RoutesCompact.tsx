"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";

interface Route {
  from: string;
  to: string;
  duration: string;
  price: number;
}

const routes: Route[] = [
  { from: "Valencia", to: "Madrid", duration: "3.5h", price: 20 },
  { from: "Valencia", to: "Barcelona", duration: "3.5h", price: 20 },
  { from: "Madrid", to: "Barcelona", duration: "6h", price: 40 },
];

const RoutesCompact = () => {
  const router = useRouter();

  const handleRouteSearch = (origin: string, destination: string) => {
    const today = DateTime.now().plus({ days: 1 }).set({ hour: 12, minute: 0 });
    const params = new URLSearchParams({
      origin,
      destination,
      departure: today.toISO() || "",
      serviceType: "SIMPLE_TRIP",
      mode: "car",
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Rutas más populares
          </h2>
          <p className="text-slate-500">Los mejores precios en los trayectos más demandados</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {routes.map((route, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleRouteSearch(route.from, route.to)}
              className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:border-amber-400 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-800">{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-lg font-semibold text-slate-800">{route.to}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {route.duration}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-amber-600">desde {route.price}€</span>
                  <p className="text-xs text-slate-400">por plaza</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Buscar disponibilidad
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoutesCompact;
