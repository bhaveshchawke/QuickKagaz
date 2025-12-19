import React from 'react';

const InvoiceForm = ({ 
  sellerDetails, setSellerDetails, 
  clientDetails, setClientDetails, 
  invoiceDetails, setInvoiceDetails,
  logo, setLogo
}) => {
  
  const handleSellerChange = (e) => {
    const { name, value } = e.target;
    setSellerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Billed By */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Billed By (Seller)</h2>
        
        {/* Logo Upload */}
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Company Logo (Optional)</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "
            />
            {logo && <img src={logo} alt="Logo Preview" className="h-16 mt-2 object-contain" />}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Business Name"
            value={sellerDetails.name}
            onChange={handleSellerChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={sellerDetails.address}
            onChange={handleSellerChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
           <select
            name="state"
            value={sellerDetails.state}
            onChange={handleSellerChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Select State</option>
             <option value="Maharashtra">Maharashtra</option>
             <option value="Delhi">Delhi</option>
             <option value="Karnataka">Karnataka</option>
             <option value="Gujarat">Gujarat</option>
          </select>
          <input
            type="text"
            name="gstin"
            placeholder="GSTIN (Optional)"
            value={sellerDetails.gstin}
            onChange={handleSellerChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <input
            type="text"
            name="email"
            placeholder="Email / Phone"
            value={sellerDetails.email}
            onChange={handleSellerChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        {/* Bank Details Section */}
        <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2 border-b pb-1">Bank Details</h3>
        <div className="space-y-3">
             <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={sellerDetails.bankName}
                onChange={handleSellerChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={sellerDetails.accountNumber}
                onChange={handleSellerChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
             <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    name="bankIFSC"
                    placeholder="IFSC Code"
                    value={sellerDetails.bankIFSC}
                    onChange={handleSellerChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                 <input
                    type="text"
                    name="bankBranch"
                    placeholder="Branch"
                    value={sellerDetails.bankBranch}
                    onChange={handleSellerChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
             </div>
        </div>
      </div>

      {/* Billed To & Invoice Details */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Billed To (Client)</h2>
            <div className="space-y-3">
            <input
                type="text"
                name="name"
                placeholder="Client Business Name"
                value={clientDetails.name}
                onChange={handleClientChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <input
                type="text"
                name="address"
                placeholder="Client Address"
                value={clientDetails.address}
                onChange={handleClientChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
             <select
                name="state"
                value={clientDetails.state}
                onChange={handleClientChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
                <option value="">Select Place of Supply (State)</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
            </select>
            <input
                type="text"
                name="gstin"
                placeholder="Client GSTIN (Optional)"
                value={clientDetails.gstin}
                onChange={handleClientChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Invoice Number</label>
                    <input
                        type="text"
                        name="invoiceNumber"
                        placeholder="INV-001"
                        value={invoiceDetails.invoiceNumber}
                        onChange={handleInvoiceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div>
                   <label className="block text-sm text-gray-500 mb-1">Invoice Date</label>
                    <input
                        type="date"
                        name="date"
                        value={invoiceDetails.date}
                        onChange={handleInvoiceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                 <div className="col-span-2">
                   <label className="block text-sm text-gray-500 mb-1">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={invoiceDetails.dueDate}
                        onChange={handleInvoiceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                {/* PO Details */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">PO Number</label>
                    <input
                        type="text"
                        name="poNumber"
                        placeholder="PO-123"
                        value={invoiceDetails.poNumber}
                        onChange={handleInvoiceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-1">PO Date</label>
                    <input
                        type="date"
                        name="poDate"
                        value={invoiceDetails.poDate}
                        onChange={handleInvoiceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
