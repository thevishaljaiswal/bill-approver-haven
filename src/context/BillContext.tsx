import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

// Create initial dummy data
const initialBills: Bill[] = [
  // Department Overhead Bill
  {
    id: uuidv4(),
    type: BillType.DEPARTMENT_OVERHEAD,
    billNumber: "DOB-2025-001",
    billDate: new Date("2025-04-15"),
    vendorName: "Office Supplies Co.",
    department: "Information Technology",
    description: "Monthly office supplies and equipment maintenance",
    amount: 5430.50,
    dueDate: new Date("2025-05-15"),
    currentStage: 2,
    status: BillStatus.PENDING,
    createdAt: new Date("2025-04-15"),
    updatedAt: new Date("2025-04-15"),
    attachments: [
      {
        name: "Invoice-DOB-001.pdf",
        url: "#",
        type: "application/pdf"
      }
    ],
    approvals: [
      {
        stage: 0,
        approverName: "John Smith",
        status: BillStatus.APPROVED,
        date: new Date("2025-04-16"),
        comments: "All documents verified"
      },
      {
        stage: 1,
        approverName: "Sarah Johnson",
        status: BillStatus.APPROVED,
        date: new Date("2025-04-17"),
        comments: "Approved after verification"
      }
    ],
    remarks: "Standard monthly overhead expenses"
  },
  // Construction Contract Bill
  {
    id: uuidv4(),
    type: BillType.CONSTRUCTION_CONTRACT,
    projectId: "PRJ-2025-001",
    projectName: "New Office Building",
    contractorName: "BuildWell Construction",
    workOrderNumber: "WO-2025-001",
    siteLocation: "123 Business Park",
    billNumber: "CCB-2025-001",
    billDate: new Date("2025-04-10"),
    invoiceAmount: 125000.00,
    taxAmount: 12500.00,
    paymentTerms: "Net 30",
    measurementBookNumber: "MB-001",
    certifiedAmount: 120000.00,
    retentionAmount: 5000.00,
    currentStage: 3,
    status: BillStatus.PENDING,
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-10"),
    attachments: [
      {
        name: "Invoice-CCB-001.pdf",
        url: "#",
        type: "application/pdf"
      }
    ],
    approvals: [
      {
        stage: 0,
        approverName: "Mike Wilson",
        status: BillStatus.APPROVED,
        date: new Date("2025-04-11"),
        comments: "Work completed as per specifications"
      }
    ],
    remarks: "Phase 1 completion billing"
  },
  // Purchase Bill
  {
    id: uuidv4(),
    type: BillType.PURCHASE,
    poNumber: "PO-2025-001",
    poDate: new Date("2025-04-05"),
    vendorName: "Tech Solutions Inc",
    itemDescription: "Desktop Computers - 10 units",
    quantity: 10,
    unitPrice: 1200.00,
    invoiceNumber: "INV-2025-001",
    invoiceDate: new Date("2025-04-08"),
    totalAmount: 12000.00,
    taxDetails: "GST 10%",
    paymentTerms: "Net 15",
    grnNumber: "GRN-2025-001",
    grnDate: new Date("2025-04-09"),
    quantityReceived: 10,
    currentStage: 4,
    status: BillStatus.APPROVED,
    createdAt: new Date("2025-04-05"),
    updatedAt: new Date("2025-04-15"),
    attachments: [
      {
        name: "Invoice-PB-001.pdf",
        url: "#",
        type: "application/pdf"
      }
    ],
    approvals: [
      {
        stage: 0,
        approverName: "Emily Brown",
        status: BillStatus.APPROVED,
        date: new Date("2025-04-12"),
        comments: "All items received in good condition"
      }
    ],
    remarks: "Annual IT equipment upgrade"
  },
  // Advance Request Bill
  {
    id: uuidv4(),
    type: BillType.ADVANCE_REQUEST,
    vendorName: "Marketing Experts LLC",
    vendorId: "VEN-2025-001",
    contactNumber: "+1-555-0123",
    bankDetails: "Bank of America - 1234567890",
    requestDate: new Date("2025-04-01"),
    purpose: "Trade Show Expenses",
    amountRequested: 15000.00,
    paymentMethod: "Bank Transfer",
    justification: "Advance required for booth setup and materials",
    currentStage: 1,
    status: BillStatus.REJECTED,
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-02"),
    attachments: [
      {
        name: "Request-AR-001.pdf",
        url: "#",
        type: "application/pdf"
      }
    ],
    approvals: [
      {
        stage: 0,
        approverName: "David Lee",
        status: BillStatus.REJECTED,
        date: new Date("2025-04-02"),
        comments: "Insufficient justification for advance amount"
      }
    ],
    remarks: "Trade show participation advance request"
  }
];

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
  bills: initialBills,
  addBill: () => {},
  updateBill: () => {},
  deleteBill: () => {},
  getBill: () => undefined,
  updateApproval: () => {},
  filterBills: () => [],
});

// Context provider component
export const BillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bills, setBills] = useState<Bill[]>(initialBills);

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

export const useBillContext = () => useContext(BillContext);
