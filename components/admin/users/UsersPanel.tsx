import { fetchUsersData } from "@/lib/api/admin/user-panel";
import { SimpleUser, UserResponse } from "@/lib/api/admin/user-panel/userPanel.types";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import SkeletonTable from "../SkeletonTable";

export default function UsersPanel() {
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetchUsersData();
                if (!Array.isArray(res)) {
                    throw new Error("La respuesta del backend no es un array de usuarios");
                }
                const usersResponse = res as unknown as UserResponse[];
                const mappedUsers = usersResponse.map(
                    (user): SimpleUser => ({
                        email: user.email ?? "",
                        avatarUrl: user.avatarUrl ?? "",
                        lastName: user.lastName ?? "",
                        name: user.name ?? "",
                        role: user.role ?? "CLIENT",
                    })
                );
                setUsers(mappedUsers);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <h1 className="text-2xl font-bold mb-4 text-custom-golden-600">Panel de Administración</h1>

            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-hidden flex flex-col">
                    {/* <div className="flex-1 overflow-y-auto rounded border border-custom-gray-300"> */}
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-1/4">Nombre</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-1/4">Email</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-1/4">Rol</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center w-1/4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {users.map((user, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition`}
                                >
                                    <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">
                                        {user.name} {user.lastName}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{user.email}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{user.role}</td>
                                    <td className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2">
                                        <button
                                            onClick={() => console.log("Editar", user)}
                                            className="text-custom-golden-600 hover:text-custom-golden-700"
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={() => console.log("Eliminar", user)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4 inline-block" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                // </div>
            )}
        </div>
    );
}
