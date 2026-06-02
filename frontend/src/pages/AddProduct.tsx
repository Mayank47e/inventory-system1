import { useState } from 'react';
import { api } from '../api/axios';
import { useAppContext } from '../context/AppContext';

export const AddProduct = () => {
    // We added 'error' to this line so we can read it!
    const { setLoading, setError, isLoading, error } = useAppContext();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        quantity_in_stock: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const payload = {
                name: formData.name,
                sku: formData.sku,
                price: parseFloat(formData.price),
                quantity_in_stock: parseInt(formData.quantity_in_stock, 10)
            };

            await api.post('/products', payload);
            
            setSuccessMessage("🎉 Product added successfully!");
            setFormData({ name: '', sku: '', price: '', quantity_in_stock: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-start">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg mt-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>
                
                {/* WE ADDED THIS: The Red Error Banner */}
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg font-bold border border-red-300">🛑 Error: {error}</div>}
                
                {/* The Green Success Banner */}
                {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg font-bold border border-green-300">{successMessage}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Wireless Mouse" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                        <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., MOUSE-WRLS-01" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="29.99" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
                            <input type="number" name="quantity_in_stock" value={formData.quantity_in_stock} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="150" />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition dynamic shadow-md disabled:bg-gray-400 mt-4">
                        {isLoading ? 'Saving to Database...' : 'Save Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};