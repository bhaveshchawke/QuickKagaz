import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const ItemsTable = ({ items, setItems }) => {
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleItemChange = (id, field, value) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate amount
        // Use standard number parsing that handles empty strings safely for calc
        const qty = updatedItem.quantity === '' ? 0 : parseFloat(updatedItem.quantity);
        const rate = updatedItem.rate === '' ? 0 : parseFloat(updatedItem.rate);
        
        // Ensure we don't get NaN in amount
        const validQty = isNaN(qty) ? 0 : qty;
        const validRate = isNaN(rate) ? 0 : rate;
        
        updatedItem.amount = validQty * validRate;
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        description: '',
        hsn: '',
        quantity: 1,
        unit: 'Nos',
        rate: 0,
        taxRate: 18,
        amount: 0
      }
    ]);
  };

  const deleteItem = (id) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[30%]">Description</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">HSN/SAC</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Unit</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Rate (₹)</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Tax %</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[5%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>
                 <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="HSN"
                    value={item.hsn}
                    onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>
                 <td className="px-4 py-2">
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-sans text-sm"
                  >
                    <option value="Nos">Nos</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Mtrs">Mtrs</option>
                    <option value="Box">Box</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Hrs">Hrs</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>
                 <td className="px-4 py-2">
                  <select
                    value={item.taxRate}
                    onChange={(e) => handleItemChange(item.id, 'taxRate', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-4 py-2 text-center">
                    {items.length > 1 && (
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          <Plus size={18} /> Add Line Item
        </button>
      </div>
    </div>
  );
};

export default ItemsTable;
