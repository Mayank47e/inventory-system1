import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useAppContext } from '../context/AppContext';

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity_in_stock: number;
}

export const InventoryList = () => {
    const { setLoading, setError, isLoading, error } = useAppContext();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/products');
            
            // THE TRUTH DETECTOR: This prints exactly what React receives to your browser console
            console.log("REACT RECEIVED THIS:", response.data); 

            // A more forgiving check just in case the data is wrapped differently
            if (response.data && response.data.data) {
                setProducts(response.data.data);
            } else if (Array.isArray(response.data)) {
                setProducts(response.data);
            }
        } catch (err: any) {
            console.error("REACT NETWORK ERROR:", err);
            setError(err.message || "Could not retrieve inventory items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // BULLETPROOF FILTER: Converts everything to a string first so numbers don't crash the app
    const filteredProducts = products.filter(product => {
        const safeName = String(product.name || '').toLowerCase();
        const safeSku = String(product.sku || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return safeName.includes(search) || safeSku.includes(search);
    });

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Stock List</h1>
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:max-w-xs"
                    />
                </div>

                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg font-semibold">🛑 Error: {error}</div>}

                {isLoading ? (
                    <div className="text-center py-12 font-medium text-gray-500">Connecting to database...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No items match your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">SKU Code</th>
                                    <th className="px-6 py-4 text-right">Price</th>
                                    <th className="px-6 py-4 text-center">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono">{product.sku}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">${Number(product.price).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-700">{product.quantity_in_stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};