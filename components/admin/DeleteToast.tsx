import { toast } from "sonner";

const DeleteToast = (
    id: string,
    onDelete: (id: string) => Promise<void>,
    customMessage?: {
        title?: string;
        description?: string;
        confirmLabel?: string;
        cancelLabel?: string;
    }
) => {
    if (!id || typeof id !== "string") {
        toast.error("ID del viaje inválido");
        return;
    }

    const {
        title = "¿Estás seguro de que deseas borrar este elemento?",
        description = "Esta acción no se puede deshacer.",
        confirmLabel = "Sí, borrar",
        cancelLabel = "Cancelar",
    } = customMessage || {};

    toast.custom(
        (t) => (
            <div className="p-4 bg-white border border-custom-golden-400 rounded-lg shadow-lg text-custom-black-800 w-[320px]">
                <p className="text-sm font-medium mb-2">{title}</p>
                <p className="text-xs text-custom-gray-600 mb-4">{description}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            toast.dismiss(t);
                            onDelete(id);
                        }}
                        className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white text-sm px-4 py-2 rounded"
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="bg-custom-gray-200 hover:bg-custom-gray-300 text-sm text-custom-black-700 px-4 py-2 rounded"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        ),
        {
            duration: 10000,
        }
    );
};

export default DeleteToast;
