import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useAppContext } from '../context/AppContext';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export const Customers = () => {
    const { setLoading, setError, isLoading, error } = useAppContext();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            if (response.data && response.data.data) {
                setCustomers(response.data.data);
            }
        } catch (err: any) {
            console.error(err);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(null); setSuccessMessage(null);

        try {
            await api.post('/customers', formData);
            setSuccessMessage("🎉 Customer added successfully!");
            setFormData({ name: '', email: '', phone: '' });
            fetchCustomers(); // Refresh the list instantly!
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                
                {/* LEFT SIDE: Add Customer Form */}
                <div className="bg-white p-6 rounded-xl shadow-md col-span-1 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">New Customer</h2>
                    
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">🛑 {error}</div>}
                    {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-bold">{successMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" placeholder="jane@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="(555) 123-4567" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:bg-gray-400">
                            {isLoading ? 'Saving...' : 'Add Customer'}
                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE: Customer Directory */}
                <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Customer Directory</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customers.length === 0 ? (
                                    <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No customers yet.</td></tr>
                                ) : (
                                    customers.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{c.email}</td>
                                            <td className="px-4 py-3 text-gray-600">{c.phone || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};