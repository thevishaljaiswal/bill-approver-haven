
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillContext, BillType, BillStatus } from '@/context/BillContext';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'sonner';

const AdvanceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { addBill } = useBillContext();

  const [vendorName, setVendorName] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [justification, setJustification] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods = [
    'Bank Transfer',
    'Check',
    'Cash',
    'Wire Transfer',
    'Digital Payment'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!vendorName) newErrors.vendorName = 'Vendor name is required';
    if (!vendorId) newErrors.vendorId = 'Vendor ID is required';
    if (!contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!bankDetails) newErrors.bankDetails = 'Bank details are required';
    if (!requestDate) newErrors.requestDate = 'Request date is required';
    if (!purpose) newErrors.purpose = 'Purpose is required';
    if (!amountRequested || isNaN(parseFloat(amountRequested)) || parseFloat(amountRequested) <= 0) {
      newErrors.amountRequested = 'Valid amount is required';
    }
    if (!paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!justification) newErrors.justification = 'Justification is required';
    
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
      
      const newBill = {
        id: uuidv4(),
        type: BillType.ADVANCE_REQUEST,
        vendorName,
        vendorId,
        contactNumber,
        bankDetails,
        requestDate: new Date(requestDate),
        purpose,
        amountRequested: parseFloat(amountRequested),
        paymentMethod,
        justification,
        attachments,
        status: BillStatus.PENDING,
        currentStage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvals: [],
        remarks
      };
      
      addBill(newBill);
      toast.success('Advance request created successfully');
      navigate('/bills/advance');
    } catch (error) {
      console.error('Error creating advance request:', error);
      toast.error('Failed to create advance request. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Advance Request</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to create a new advance request
        </p>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            
            <div>
              <label htmlFor="vendorId" className="block text-sm font-medium mb-1">
                Vendor ID*
              </label>
              <input
                id="vendorId"
                type="text"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="form-input w-full"
                placeholder="Enter vendor ID"
              />
              {errors.vendorId && (
                <p className="text-destructive text-xs mt-1">{errors.vendorId}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium mb-1">
                Contact Number*
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter contact number"
              />
              {errors.contactNumber && (
                <p className="text-destructive text-xs mt-1">{errors.contactNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="bankDetails" className="block text-sm font-medium mb-1">
                Bank Details*
              </label>
              <input
                id="bankDetails"
                type="text"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="form-input w-full"
                placeholder="Enter bank details"
              />
              {errors.bankDetails && (
                <p className="text-destructive text-xs mt-1">{errors.bankDetails}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="requestDate" className="block text-sm font-medium mb-1">
                Request Date*
              </label>
              <input
                id="requestDate"
                type="date"
                value={requestDate}
                onChange={(e) => setRequestDate(e.target.value)}
                className="form-input w-full"
              />
              {errors.requestDate && (
                <p className="text-destructive text-xs mt-1">{errors.requestDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="amountRequested" className="block text-sm font-medium mb-1">
                Amount Requested ($)*
              </label>
              <input
                id="amountRequested"
                type="number"
                step="0.01"
                min="0"
                value={amountRequested}
                onChange={(e) => setAmountRequested(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
              />
              {errors.amountRequested && (
                <p className="text-destructive text-xs mt-1">{errors.amountRequested}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">
                Payment Method*
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select w-full"
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="text-destructive text-xs mt-1">{errors.paymentMethod}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="purpose" className="block text-sm font-medium mb-1">
                Purpose*
              </label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="form-textarea w-full"
                rows={2}
                placeholder="Enter purpose of advance request"
              />
              {errors.purpose && (
                <p className="text-destructive text-xs mt-1">{errors.purpose}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="justification" className="block text-sm font-medium mb-1">
                Justification*
              </label>
              <textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="form-textarea w-full"
                rows={3}
                placeholder="Provide detailed justification for the advance request"
              />
              {errors.justification && (
                <p className="text-destructive text-xs mt-1">{errors.justification}</p>
              )}
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
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvanceRequestForm;
