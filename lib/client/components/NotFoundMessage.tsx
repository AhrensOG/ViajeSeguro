import Image from "next/image";
import Link from "next/link";

type NotFoundMessageProps = {
  imageSrc?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
};

const NotFoundMessage = ({
  imageSrc = "/trip/not_found_trip.webp",
  message = "No se encontró lo que estás buscando",
  actionHref = "/",
  actionLabel = "Volver al inicio",
}: NotFoundMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 grow">
      <Image src={imageSrc} alt={message} width={256} height={256} />
      <p className="text-lg text-center text-gray-700 font-medium">{message}</p>
      <Link
        href={actionHref}
        className="bg-custom-golden-500 hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow">
        {actionLabel}
      </Link>
    </div>
  );
};

export default NotFoundMessage;
