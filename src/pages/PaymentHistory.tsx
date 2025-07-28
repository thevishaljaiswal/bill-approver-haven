
import React, { useState } from 'react';
import { useBillContext, BillType, BillStatus, Bill, DepartmentOverheadBill, ConstructionContractBill, PurchaseBill, AdvanceRequestBill } from '@/context/BillContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Filter } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import PaymentDetails from '@/components/payments/PaymentDetails';
import VendorCard from '@/components/payments/VendorCard';
import BillDetailsCard from '@/components/payments/BillDetailsCard';
import BankDetailsCard from '@/components/payments/BankDetailsCard';

const PaymentHistory = () => {
  const { bills } = useBillContext();
  const [billTypeFilter, setBillTypeFilter] = useState<BillType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');

  const filteredBills = bills.filter(bill => 
    (billTypeFilter === 'all' || bill.type === billTypeFilter) &&
    (statusFilter === 'all' || bill.status === statusFilter)
  );

  const totalAmount = filteredBills.reduce((sum, bill) => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        return sum + (bill as DepartmentOverheadBill).amount;
      case BillType.CONSTRUCTION_CONTRACT:
        return sum + (bill as ConstructionContractBill).invoiceAmount;
      case BillType.PURCHASE:
        return sum + (bill as PurchaseBill).totalAmount;
      case BillType.ADVANCE_REQUEST:
        return sum + (bill as AdvanceRequestBill).amountRequested;
      default:
        return sum;
    }
  }, 0);

  // Helper functions for type-safe property access
  const getBillReference = (bill: Bill): string => {
    switch (bill.type) {
      case BillType.PURCHASE:
        return (bill as PurchaseBill).poNumber;
      case BillType.CONSTRUCTION_CONTRACT:
        return (bill as ConstructionContractBill).billNumber;
      case BillType.DEPARTMENT_OVERHEAD:
        return (bill as DepartmentOverheadBill).billNumber;
      default:
        return bill.id.substring(0, 8);
    }
  };

  const getBillAmount = (bill: Bill): number => {
    switch (bill.type) {
      case BillType.PURCHASE:
        return (bill as PurchaseBill).totalAmount;
      case BillType.CONSTRUCTION_CONTRACT:
        return (bill as ConstructionContractBill).invoiceAmount;
      case BillType.DEPARTMENT_OVERHEAD:
        return (bill as DepartmentOverheadBill).amount;
      case BillType.ADVANCE_REQUEST:
        return (bill as AdvanceRequestBill).amountRequested;
      default:
        return 0;
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage payments across all bill types
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalAmount.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Total amount across {filteredBills.length} bills
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select
          className="form-select"
          value={billTypeFilter}
          onChange={(e) => setBillTypeFilter(e.target.value as BillType | 'all')}
        >
          <option value="all">All Bill Types</option>
          {Object.values(BillType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BillStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {Object.values(BillStatus).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredBills.map((bill) => (
          <Card key={bill.id} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <VendorCard bill={bill} />
              <BillDetailsCard bill={bill} />
              <BankDetailsCard bill={bill} />
              <PaymentDetails bill={bill} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">${getBillAmount(bill).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={bill.status} />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Ref: {getBillReference(bill)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
