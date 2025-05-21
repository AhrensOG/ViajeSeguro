export default function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="w-full animate-pulse bg-custom-white-100 rounded-xl border border-custom-gray-200 p-6">
            <div className="h-5 w-1/3 bg-custom-gray-200 mb-6 rounded" />
            <div className="overflow-x-auto border border-custom-gray-300 rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 border-b border-custom-gray-300">Nombre</th>
                            <th className="px-4 py-3 border-b border-custom-gray-300">Email</th>
                            <th className="px-4 py-3 border-b border-custom-gray-300">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(rows)].map((_, i) => (
                            <tr key={i} className="border-b border-custom-gray-200">
                                <td className="px-4 py-3">
                                    <div className="h-4 w-32 bg-custom-gray-200 rounded" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-48 bg-custom-gray-200 rounded" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-24 bg-custom-gray-200 rounded" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
