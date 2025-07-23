import Image from "next/image";
import { Fuel, Settings, Users } from "lucide-react";

const VehicleDetails = () => (
    <article className="flex justify-between gap-6 w-full h-[16rem] m-3 mb-1 p-6 border rounded-md border-custom-gray-300 shadow-sm">
        <div className="flex items-center justify-center w-[23rem] h-[13rem] relative rounded-md">
            <Image className="rounded-md" src="/main/img_placeholder.webp" alt="placeholder" fill />
        </div>
        <div className="flex flex-col gap-3 grow-1 justify-evenly">
            <h2 className="text-custom-gray-800 font-bold text-2xl">Mercedes Sprinter 2024</h2>
            <div className="flex gap-3">
                <p className="flex gap-2 items-center text-lg">
                    <Users className="size-5 text-custom-gray-600" /> 9 personas
                </p>
                <p className="flex gap-2 items-center text-lg">
                    <Fuel className="size-5 text-custom-gray-600" /> Diesél
                </p>
                <p className="flex gap-2 items-center text-lg">
                    <Settings className="size-5 text-custom-gray-600" /> Manual
                </p>
            </div>
            <div className="flex flex-wrap gap-6">
                {["GPS incluido", "Aire acondicionado", "Bluetooth", "Cámara trasera"].map((feature, i) => (
                    <p key={i} className="text-sm bg-custom-gray-300 rounded-full p-2">
                        {feature}
                    </p>
                ))}
            </div>
        </div>
    </article>
);

export default VehicleDetails;
