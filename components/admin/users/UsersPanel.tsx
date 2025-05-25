import { deleteUser, fetchUsersData } from "@/lib/api/admin/user-panel";
import { SimpleUser, UserAdminResponse, UserResponse } from "@/lib/api/admin/user-panel/userPanel.types";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import SkeletonTable from "../SkeletonTable";
import UserCreateModal from "@/components/admin/users/auxiliarComponents/UserCreateModal";
import UserEditModal from "@/components/admin/users/auxiliarComponents/UserEditModal";
import UserDetailModal from "@/components/admin/users/auxiliarComponents/UserDetailModal";
import { toast } from "sonner";
import DeleteToast from "../DeleteToast";

export default function UsersPanel() {
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [viewModalIsOpen, setViewModalIsOpen] = useState(false);

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
                        id: user.id,
                        email: user.email ?? "",
                        avatarUrl: user.avatarUrl ?? "",
                        lastName: user.lastName ?? "",
                        name: user.name ?? "",
                        role: user.role ?? "CLIENT",
                        createdAt: user.createdAt ?? "",
                        updatedAt: user.updatedAt ?? "",
                        emailVerified: user.emailVerified ?? false,
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

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            `${user.name} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleEditUser = (user: SimpleUser) => {
        setSelectedUser(user);
        setEditModalIsOpen(true);
    };

    const handleViewUser = (user: SimpleUser) => {
        setSelectedUser(user);
        setViewModalIsOpen(true);
    };

    const handleUpdateUser = (updatedUser: SimpleUser) => {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
    };

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteUser(id ?? "");
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            setSelectedUser(null);
            toast.success("Usuario eliminado exitosamente");
        } catch {
            toast.info("Error al eliminar el usuario");
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <h1 className="text-2xl font-bold mb-4 text-custom-golden-600">Panel de Administración</h1>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                        />
                        <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-custom-gray-300 rounded-md px-3 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                    >
                        <option value="ALL">Todos los roles</option>
                        <option value="CLIENT">CLIENT</option>
                        <option value="DRIVER">DRIVER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <button
                    onClick={() => setCreateModalIsOpen(true)}
                    className="flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Crear nuevo
                </button>
            </div>

            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-hidden flex flex-col">
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
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition`}
                                    onClick={() => handleViewUser(user)}
                                >
                                    <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">
                                        {user.name} {user.lastName}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{user.email}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{user.role}</td>
                                    <td
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditUser(user);
                                            }}
                                            className="text-custom-golden-600 hover:text-custom-golden-700 cursor-pointer"
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedUser(user);
                                                DeleteToast(user.id as string, handleDelete);
                                            }}
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
            )}
            {createModalIsOpen && <UserCreateModal onClose={() => setCreateModalIsOpen(false)} onSuccess={() => window.location.reload()} />}
            {editModalIsOpen && selectedUser && (
                <UserEditModal user={selectedUser as UserAdminResponse} onClose={() => setEditModalIsOpen(false)} onUpdateUser={handleUpdateUser} />
            )}
            {viewModalIsOpen && <UserDetailModal user={selectedUser as UserAdminResponse} onClose={() => setViewModalIsOpen(false)} />}
        </div>
    );
}
