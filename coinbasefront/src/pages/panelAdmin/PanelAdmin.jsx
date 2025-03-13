export function PanelAdmin() {
    return (
        <>
            <div className="flex h-screen bg-gray-100">

                <div className="w-64 bg-blue-900 text-white p-5 hidden md:block">
                    <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
                    <ul>
                        <li className="mb-4 hover:text-gray-300 cursor-pointer">Products</li>
                        <li className="hover:text-gray-300 cursor-pointer">Orders</li>
                    </ul>
                </div>


                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-6">Product Management</h1>


                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">Name</th>
                                    <th className="py-2 px-4 border">Price</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td className="py-2 px-4 border">1</td>
                                    <td className="py-2 px-4 border">Product X</td>
                                    <td className="py-2 px-4 border">$99.99</td>
                                    <td className="py-2 px-4 border flex space-x-2">
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
                </div>
            </div>
        </>
    );
}
