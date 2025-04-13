import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        email: string;
        name: string;
        lastName: string;
    };
}

const ChangePasswordModal = ({ isOpen, onClose, user }: ChangePasswordModalProps) => {
    // Esquema de validación para el formulario de cambio de contraseña
    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().required("La contraseña actual es obligatoria"),
        newPassword: Yup.string().required("La nueva contraseña es obligatoria"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
            .required("La confirmación de contraseña es obligatoria"),
    });

    // Valores iniciales del formulario de cambio de contraseña
    const initialValues: ChangePasswordFormValues = {
        currentPassword: user.email || "",
        newPassword: user.name || "",
        confirmPassword: user.lastName || "",
    };

    // Función para manejar el envío del formulario de cambio de contraseña
    const handlePasswordChangeSubmit = (values: ChangePasswordFormValues) => {
        console.log("Contraseña cambiada:", values);
        alert("Contraseña actualizada correctamente");
        onClose(); // Cierra el modal después de enviar
    };

    return (
        <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden={isOpen ? "false" : "true"}
            className={`${isOpen ? "" : "hidden"} fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center`}
        >
            {/* Overlay */}
            <div
                className="absolute top-0 left-0 right-0 bottom-0  bg-black/30"
                onClick={onClose} // Cierra el modal al hacer clic en el overlay
            />

            {/* Modal */}
            <div
                className="relative bg-white rounded-lg shadow-sm max-w-md w-full p-4 md:p-5"
                onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
            >
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900">Cambiar Contraseña</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                <div className="p-4 md:p-5 space-y-4">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handlePasswordChangeSubmit}>
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                {/* Campo de contraseña actual */}
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                        Contraseña Actual:
                                    </label>
                                    <Field
                                        type="password"
                                        name="currentPassword"
                                        id="currentPassword"
                                        placeholder="Ingresa tu contraseña actual"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    />
                                    <ErrorMessage name="currentPassword" component="div" className="text-sm text-orange-600 mt-1" />
                                </div>

                                {/* Campo de nueva contraseña */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Nueva Contraseña:
                                    </label>
                                    <Field
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        placeholder="Ingresa tu nueva contraseña"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    />
                                    <ErrorMessage name="newPassword" component="div" className="text-sm text-orange-600 mt-1" />
                                </div>

                                {/* Campo de confirmación de contraseña */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirmar Contraseña:
                                    </label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirma tu nueva contraseña"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-sm text-orange-600 mt-1" />
                                </div>

                                {/* Botón de envío */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm transition duration-200 ${
                                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    Cambiar Contraseña
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
