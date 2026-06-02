import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useAppContext } from '../context/AppContext';

export const Dashboard = () => {
    // This grabs the "memory" we made earlier
    const { setLoading, setError } = useAppContext();
    
    // This creates a blank scoreboard to hold our numbers
    const [stats, setStats] = useState({
        total_products: 0,
        total_customers: 0,
        total_orders: 0
    });

    // This is the magic robot that calls the backend as soon as the page opens!
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Dialing the backend phone number...
                const response = await api.get('/dashboard/stats');
                setStats(response.data); // Saving the backend's answer to our scoreboard
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // This is the HTML that draws the actual screen
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Inventory Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1: Products */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Products</h2>
                    <p className="text-5xl font-extrabold text-gray-800 mt-2">{stats.total_products}</p>
                </div>
                
                {/* Stat Card 2: Customers */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
                    <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Customers</h2>
                    <p className="text-5xl font-extrabold text-gray-800 mt-2">{stats.total_customers}</p>
                </div>
                
                {/* Stat Card 3: Orders */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
                    <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</h2>
                    <p className="text-5xl font-extrabold text-gray-800 mt-2">{stats.total_orders}</p>
                </div>
            </div>
        </div>
    );
};