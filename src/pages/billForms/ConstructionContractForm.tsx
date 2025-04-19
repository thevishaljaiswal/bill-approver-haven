
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillContext, BillType, BillStatus } from '@/context/BillContext';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'sonner';

const ConstructionContractForm: React.FC = () => {
  const navigate = useNavigate();
  const { addBill } = useBillContext();

  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [measurementBookNumber, setMeasurementBookNumber] = useState('');
  const [certifiedAmount, setCertifiedAmount] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!projectId) newErrors.projectId = 'Project ID is required';
    if (!projectName) newErrors.projectName = 'Project name is required';
    if (!contractorName) newErrors.contractorName = 'Contractor name is required';
    if (!workOrderNumber) newErrors.workOrderNumber = 'Work order number is required';
    if (!siteLocation) newErrors.siteLocation = 'Site location is required';
    if (!billNumber) newErrors.billNumber = 'Bill number is required';
    if (!billDate) newErrors.billDate = 'Bill date is required';
    if (!invoiceAmount || isNaN(parseFloat(invoiceAmount)) || parseFloat(invoiceAmount) <= 0) {
      newErrors.invoiceAmount = 'Valid invoice amount is required';
    }
    
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
        type: BillType.CONSTRUCTION_CONTRACT,
        projectId,
        projectName,
        contractorName,
        workOrderNumber,
        siteLocation,
        billNumber,
        billDate: new Date(billDate),
        invoiceAmount: parseFloat(invoiceAmount),
        taxAmount: parseFloat(taxAmount) || 0,
        paymentTerms,
        measurementBookNumber,
        certifiedAmount: parseFloat(certifiedAmount) || 0,
        retentionAmount: parseFloat(retentionAmount) || 0,
        attachments,
        status: BillStatus.PENDING,
        currentStage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvals: [],
        remarks
      };
      
      addBill(newBill);
      toast.success('Construction contract bill created successfully');
      navigate('/bills/construction');
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Construction Contract Bill</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to create a new construction contract bill
        </p>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium mb-1">
                Project ID*
              </label>
              <input
                id="projectId"
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="form-input w-full"
                placeholder="Enter project ID"
              />
              {errors.projectId && (
                <p className="text-destructive text-xs mt-1">{errors.projectId}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium mb-1">
                Project Name*
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-input w-full"
                placeholder="Enter project name"
              />
              {errors.projectName && (
                <p className="text-destructive text-xs mt-1">{errors.projectName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contractorName" className="block text-sm font-medium mb-1">
                Contractor Name*
              </label>
              <input
                id="contractorName"
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="form-input w-full"
                placeholder="Enter contractor name"
              />
              {errors.contractorName && (
                <p className="text-destructive text-xs mt-1">{errors.contractorName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="workOrderNumber" className="block text-sm font-medium mb-1">
                Work Order Number*
              </label>
              <input
                id="workOrderNumber"
                type="text"
                value={workOrderNumber}
                onChange={(e) => setWorkOrderNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter work order number"
              />
              {errors.workOrderNumber && (
                <p className="text-destructive text-xs mt-1">{errors.workOrderNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="siteLocation" className="block text-sm font-medium mb-1">
                Site Location*
              </label>
              <input
                id="siteLocation"
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="form-input w-full"
                placeholder="Enter site location"
              />
              {errors.siteLocation && (
                <p className="text-destructive text-xs mt-1">{errors.siteLocation}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="billNumber" className="block text-sm font-medium mb-1">
                Bill Number*
              </label>
              <input
                id="billNumber"
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter bill number"
              />
              {errors.billNumber && (
                <p className="text-destructive text-xs mt-1">{errors.billNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="billDate" className="block text-sm font-medium mb-1">
                Bill Date*
              </label>
              <input
                id="billDate"
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="form-input w-full"
              />
              {errors.billDate && (
                <p className="text-destructive text-xs mt-1">{errors.billDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="invoiceAmount" className="block text-sm font-medium mb-1">
                Invoice Amount ($)*
              </label>
              <input
                id="invoiceAmount"
                type="number"
                step="0.01"
                min="0"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
              />
              {errors.invoiceAmount && (
                <p className="text-destructive text-xs mt-1">{errors.invoiceAmount}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="taxAmount" className="block text-sm font-medium mb-1">
                Tax Amount ($)
              </label>
              <input
                id="taxAmount"
                type="number"
                step="0.01"
                min="0"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
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
              <label htmlFor="measurementBookNumber" className="block text-sm font-medium mb-1">
                Measurement Book Number
              </label>
              <input
                id="measurementBookNumber"
                type="text"
                value={measurementBookNumber}
                onChange={(e) => setMeasurementBookNumber(e.target.value)}
                className="form-input w-full"
                placeholder="Enter measurement book number"
              />
            </div>
            
            <div>
              <label htmlFor="certifiedAmount" className="block text-sm font-medium mb-1">
                Certified Amount ($)
              </label>
              <input
                id="certifiedAmount"
                type="number"
                step="0.01"
                min="0"
                value={certifiedAmount}
                onChange={(e) => setCertifiedAmount(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label htmlFor="retentionAmount" className="block text-sm font-medium mb-1">
                Retention Amount ($)
              </label>
              <input
                id="retentionAmount"
                type="number"
                step="0.01"
                min="0"
                value={retentionAmount}
                onChange={(e) => setRetentionAmount(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
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

export default ConstructionContractForm;
