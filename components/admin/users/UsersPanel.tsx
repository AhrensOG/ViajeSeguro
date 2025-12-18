import { fetchUsersData, restoreUser } from "@/lib/api/admin/user-panel";
import { SimpleUser, UserAdminResponse, UserResponse } from "@/lib/api/admin/user-panel/userPanel.types";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Search, RotateCcw } from "lucide-react";
import SkeletonTable from "../SkeletonTable";
import UserCreateModal from "@/components/admin/users/auxiliarComponents/UserCreateModal";
import UserEditModal from "@/components/admin/users/auxiliarComponents/UserEditModal";
import UserDetailModal from "@/components/admin/users/auxiliarComponents/UserDetailModal";
import UserBanModal from "@/components/admin/users/auxiliarComponents/UserBanModal";
import { toast } from "sonner";
// import DeleteToast from "../DeleteToast"; // Replaced by Modal

export default function UsersPanel() {
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
    const [banModalIsOpen, setBanModalIsOpen] = useState(false);
    const [showBanned, setShowBanned] = useState(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchUsersData(showBanned);
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
                    resetToken: user.resetToken,
                    resetTokenExpires: user.resetTokenExpires,
                    driverLicenseUrl: user.driverLicenseUrl,
                })
            );
            setUsers(mappedUsers);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setLoading(false);
        }
    }, [showBanned]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            `${user.name} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Ordenar por fecha de registro (createdAt) descendente: más nuevos arriba
    const filteredAndSortedUsers = [...filteredUsers].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
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

    const handleDeleteSuccess = (id: string) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setSelectedUser(null);
    };

    /* Old handleDelete - kept for reference or if we revert to direct delete
    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteUser(id ?? "");
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            setSelectedUser(null);
            toast.success("Usuario baneado exitosamente");
        } catch {
            toast.info("Error al banear el usuario");
        }
    };
    */

    const handleRestore = async (id: string): Promise<void> => {
        try {
            await restoreUser(id);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            toast.success("Usuario desbaneado exitosamente");
        } catch {
            toast.error("Error al desbanear el usuario");
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
                        <option value="CLIENT">Cliente</option>
                        <option value="DRIVER">Conductor</option>
                        <option value="ADMIN">Admin</option>
                        <option value="PARTNER">Partner</option>
                    </select>
                </div>
                <button
                    onClick={() => setCreateModalIsOpen(true)}
                    className="cursor-pointer flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Crear nuevo
                </button>
                <button
                    onClick={() => setShowBanned(!showBanned)}
                    className={`cursor-pointer flex items-center gap-2 font-semibold px-4 py-2 rounded-md shadow-sm border ${showBanned
                        ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    {showBanned ? "Ver Usuarios Activos" : "Ver Baneados"}
                </button>
            </div>

            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-auto flex flex-col">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-[26%]">Nombre</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-[28%]">Email</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-[16%]">Rol</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300 w-[18%]">Fecha de registro</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center w-[12%]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {filteredAndSortedUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                        } cursor-pointer hover:bg-custom-golden-100 transition`}
                                    onClick={() => handleViewUser(user)}
                                >
                                    <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">
                                        {user.name} {user.lastName}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{user.email}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{user.role}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{formatDate(user.createdAt)}</td>
                                    <td className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditUser(user);
                                            }}
                                            className="cursor-pointer text-custom-golden-600 hover:text-custom-golden-700"
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedUser(user);
                                                setBanModalIsOpen(true);
                                                // DeleteToast(user.id as string, handleDelete);
                                            }}
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4 inline-block" />
                                        </button>
                                        {showBanned && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(user.id as string);
                                                }}
                                                className="cursor-pointer text-green-600 hover:text-green-800"
                                                aria-label="Desbanear"
                                                title="Desbanear usuario"
                                            >
                                                <RotateCcw className="h-4 w-4 inline-block" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {createModalIsOpen && <UserCreateModal onClose={() => setCreateModalIsOpen(false)} onSuccess={setUsers} />}
            {editModalIsOpen && selectedUser && (
                <UserEditModal user={selectedUser as UserAdminResponse} onClose={() => setEditModalIsOpen(false)} onUpdateUser={handleUpdateUser} />
            )}
            {viewModalIsOpen && <UserDetailModal user={selectedUser as UserAdminResponse} onClose={() => setViewModalIsOpen(false)} />}
            {banModalIsOpen && selectedUser && (
                <UserBanModal
                    user={selectedUser}
                    onClose={() => setBanModalIsOpen(false)}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </div>
    );
}
