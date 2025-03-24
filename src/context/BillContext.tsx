
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the approval stages
export const approvalStages = [
  "Submitted",
  "Initial Review",
  "Department Head",
  "Finance Review",
  "CFO Approval",
  "CEO Approval",
  "Payment Processing"
];

// Define the bill types
export enum BillType {
  DEPARTMENT_OVERHEAD = "Department Overhead Bills",
  CONSTRUCTION_CONTRACT = "Construction Contract Bills",
  PURCHASE = "Purchase Bills",
  ADVANCE_REQUEST = "Advance Request Bills"
}

// Define the bill status
export enum BillStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected"
}

// Define the base bill interface
export interface BaseBill {
  id: string;
  type: BillType;
  currentStage: number; // Index of the current approval stage (0-6)
  status: BillStatus;
  createdAt: Date;
  updatedAt: Date;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  approvals: Array<{
    stage: number;
    approverName: string;
    status: BillStatus;
    date: Date | null;
    comments: string;
  }>;
  remarks: string;
}

// Department Overhead Bill
export interface DepartmentOverheadBill extends BaseBill {
  billNumber: string;
  billDate: Date;
  vendorName: string;
  department: string;
  description: string;
  amount: number;
  dueDate: Date;
}

// Construction Contract Bill
export interface ConstructionContractBill extends BaseBill {
  projectId: string;
  projectName: string;
  contractorName: string;
  workOrderNumber: string;
  siteLocation: string;
  billNumber: string;
  billDate: Date;
  invoiceAmount: number;
  taxAmount: number;
  paymentTerms: string;
  measurementBookNumber: string;
  certifiedAmount: number;
  retentionAmount: number;
}

// Purchase Bill
export interface PurchaseBill extends BaseBill {
  poNumber: string;
  poDate: Date;
  vendorName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  invoiceNumber: string;
  invoiceDate: Date;
  totalAmount: number;
  taxDetails: string;
  paymentTerms: string;
  grnNumber: string;
  grnDate: Date;
  quantityReceived: number;
}

// Advance Request Bill
export interface AdvanceRequestBill extends BaseBill {
  vendorName: string;
  vendorId: string;
  contactNumber: string;
  bankDetails: string;
  requestDate: Date;
  purpose: string;
  amountRequested: number;
  paymentMethod: string;
  justification: string;
}

// Union type for all bill types
export type Bill = 
  | DepartmentOverheadBill 
  | ConstructionContractBill 
  | PurchaseBill 
  | AdvanceRequestBill;

// Context interface
interface BillContextProps {
  bills: Bill[];
  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  getBill: (id: string) => Bill | undefined;
  updateApproval: (
    billId: string, 
    stageIndex: number, 
    approverName: string,
    status: BillStatus,
    comments: string
  ) => void;
  filterBills: (type?: BillType, status?: BillStatus) => Bill[];
}

// Create context with default values
const BillContext = createContext<BillContextProps>({
  bills: [],
  addBill: () => {},
  updateBill: () => {},
  deleteBill: () => {},
  getBill: () => undefined,
  updateApproval: () => {},
  filterBills: () => [],
});

// Context provider component
export const BillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bills, setBills] = useState<Bill[]>([]);

  const addBill = (bill: Bill) => {
    setBills((prevBills) => [...prevBills, bill]);
  };

  const updateBill = (id: string, updatedFields: Partial<Bill>) => {
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === id ? { ...bill, ...updatedFields, updatedAt: new Date() } : bill
      )
    );
  };

  const deleteBill = (id: string) => {
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
  };

  const getBill = (id: string) => {
    return bills.find((bill) => bill.id === id);
  };

  const updateApproval = (
    billId: string,
    stageIndex: number,
    approverName: string,
    status: BillStatus,
    comments: string
  ) => {
    setBills((prevBills) =>
      prevBills.map((bill) => {
        if (bill.id === billId) {
          const newApprovals = [...bill.approvals];
          
          // Update or add the approval for this stage
          const approvalIndex = newApprovals.findIndex(a => a.stage === stageIndex);
          const approval = {
            stage: stageIndex,
            approverName,
            status,
            date: new Date(),
            comments
          };
          
          if (approvalIndex >= 0) {
            newApprovals[approvalIndex] = approval;
          } else {
            newApprovals.push(approval);
          }
          
          // Update current stage if approved (move to next stage)
          let currentStage = bill.currentStage;
          if (status === BillStatus.APPROVED && stageIndex === currentStage && currentStage < approvalStages.length - 1) {
            currentStage++;
          }
          
          // Update bill status
          let billStatus = bill.status;
          if (status === BillStatus.REJECTED) {
            billStatus = BillStatus.REJECTED;
          } else if (status === BillStatus.APPROVED && stageIndex === approvalStages.length - 1) {
            billStatus = BillStatus.APPROVED;
          }
          
          return {
            ...bill,
            approvals: newApprovals,
            currentStage,
            status: billStatus,
            updatedAt: new Date()
          };
        }
        return bill;
      })
    );
  };

  const filterBills = (type?: BillType, status?: BillStatus) => {
    return bills.filter((bill) => {
      let matchesType = true;
      let matchesStatus = true;
      
      if (type !== undefined) {
        matchesType = bill.type === type;
      }
      
      if (status !== undefined) {
        matchesStatus = bill.status === status;
      }
      
      return matchesType && matchesStatus;
    });
  };

  return (
    <BillContext.Provider
      value={{
        bills,
        addBill,
        updateBill,
        deleteBill,
        getBill,
        updateApproval,
        filterBills
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

// Custom hook to use the bill context
export const useBillContext = () => useContext(BillContext);
