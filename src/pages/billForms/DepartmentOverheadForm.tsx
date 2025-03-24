
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillContext, BillType, BillStatus } from '@/context/BillContext';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'sonner';

const DepartmentOverheadForm: React.FC = () => {
  const navigate = useNavigate();
  const { addBill } = useBillContext();
  
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const departments = [
    'Finance',
    'Human Resources',
    'Information Technology',
    'Operations',
    'Marketing',
    'Sales',
    'Research & Development',
    'Customer Service',
    'Legal',
    'Administration'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!billNumber) newErrors.billNumber = 'Bill number is required';
    if (!billDate) newErrors.billDate = 'Bill date is required';
    if (!vendorName) newErrors.vendorName = 'Vendor name is required';
    if (!department) newErrors.department = 'Department is required';
    if (!description) newErrors.description = 'Description is required';
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    
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
      // In a real app, we would upload files to a server and get URLs
      // For now, we'll just simulate this
      const attachments = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      const newBill = {
        id: uuidv4(),
        type: BillType.DEPARTMENT_OVERHEAD,
        billNumber,
        billDate: new Date(billDate),
        vendorName,
        department,
        description,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        attachments,
        status: BillStatus.PENDING,
        currentStage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvals: [],
        remarks
      };
      
      addBill(newBill);
      
      toast.success('Department overhead bill created successfully');
      navigate('/bills');
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Department Overhead Bill</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to create a new department overhead bill
        </p>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <label htmlFor="department" className="block text-sm font-medium mb-1">
                Department*
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select w-full"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-destructive text-xs mt-1">{errors.department}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description*
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea w-full"
                rows={3}
                placeholder="Enter bill description"
              />
              {errors.description && (
                <p className="text-destructive text-xs mt-1">{errors.description}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Amount ($)*
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input w-full"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-destructive text-xs mt-1">{errors.amount}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date*
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input w-full"
              />
              {errors.dueDate && (
                <p className="text-destructive text-xs mt-1">{errors.dueDate}</p>
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
              Submit Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentOverheadForm;
