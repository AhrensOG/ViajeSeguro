"use client";

import React, { useState } from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  Clock,
  Users,
  Car,
  Shield,
  MessageSquare,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CTASection from "./auxiliarComponents/CTASection";

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
};

type FAQCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
};

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    "reservations"
  );
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    {}
  );

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`;
    setOpenQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const faqCategories: FAQCategory[] = [
    {
      id: "reservations",
      title: "Reservas y viajes",
      icon: <Calendar className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Cómo puedo reservar un viaje?",
          answer: (
            <div>
              <p>Reservar un viaje en Viaje Seguro es muy sencillo:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Ingresa a tu cuenta o regístrate si aún no lo has hecho</li>
                <li>
                  En la página principal, introduce tu origen, destino y fecha
                  de viaje
                </li>
                <li>
                  Selecciona el viaje que mejor se adapte a tus necesidades
                </li>
                <li>Revisa los detalles y confirma tu reserva</li>
                <li>Realiza el pago según el método que prefieras</li>
              </ol>
              <p className="mt-2">
                Una vez completada la reserva, recibirás una confirmación por
                correo electrónico con todos los detalles.
              </p>
            </div>
          ),
        },
        {
          question: "¿Puedo reservar varias plazas a la vez?",
          answer:
            "Sí, puedes reservar hasta 4 plazas en un mismo viaje. Durante el proceso de reserva, simplemente selecciona el número de plazas que necesitas. Ten en cuenta que todas las plazas deben ser para el mismo trayecto y fecha.",
        },
        {
          question: "¿Qué información necesito para hacer una reserva?",
          answer:
            "Para realizar una reserva necesitas tener una cuenta en Viaje Seguro (puedes registrarte con tu correo electrónico), indicar el origen y destino de tu viaje, la fecha en la que quieres viajar y el número de plazas que necesitas. También necesitarás un método de pago válido si eliges pagar online.",
        },
        {
          question: "¿Cómo sé si mi reserva ha sido confirmada?",
          answer:
            "Una vez completada tu reserva, recibirás un correo electrónico de confirmación con todos los detalles. También puedes verificar el estado de tus reservas en la sección 'Mis viajes' de tu cuenta. Si has elegido la opción de pago en efectivo, tu reserva quedará pendiente hasta que el conductor la acepte.",
        },
      ],
    },
    {
      id: "payments",
      title: "Pagos y precios",
      icon: <CreditCard className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, y en algunos trayectos, también ofrecemos la opción de pago en efectivo directamente al conductor el día del viaje.",
        },
        {
          question: "¿Cómo se calculan los precios de los viajes?",
          answer:
            "Los precios base son establecidos por los conductores teniendo en cuenta la distancia del trayecto, el consumo de combustible y los peajes. Viaje Seguro añade una pequeña comisión por el servicio. Si tienes alguno de nuestros planes de suscripción, se aplicarán automáticamente los descuentos correspondientes.",
        },
        {
          question: "¿Qué incluye el precio que pago?",
          answer:
            "El precio incluye tu plaza en el vehículo para el trayecto seleccionado y el seguro básico de viaje. No incluye gastos adicionales como equipaje extra (si el conductor lo cobra aparte) o desvíos de la ruta original.",
        },
        {
          question:
            "¿Cómo funcionan los descuentos de los planes de suscripción?",
          answer: (
            <div>
              <p>
                Los descuentos se aplican automáticamente según el plan que
                tengas:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-medium">
                    Cliente Preferencial (gratis):
                  </span>{" "}
                  Descuento de 2,75€ por viaje
                </li>
                <li>
                  <span className="font-medium">Club Lealtad (4,90€/mes):</span>{" "}
                  Descuento de 5,50€ por viaje
                </li>
                <li>
                  <span className="font-medium">
                    Club Fidelidad (49,90€/año):
                  </span>{" "}
                  Descuento base de 5,50€ por viaje, con descuentos adicionales
                  por recomendaciones (hasta 12,10€ por viaje)
                </li>
              </ul>
              <p className="mt-2">
                Puedes ver más detalles sobre nuestros planes en la sección{" "}
                <Link
                  href="/promotions"
                  className="text-custom-golden-600 hover:underline">
                  Promociones
                </Link>
                .
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: "cancellations",
      title: "Cancelaciones y cambios",
      icon: <Clock className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Cómo puedo cancelar mi reserva?",
          answer: (
            <div>
              <p>Para cancelar una reserva:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Accede a tu cuenta</li>
                <li>
                  Ve a la sección <strong>Mis viajes</strong>
                </li>
                <li>Selecciona el viaje que deseas cancelar</li>
                <li>
                  Haz clic en <strong>Cancelar reserva</strong>
                </li>
                <li>Confirma la cancelación</li>
              </ol>
              <p className="mt-2">
                Las condiciones de reembolso dependerán del plan que tengas y
                del tiempo de antelación con el que canceles.
              </p>
            </div>
          ),
        },
        {
          question: "¿Cuál es la política de reembolso?",
          answer: (
            <div>
              <p>La política de reembolso varía según tu plan:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-medium">Cliente Preferencial:</span> No
                  hay reembolso automático, depende de la política del conductor
                </li>
                <li>
                  <span className="font-medium">Club Lealtad:</span> 100% de
                  reembolso si cancelas con al menos 48 horas de antelación
                </li>
                <li>
                  <span className="font-medium">Club Fidelidad:</span> 100% de
                  reembolso si cancelas con al menos 24 horas de antelación
                </li>
              </ul>
              <p className="mt-2">
                En casos de fuerza mayor (enfermedad grave, accidente, etc.),
                contacta con nuestro servicio de atención al cliente para
                estudiar tu caso.
              </p>
            </div>
          ),
        },
        {
          question: "¿Puedo modificar mi reserva?",
          answer:
            "No es posible modificar directamente una reserva ya confirmada. Si necesitas cambiar la fecha, hora o número de plazas, deberás cancelar la reserva actual (sujeto a la política de cancelación) y hacer una nueva. Te recomendamos verificar la disponibilidad del nuevo viaje antes de cancelar el actual.",
        },
        {
          question: "¿Qué sucede si el conductor cancela el viaje?",
          answer:
            "Si el conductor cancela el viaje, recibirás una notificación inmediata y se te reembolsará el 100% del importe pagado, independientemente del plan que tengas. Además, te ofreceremos alternativas de viaje similares si están disponibles.",
        },
      ],
    },
    {
      id: "recommendations",
      title: "Sistema de recomendaciones",
      icon: <Users className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Cómo funciona el sistema de recomendaciones?",
          answer: (
            <div>
              <p>
                El sistema de recomendaciones está disponible exclusivamente
                para miembros del Club Fidelidad. Funciona así:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>
                  Accede a la sección <strong>Recomienda y ahorra</strong> en tu
                  cuenta
                </li>
                <li>
                  Comparte tu código de invitación con amigos que aún no usen
                  Viaje Seguro
                </li>
                <li>
                  Cuando tus amigos se registren y completen su primer viaje
                  usando tu código, ambos recibiréis un beneficio
                </li>
                <li>
                  Puedes recomendar hasta 3 amigos por mes para obtener
                  descuentos acumulativos
                </li>
              </ol>
              <p className="mt-2">
                <span className="font-medium">
                  Descuentos por recomendaciones:
                </span>
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>1 amigo: viaje a 19,80€ (ahorro de 7,70€)</li>
                <li>2 amigos: viaje a 17,60€ (ahorro de 9,90€)</li>
                <li>3 amigos: viaje a 15,40€ (ahorro de 12,10€)</li>
              </ul>
            </div>
          ),
        },
        {
          question: "¿Los descuentos por recomendaciones caducan?",
          answer:
            "Sí, los descuentos por recomendaciones se renuevan mensualmente. Tienes hasta el final del mes siguiente para utilizar los descuentos acumulados. Por ejemplo, si recomiendas a 2 amigos en marzo, tendrás hasta finales de abril para disfrutar del descuento correspondiente.",
        },
        {
          question:
            "¿Qué reciben mis amigos al usar mi código de recomendación?",
          answer:
            "Tus amigos recibirán un 50% de descuento en su primer viaje (hasta un máximo de 10€) al registrarse con tu código de recomendación. Además, se convertirán automáticamente en Clientes Preferenciales, obteniendo el descuento básico de 2,75€ en todos sus viajes futuros.",
        },
      ],
    },
    {
      id: "drivers",
      title: "Conductores y vehículos",
      icon: <Car className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Cómo se verifican los conductores?",
          answer:
            "Todos los conductores deben completar un proceso de verificación que incluye la validación de su identidad, licencia de conducir vigente, documentación del vehículo y seguro. Además, implementamos un sistema de valoraciones y reseñas para mantener altos estándares de calidad y seguridad.",
        },
        {
          question: "¿Puedo elegir mi asiento en el vehículo?",
          answer:
            "La selección de asientos está disponible exclusivamente para miembros del Club Fidelidad. Si tienes este plan, podrás seleccionar tu asiento preferido durante el proceso de reserva, sujeto a disponibilidad. Los demás usuarios recibirán su asignación de asiento por parte del conductor.",
        },
        {
          question: "¿Qué debo hacer si tengo problemas con el conductor?",
          answer:
            "Si experimentas algún problema durante el viaje, te recomendamos intentar resolverlo directamente con el conductor de manera respetuosa. Si esto no es posible o el problema persiste, contacta inmediatamente con nuestro servicio de atención al cliente a través de la app o sitio web. En situaciones de emergencia, no dudes en contactar a las autoridades locales.",
        },
        {
          question: "¿Puedo llevar equipaje adicional?",
          answer:
            "El equipaje permitido depende de cada conductor y vehículo. En la descripción del viaje encontrarás información sobre el espacio disponible para equipaje. Como norma general, se permite una maleta mediana y un bolso de mano por pasajero. Si necesitas llevar equipaje adicional o especial (como instrumentos musicales, equipamiento deportivo, etc.), te recomendamos contactar con el conductor antes de reservar.",
        },
      ],
    },
    {
      id: "security",
      title: "Seguridad y privacidad",
      icon: <Shield className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Están asegurados los viajes?",
          answer:
            "Sí, todos los viajes realizados a través de Viaje Seguro incluyen un seguro básico que cubre a los pasajeros durante el trayecto. Este seguro complementa el seguro obligatorio del vehículo. Para más detalles sobre la cobertura específica, puedes consultar nuestra sección de Términos y Condiciones.",
        },
        {
          question: "¿Cómo protegen mis datos personales?",
          answer:
            "La protección de tus datos es una prioridad para nosotros. Cumplimos con el Reglamento General de Protección de Datos (RGPD) y solo recopilamos la información necesaria para prestar nuestros servicios. Tus datos de pago están encriptados y no compartimos tu información personal con terceros sin tu consentimiento. Puedes consultar nuestra Política de Privacidad para más detalles.",
        },
        {
          question: "¿Qué medidas de seguridad tienen implementadas?",
          answer: (
            <div>
              <p>
                Implementamos diversas medidas para garantizar la seguridad de
                nuestra comunidad:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Verificación de identidad de todos los usuarios</li>
                <li>Sistema de valoraciones y reseñas</li>
                <li>Seguimiento GPS de los viajes (opcional)</li>
                <li>Botón de emergencia en la aplicación</li>
                <li>Equipo de atención al cliente disponible 24/7</li>
                <li>Seguro para todos los viajes</li>
              </ul>
              <p className="mt-2">
                Además, ofrecemos recomendaciones de seguridad a todos nuestros
                usuarios y monitorizamos constantemente la plataforma para
                detectar comportamientos sospechosos.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: "support",
      title: "Atención al cliente",
      icon: (
        <MessageSquare className="min-h-5 min-w-5 text-custom-golden-600" />
      ),
      faqs: [
        {
          question: "¿Cómo puedo contactar con atención al cliente?",
          answer: (
            <div>
              <p>
                Puedes contactar con nuestro equipo de atención al cliente de
                varias formas:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-medium">Chat en vivo:</span> Disponible
                  en nuestra web y app de lunes a domingo de 8:00 a 22:00
                </li>
                <li>
                  <span className="font-medium">Correo electrónico:</span>{" "}
                  <a
                    href="mailto:ayuda@viajeseguro.com"
                    className="text-custom-golden-600 hover:underline">
                    ayuda@viajeseguro.com
                  </a>
                </li>
                <li>
                  <span className="font-medium">Teléfono:</span> 900 123 456
                  (gratuito) de lunes a viernes de 9:00 a 20:00
                </li>
                <li>
                  <span className="font-medium">Formulario de contacto:</span>{" "}
                  Disponible en la sección de{" "}
                  <Link
                    href="/contact"
                    className="text-custom-golden-600 hover:underline">
                    Contacto
                  </Link>
                </li>
              </ul>
              <p className="mt-2">
                Para emergencias durante un viaje, utiliza el botón de
                emergencia en la aplicación para recibir asistencia inmediata.
              </p>
            </div>
          ),
        },
        {
          question: "¿Cuál es el tiempo de respuesta habitual?",
          answer:
            "Nuestro tiempo de respuesta habitual es de menos de 2 horas para consultas por chat, y menos de 24 horas para consultas por correo electrónico. Para casos urgentes relacionados con viajes en curso o programados para las próximas 24 horas, damos prioridad y tratamos de responder en minutos.",
        },
        {
          question: "¿Tienen oficinas físicas donde pueda acudir?",
          answer:
            "Actualmente operamos principalmente de forma digital para ofrecer nuestros servicios de manera más eficiente. No disponemos de oficinas de atención al público, pero nuestro equipo de atención al cliente está disponible a través de los canales mencionados anteriormente para ayudarte con cualquier consulta o problema.",
        },
      ],
    },
    {
      id: "reviews",
      title: "Valoraciones y reseñas",
      icon: <Star className="min-h-5 min-w-5 text-custom-golden-600" />,
      faqs: [
        {
          question: "¿Cómo funciona el sistema de valoraciones?",
          answer: (
            <div>
              <p>
                Después de cada viaje, tanto pasajeros como conductores pueden
                valorarse mutuamente en una escala de 1 a 5 estrellas y dejar
                comentarios. Las valoraciones se basan en varios aspectos:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-medium">Para conductores:</span>{" "}
                  puntualidad, amabilidad, comodidad del vehículo y respeto a
                  las normas de tráfico
                </li>
                <li>
                  <span className="font-medium">Para pasajeros:</span>{" "}
                  puntualidad, amabilidad y respeto
                </li>
              </ul>
              <p className="mt-2">
                Estas valoraciones son visibles en los perfiles y ayudan a
                mantener la calidad y confianza en nuestra comunidad.
              </p>
            </div>
          ),
        },
        {
          question: "¿Puedo modificar o eliminar una valoración que he dejado?",
          answer:
            "Puedes modificar tu valoración hasta 14 días después de haberla publicado. Para hacerlo, ve a la sección 'Mis viajes', selecciona el viaje correspondiente y haz clic en 'Editar valoración'. No es posible eliminar completamente una valoración, pero puedes actualizarla si tu opinión ha cambiado.",
        },
        {
          question: "¿Qué debo hacer si recibo una valoración injusta?",
          answer:
            "Si consideras que has recibido una valoración injusta o que viola nuestras normas comunitarias, puedes reportarla. Nuestro equipo revisará el caso y, si se determina que la valoración es inapropiada o falsa, podrá ser eliminada. Ten en cuenta que no eliminamos valoraciones solo porque sean negativas si son honestas y respetuosas.",
        },
      ],
    },
  ];

  const filteredCategories = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (typeof faq.answer === "string" &&
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="flex flex-col min-h-screen bg-custom-white-50 text-custom-black-900">
      <NavBar />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="bg-custom-black-800 text-custom-white-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Preguntas frecuentes
          </h1>
          <p className="text-xl text-custom-gray-300 max-w-2xl mx-auto mb-8">
            Encuentra respuestas a las dudas más comunes sobre nuestros
            servicios, reservas, pagos y más.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-custom-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar pregunta o palabra clave..."
              className="pl-10 py-4 text-custom-gray-800 outline-none bg-custom-white-100 rounded-lg w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-8">
                <h2 className="text-lg font-bold mb-4 text-custom-black-800">
                  Categorías
                </h2>
                <nav className="space-y-1">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? "bg-custom-golden-100 text-custom-golden-700 font-medium"
                          : "text-custom-gray-600 hover:bg-custom-gray-100"
                      }`}
                      onClick={() => setActiveCategory(category.id)}>
                      {category.icon}
                      <span>{category.title}</span>
                      <span
                        className={`${
                          activeCategory === category.id
                            ? "text-custom-golden-700"
                            : "bg-custom-gray-200 text-custom-gray-700"
                        } ml-auto rounded-full px-2 py-0.5 text-xs`}>
                        {category.faqs.length}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Contact Support */}
                <div className="mt-8 bg-custom-golden-100 rounded-lg p-4 border border-custom-golden-500">
                  <h3 className="font-medium text-custom-golden-700 mb-2">
                    ¿No encuentras lo que buscas?
                  </h3>
                  <p className="text-sm text-custom-gray-700 mb-4">
                    Nuestro equipo de atención al cliente está disponible para
                    ayudarte con cualquier duda.
                  </p>
                  <Link href="/contact">
                    <button className="w-full bg-custom-white-50 border p-2 rounded-md border-custom-golden-600 text-custom-golden-700 hover:text-custom-black-700 duration-300">
                      Contactar con soporte
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* FAQ Content */}
            <div className="md:col-span-3">
              {searchQuery && filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-custom-gray-800 mb-2">
                    No se encontraron resultados
                  </h2>
                  <p className="text-custom-gray-600 mb-6">
                    No hemos encontrado respuestas que coincidan con{" "}
                    <strong>{searchQuery}</strong>.
                  </p>
                  <button
                    className="border-custom-golden-600 text-custom-golden-700"
                    onClick={() => setSearchQuery("")}>
                    Borrar búsqueda
                  </button>
                </div>
              ) : (
                filteredCategories.map((category) => {
                  // Si hay una búsqueda activa, mostrar todas las categorías con resultados
                  // Si no hay búsqueda, mostrar solo la categoría activa
                  if (!searchQuery && activeCategory !== category.id)
                    return null;

                  return (
                    <div key={category.id} className="mb-10">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="bg-custom-golden-100 p-2.5 rounded-full">
                          {category.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-custom-black-800">
                          {category.title}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {category.faqs.map((faq, index) => {
                          const key = `${category.id}-${index}`;
                          const isOpen = openQuestions[key] || false;

                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="border border-custom-gray-200 rounded-lg overflow-hidden bg-custom-white-100">
                              <button
                                className="w-full flex items-center justify-between p-4 text-left font-medium text-custom-black-800 hover:bg-custom-gray-50"
                                onClick={() =>
                                  toggleQuestion(category.id, index)
                                }>
                                <span>{faq.question}</span>
                                {isOpen ? (
                                  <ChevronUp className="min-h-5 min-w-5 text-custom-gray-500" />
                                ) : (
                                  <ChevronDown className="min-h-5 min-w-5 text-custom-gray-500" />
                                )}
                              </button>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 pt-0 border-t border-custom-gray-200 text-custom-gray-700">
                                    {faq.answer}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </motion.section>
      <CTASection />
      <Footer />
    </div>
  );
};

export default FAQPage;
