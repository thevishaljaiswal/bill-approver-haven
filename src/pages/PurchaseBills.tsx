
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBillContext, BillType, BillStatus, type Bill, type PurchaseBill } from '@/context/BillContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FileText, Plus } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalStages from '@/components/ui/ApprovalStages';

const isPurchaseBill = (bill: Bill): bill is PurchaseBill => {
  return bill.type === BillType.PURCHASE;
};

const PurchaseBills: React.FC = () => {
  const { bills } = useBillContext();
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');

  const purchaseBills = bills
    .filter(bill => bill.type === BillType.PURCHASE)
    .filter(bill => statusFilter === 'all' || bill.status === statusFilter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Bills</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your purchase bills
          </p>
        </div>
        <Link
          to="/bills/purchase/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Purchase Bill
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BillStatus | 'all')}
              className="form-select text-sm border rounded-md"
            >
              <option value="all">All Status</option>
              <option value={BillStatus.PENDING}>Pending</option>
              <option value={BillStatus.APPROVED}>Approved</option>
              <option value={BillStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill Details</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseBills.map((bill) => {
              if (!isPurchaseBill(bill)) return null;
              return (
                <TableRow key={bill.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        PO #{bill.poNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(bill.poDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{bill.vendorName}</div>
                      <div className="text-sm text-muted-foreground">
                        Invoice #{bill.invoiceNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${bill.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {bill.quantity} × ${bill.unitPrice}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={bill.status} />
                  </TableCell>
                  <TableCell>
                    <ApprovalStages 
                      currentStage={bill.currentStage} 
                      approvals={bill.approvals}
                      className="w-full" 
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PurchaseBills;
