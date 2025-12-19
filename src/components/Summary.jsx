import React from 'react';

const Summary = ({ items }) => {
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalTax = items.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;
    return sum + (amount * taxRate / 100);
  }, 0);
  const grandTotal = subtotal + totalTax;

  return (
    <div className="flex justify-end mb-8">
      <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Total Tax</span>
            <span>{formatCurrency(totalTax)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-800">
            <span>Grand Total</span>
            <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
