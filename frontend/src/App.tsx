import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { AddProduct } from './pages/AddProduct';
import { InventoryList } from './pages/InventoryList';
import { Customers } from './pages/Customers';
import { NewOrder } from './pages/NewOrder'; // WE ADDED THIS

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-product' | 'inventory' | 'customers' | 'new-order'>('dashboard');

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="text-xl font-extrabold text-indigo-600 tracking-wider">📦 INVENTORY HUB</span>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Dashboard</button>
              <button onClick={() => setCurrentView('inventory')} className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${currentView === 'inventory' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Stock List</button>
              <button onClick={() => setCurrentView('customers')} className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${currentView === 'customers' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Customers</button>
              <button onClick={() => setCurrentView('new-order')} className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${currentView === 'new-order' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>🛒 Checkout</button>
              <button onClick={() => setCurrentView('add-product')} className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${currentView === 'add-product' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>+ Add Product</button>
            </div>
          </div>
        </nav>

        <main>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'inventory' && <InventoryList />}
          {currentView === 'customers' && <Customers />}
          {currentView === 'new-order' && <NewOrder />}
          {currentView === 'add-product' && <AddProduct />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;