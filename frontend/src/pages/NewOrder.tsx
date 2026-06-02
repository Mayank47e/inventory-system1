import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useAppContext } from '../context/AppContext';

export const NewOrder = () => {
    const { setLoading, setError, isLoading, error } = useAppContext();
    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form State
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('1');

    // Fetch dropdown data on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [custRes, prodRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/products')
                ]);
                
                // THE TRUTH DETECTOR: Prints exactly what React receives
                console.log("RAW CUSTOMERS:", custRes.data);
                console.log("RAW PRODUCTS:", prodRes.data);

                // BULLETPROOF DATA EXTRACTION
                const customerList = custRes.data?.data || (Array.isArray(custRes.data) ? custRes.data : []);
                const productList = prodRes.data?.data || (Array.isArray(prodRes.data) ? prodRes.data : []);

                setCustomers(customerList);
                setProducts(productList);

            } catch (err: any) {
                console.error("Failed to load dropdowns:", err);
                setError("Network error: Could not load the items from the database.");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(null); setSuccessMessage(null);

        try {
            const payload = {
                customer_id: selectedCustomer,
                items: [
                    {
                        product_id: selectedProduct,
                        quantity: parseInt(quantity, 10)
                    }
                ]
            };

            const response = await api.post('/orders', payload);
            setSuccessMessage(`✅ Order Placed Successfully! Total: $${response.data.data.total.toFixed(2)}`);
            setQuantity('1'); 
            setSelectedProduct(''); 
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-start">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg mt-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout Terminal</h1>
                
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg font-bold">🛑 {error}</div>}
                {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg font-bold border border-green-300">{successMessage}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Customer</label>
                        <select required value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                            <option value="" disabled>-- Choose a Customer --</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Product</label>
                        <select required value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                            <option value="" disabled>-- Choose a Product --</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${Number(p.price).toFixed(2)} ({p.quantity_in_stock} in stock)</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                        <input type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition dynamic shadow-md mt-4 disabled:bg-gray-400">
                        {isLoading ? 'Processing Transaction...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};