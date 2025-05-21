
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBillContext, BillType, BillStatus } from '@/context/BillContext';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalStages from '@/components/ui/ApprovalStages';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Building, HardHat, ShoppingCart, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Bills = () => {
  const { bills } = useBillContext();
  const [selectedType, setSelectedType] = useState<BillType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<BillStatus | 'all'>('all');

  const filteredBills = bills.filter(bill => {
    const matchesType = selectedType === 'all' || bill.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getIcon = (type: BillType) => {
    switch (type) {
      case BillType.DEPARTMENT_OVERHEAD:
        return <Building className="h-4 w-4 text-blue-600" />;
      case BillType.CONSTRUCTION_CONTRACT:
        return <HardHat className="h-4 w-4 text-orange-600" />;
      case BillType.PURCHASE:
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case BillType.ADVANCE_REQUEST:
        return <DollarSign className="h-4 w-4 text-purple-600" />;
    }
  };

  const getBillNumber = (bill: any) => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
      case BillType.CONSTRUCTION_CONTRACT:
        return bill.billNumber;
      case BillType.PURCHASE:
        return bill.invoiceNumber;
      case BillType.ADVANCE_REQUEST:
        return bill.id.substring(0, 8);
      default:
        return '-';
    }
  };

  const getAmount = (bill: any) => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        return bill.amount;
      case BillType.CONSTRUCTION_CONTRACT:
        return bill.invoiceAmount;
      case BillType.PURCHASE:
        return bill.totalAmount;
      case BillType.ADVANCE_REQUEST:
        return bill.amountRequested;
      default:
        return 0;
    }
  };

  const getVendorName = (bill: any) => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        return bill.vendorName;
      case BillType.CONSTRUCTION_CONTRACT:
        return bill.contractorName;
      case BillType.PURCHASE:
        return bill.vendorName;
      case BillType.ADVANCE_REQUEST:
        return bill.vendorName;
      default:
        return '-';
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Bills</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all bills across different categories
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          className="form-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as BillType | 'all')}
        >
          <option value="all">All Types</option>
          {Object.values(BillType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as BillStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {Object.values(BillStatus).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Bill Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval Progress</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIcon(bill.type)}
                    <span>{bill.type.split(' ')[0]}</span>
                  </div>
                </TableCell>
                <TableCell>{getBillNumber(bill)}</TableCell>
                <TableCell>
                  {bill.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>{getVendorName(bill)}</TableCell>
                <TableCell>
                  ${getAmount(bill).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={bill.status} />
                </TableCell>
                <TableCell className="w-1/3">
                  <ApprovalStages
                    currentStage={bill.currentStage}
                    approvals={bill.approvals}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/bills/${bill.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Bills;
