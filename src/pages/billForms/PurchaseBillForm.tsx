
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillContext, BillType, BillStatus } from '@/context/BillContext';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'sonner';

const PurchaseBillForm: React.FC = () => {
  const navigate = useNavigate();
  const { addBill } = useBillContext();

  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [taxDetails, setTaxDetails] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [grnNumber, setGrnNumber] = useState('');
  const [grnDate, setGrnDate] = useState('');
  const [quantityReceived, setQuantityReceived] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!poNumber) newErrors.poNumber = 'PO number is required';
    if (!poDate) newErrors.poDate = 'PO date is required';
    if (!vendorName) newErrors.vendorName = 'Vendor name is required';
    if (!itemDescription) newErrors.itemDescription = 'Item description is required';
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!unitPrice || isNaN(parseFloat(unitPrice)) || parseFloat(unitPrice) <= 0) {
      newErrors.unitPrice = 'Valid unit price is required';
    }
    if (!invoiceNumber) newErrors.invoiceNumber = 'Invoice number is required';
    if (!invoiceDate) newErrors.invoiceDate = 'Invoice date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    try {
      const attachments = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      const totalAmount = parseFloat(quantity) * parseFloat(unitPrice);
      
      const newBill = {
        id: uuidv4(),
        type: BillType.PURCHASE,
        poNumber,
        poDate: new Date(poDate),
        vendorName,
        itemDescription,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        totalAmount,
        taxDetails,
        paymentTerms,
        grnNumber,
        grnDate: grnDate ? new Date(grnDate) : new Date(),
        quantityReceived: parseInt(quantityReceived) || 0,
        attachments,
        status: BillStatus.PENDING,
        currentStage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvals: [],
        remarks
      };
      
      addBill(newBill);
      toast.success('Purchase bill created successfully');
      navigate('/bills/purchase');
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Purchase Bill</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to create a new purchase bill
        </p>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="poNumber" className="block text-sm font-medium mb-1">
                PO Number*
              </label>
              <input
                id="poNumber"
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter PO number"
              />
              {errors.poNumber && (
                <p className="text-destructive text-xs mt-1">{errors.poNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="poDate" className="block text-sm font-medium mb-1">
                PO Date*
              </label>
              <input
                id="poDate"
                type="date"
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                className="form-input w-full"
              />
              {errors.poDate && (
                <p className="text-destructive text-xs mt-1">{errors.poDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="vendorName" className="block text-sm font-medium mb-1">
                Vendor Name*
              </label>
              <input
                id="vendorName"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="form-input w-full"
                placeholder="Enter vendor name"
              />
              {errors.vendorName && (
                <p className="text-destructive text-xs mt-1">{errors.vendorName}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="itemDescription" className="block text-sm font-medium mb-1">
                Item Description*
              </label>
              <textarea
                id="itemDescription"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="form-textarea w-full"
                rows={2}
                placeholder="Enter item description"
              />
              {errors.itemDescription && (
                <p className="text-destructive text-xs mt-1">{errors.itemDescription}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity*
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-input w-full"
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="text-destructive text-xs mt-1">{errors.quantity}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium mb-1">
                Unit Price ($)*
              </label>
              <input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
              />
              {errors.unitPrice && (
                <p className="text-destructive text-xs mt-1">{errors.unitPrice}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium mb-1">
                Invoice Number*
              </label>
              <input
                id="invoiceNumber"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter invoice number"
              />
              {errors.invoiceNumber && (
                <p className="text-destructive text-xs mt-1">{errors.invoiceNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="invoiceDate" className="block text-sm font-medium mb-1">
                Invoice Date*
              </label>
              <input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="form-input w-full"
              />
              {errors.invoiceDate && (
                <p className="text-destructive text-xs mt-1">{errors.invoiceDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="taxDetails" className="block text-sm font-medium mb-1">
                Tax Details
              </label>
              <input
                id="taxDetails"
                type="text"
                value={taxDetails}
                onChange={(e) => setTaxDetails(e.target.value)}
                className="form-input w-full"
                placeholder="Enter tax details"
              />
            </div>
            
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium mb-1">
                Payment Terms
              </label>
              <input
                id="paymentTerms"
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="form-input w-full"
                placeholder="Enter payment terms"
              />
            </div>
            
            <div>
              <label htmlFor="grnNumber" className="block text-sm font-medium mb-1">
                GRN Number
              </label>
              <input
                id="grnNumber"
                type="text"
                value={grnNumber}
                onChange={(e) => setGrnNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter GRN number"
              />
            </div>
            
            <div>
              <label htmlFor="grnDate" className="block text-sm font-medium mb-1">
                GRN Date
              </label>
              <input
                id="grnDate"
                type="date"
                value={grnDate}
                onChange={(e) => setGrnDate(e.target.value)}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="quantityReceived" className="block text-sm font-medium mb-1">
                Quantity Received
              </label>
              <input
                id="quantityReceived"
                type="number"
                min="0"
                value={quantityReceived}
                onChange={(e) => setQuantityReceived(e.target.value)}
                className="form-input w-full"
                placeholder="Enter quantity received"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Attachments
            </label>
            <FileUpload
              onChange={setFiles}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Accepted file types: PDF, Word, Excel, and images
            </p>
          </div>
          
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-textarea w-full"
              rows={3}
              placeholder="Add any additional information here"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md border hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Submit Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseBillForm;
