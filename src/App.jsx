import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import Header from './components/Header';
import InvoiceForm from './components/InvoiceForm';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import { numberToWords } from './utils/numberToWords';

function App() {
  const [sellerDetails, setSellerDetails] = useState({
    name: 'Your Business Name',
    address: '123 Business St, City, State, 123456',
    state: '',
    gstin: '',
    email: 'contact@business.com',
    bankName: '',
    accountNumber: '',
    bankIFSC: '',
    bankBranch: ''
  });

  const [clientDetails, setClientDetails] = useState({
    name: '',
    address: '',
    state: '',
    gstin: '',
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    poNumber: '',
    poDate: ''
  });
  
  const [logo, setLogo] = useState('');

  const [items, setItems] = useState([
    { id: 1, description: 'Services', hsn: '', quantity: 1, unit: 'Nos', rate: 0, taxRate: 18, amount: 0 },
  ]);
  
  // Persist to local storage
  useEffect(() => {
    const savedData = localStorage.getItem('invoiceDataRealWorld');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSellerDetails(data.sellerDetails || sellerDetails);
      setClientDetails(data.clientDetails || clientDetails);
      setInvoiceDetails(data.invoiceDetails || invoiceDetails);
      setItems(data.items || items);
      setLogo(data.logo || '');
    }
  }, []);

  useEffect(() => {
    const data = { sellerDetails, clientDetails, invoiceDetails, items, logo };
    localStorage.setItem('invoiceDataRealWorld', JSON.stringify(data));
  }, [sellerDetails, clientDetails, invoiceDetails, items, logo]);


  const generatePDF = () => {
    const doc = new jsPDF();
    const isInterState = sellerDetails.state && clientDetails.state && 
                         sellerDetails.state.toLowerCase() !== clientDetails.state.toLowerCase();

    // 1. Header Logic
    // If Logo exists, putting it top left or right? Standard is Top Left.
    doc.setFillColor(37, 99, 235); // Blue #2563EB
    doc.rect(0, 0, 210, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 105, 15, { align: 'center' }); // Moved slightly up
    
    // Company Name in Header if Logo not there or alongside? 
    // Let's put Company Name also in header center if simpler, 
    // but usually user wants customization.
    // For now, let's keep logo below header or inside? 
    // Inside white header is better, but our header is blue.
    // Let's print logo slightly below blue strip if it's white bg logo.
    
    // We will stick to the previous layout but add Logo.
    let topY = 50;

    if (logo) {
         try {
            doc.addImage(logo, 'JPEG', 14, 50, 40, 20, undefined, 'FAST'); // x, y, w, h
            topY = 80; // Push text down if logo is there
         } catch (e) {
            console.error("Logo Error", e);
         }
    }

    // 2. Seller Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Calculate Y based on logo
    let sellerY = topY;
    
    // If logo, maybe put Seller Name NEXT to logo?
    // Let's standard lists:
    // Left: Seller
    // Right: Client
    
    // Override positions based on Logo presence
    // Actually, Tally style: Logo Top Left, Seller Name below it.
    // Let's put Logo at (14, 45). And Seller details start at (14, 70) if logo exists.
    
    if (logo) sellerY = 75; else sellerY = 50;

    doc.text('BILLED BY:', 14, sellerY);
    doc.setFont('helvetica', 'normal');
    sellerY += 5;
    doc.text(sellerDetails.name || '', 14, sellerY);
    sellerY += 5;
    doc.text(sellerDetails.address || '', 14, sellerY);
    sellerY += 5;
    if (sellerDetails.state) {
        doc.text(sellerDetails.state, 14, sellerY);
        sellerY += 5;
    }
    if (sellerDetails.gstin) {
      doc.text(`GSTIN: ${sellerDetails.gstin}`, 14, sellerY);
      sellerY += 5;
    }
    doc.text(`Email/Phone: ${sellerDetails.email}`, 14, sellerY);

    // 3. Client Details (Right Side)
    let clientY = 50; 
    // If Logo is big, maybe push Client down? No, Client is on right.
    
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO:', 120, clientY);
    doc.setFont('helvetica', 'normal');
    clientY += 5;
    doc.text(clientDetails.name || '', 120, clientY);
    clientY += 5;
    doc.text(clientDetails.address || '', 120, clientY);
    clientY += 5;
    if (clientDetails.state) {
         doc.text(`State: ${clientDetails.state}`, 120, clientY);
         clientY += 5;
    }
    if (clientDetails.gstin) {
       doc.text(`GSTIN: ${clientDetails.gstin}`, 120, clientY);
    }
    
    // 4. Invoice Meta (Top Right Overlay or Below Client)
    // Let's put it on top right, below blue header.
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice No: ${invoiceDetails.invoiceNumber}`, 200, 25, { align: 'right', isInputVisual: false, renderingMode: 'fill' }); 
    // Wait, text color is white in header.
    doc.setTextColor(255, 255, 255);
    doc.text(`Date: ${invoiceDetails.date}`, 200, 32, { align: 'right' });
    
    doc.setTextColor(0, 0, 0); // Reset black

    // Extended Meta (PO Details) - Below Client or In Table Header?
    // Let's put PO details below Client Details on right side or left side.
    const metaStartY = Math.max(sellerY, clientY) + 10;
    
    if (invoiceDetails.poNumber) {
        doc.setFontSize(9);
        doc.text(`PO No: ${invoiceDetails.poNumber}`, 14, metaStartY);
        if (invoiceDetails.poDate) {
             doc.text(`PO Date: ${invoiceDetails.poDate}`, 60, metaStartY); // Inline with PO No
        }
    }

    // 5. Items Table
    const tableStartY = metaStartY + 10;
    
    const tableColumn = ["#", "Description", "HSN/SAC", "Qty", "Unit", "Rate", "Tax", "Amount"];
    const tableRows = items.map((item, index) => {
      const amount = parseFloat(item.amount) || 0;
      return [
        index + 1,
        item.description,
        item.hsn,
        item.quantity,
        item.unit || 'Nos',
        `Rs. ${item.rate}`,
        `${item.taxRate}%`,
        `Rs. ${amount.toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 10 }, // #
        1: { cellWidth: 50 }, // Desc
        2: { cellWidth: 20 }, // HSN
        3: { cellWidth: 15 }, // Qty
        4: { cellWidth: 15 }, // Unit
        5: { cellWidth: 25 }, // Rate
        6: { cellWidth: 15 }, // Tax
        7: { cellWidth: 30 }, // Amount
      }
    });

    // 6. Calculations
    const finalY = doc.lastAutoTable.finalY + 5;
    
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + ((parseFloat(item.amount) || 0) * (parseFloat(item.taxRate) || 0) / 100), 0);
    let grandTotalRaw = subtotal + totalTax;
    
    // Round Off Logic
    const grandTotalRounded = Math.round(grandTotalRaw);
    const roundOffAmount = grandTotalRounded - grandTotalRaw;

    doc.setFontSize(9);
    
    // Right Aligned Totals
    let totalsY = finalY;
    const rightMargin = 195;
    const labelX = 140;

    doc.text(`Subtotal:`, labelX, totalsY);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, rightMargin, totalsY, { align: 'right' });
    totalsY += 5;

    if (subtotal > 0) {
        if (isInterState) {
            doc.text(`IGST:`, labelX, totalsY);
            doc.text(`Rs. ${totalTax.toFixed(2)}`, rightMargin, totalsY, { align: 'right' });
            totalsY += 5;
        } else {
            const halfTax = totalTax / 2;
            doc.text(`CGST:`, labelX, totalsY);
            doc.text(`Rs. ${halfTax.toFixed(2)}`, rightMargin, totalsY, { align: 'right' });
            totalsY += 5;
            doc.text(`SGST:`, labelX, totalsY);
            doc.text(`Rs. ${halfTax.toFixed(2)}`, rightMargin, totalsY, { align: 'right' });
            totalsY += 5;
        }
    }
    
    // Round Off
    if (roundOffAmount !== 0) {
        doc.text(`Round Off:`, labelX, totalsY);
        doc.text(`${roundOffAmount > 0 ? '+' : ''}${roundOffAmount.toFixed(2)}`, rightMargin, totalsY, { align: 'right' });
        totalsY += 5;
    }

    // Grand Total Box
    doc.setFillColor(240, 240, 240);
    doc.rect(labelX - 5, totalsY - 4, 70, 10, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`GRAND TOTAL:`, labelX, totalsY + 3);
    doc.text(`Rs. ${grandTotalRounded.toFixed(2)}`, rightMargin, totalsY + 3, { align: 'right' });
    
    // 7. Left Side Content (Words, Bank)
    let leftY = finalY;
    
    // Amount in words
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const words = numberToWords(grandTotalRounded);
    doc.text(`Amount in Words:`, 14, leftY);
    doc.setFont('helvetica', 'bold');
    
    const splitWords = doc.splitTextToSize(`${words} Rupees Only`, 100);
    doc.text(splitWords, 14, leftY + 5);
    leftY += 10 + (splitWords.length * 4);

    // Bank Details
    if (sellerDetails.bankName || sellerDetails.accountNumber) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text("Bank Details:", 14, leftY);
        doc.setFont('helvetica', 'normal');
        leftY += 5;
        // Compact bank details
        doc.text(`Bank: ${sellerDetails.bankName}, A/c: ${sellerDetails.accountNumber}`, 14, leftY);
        leftY += 4;
        doc.text(`IFSC: ${sellerDetails.bankIFSC}, Branch: ${sellerDetails.bankBranch}`, 14, leftY);
        leftY += 8;
    }

    // 8. Sign footer
    const bottomY = 280;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('This is a computer-generated invoice.', 105, bottomY, { align: 'center' });
    
    // Authorization Sign box
    doc.setDrawColor(200, 200, 200);
    doc.rect(140, bottomY - 30, 50, 20); // Box for sign
    doc.text('Authorized Signatory', 165, bottomY - 35, { align: 'center' });
    doc.setFontSize(7);
    doc.text(`For ${sellerDetails.name}`, 165, bottomY - 8, { align: 'center' });

    doc.save(`Invoice_${invoiceDetails.invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <InvoiceForm 
          sellerDetails={sellerDetails} setSellerDetails={setSellerDetails}
          clientDetails={clientDetails} setClientDetails={setClientDetails}
          invoiceDetails={invoiceDetails} setInvoiceDetails={setInvoiceDetails}
          logo={logo} setLogo={setLogo}
        />
        
        <ItemsTable items={items} setItems={setItems} />
        
        <Summary items={items} />

        <div className="fixed bottom-8 right-8 z-10 w-full max-w-fit pointer-events-none flex justify-end">
          <button
            onClick={generatePDF}
            className="pointer-events-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-lg font-bold text-lg transition-all transform hover:scale-105"
          >
            <Download size={24} />
            Download Final Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
