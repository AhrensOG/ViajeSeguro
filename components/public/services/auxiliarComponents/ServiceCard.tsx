"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { JSX, useState } from "react";
import NotifyModal from "./NotifyModal";

const ServiceCard = ({
  title,
  description,
  image,
  points,
  icon,
}: {
  title: string;
  description: string;
  image: string;
  points: string[];
  icon: JSX.Element;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-custom-white-100 border-custom-gray-300 overflow-hidden transition-all rounded-md hover:shadow-md duration-300">
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 rounded-full bg-custom-black-800/80 text-custom-white-100 border-0">
            Próximamente
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between min-h-[390px]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="font-bold text-xl text-custom-black-800">{title}</h3>
          </div>

          <p className="text-custom-gray-600 mb-6">{description}</p>

          <div className="space-y-3 mb-6">
            {points.map((point, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-custom-gray-800">
                <div className="h-1.5 w-1.5 rounded-full bg-custom-golden-600"></div>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex gap-2 items-center justify-center p-4 font-bold rounded-md w-full border duration-300 border-custom-golden-600 text-custom-golden-600 hover:bg-custom-golden-100">
          Recibir notificación cuando esté disponible
          <Bell className="ml-2 h-4 w-4 min-w-4" />
        </button>
      </div>

      <NotifyModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ServiceCard;
