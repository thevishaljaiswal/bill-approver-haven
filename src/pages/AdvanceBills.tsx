import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBillContext, BillType, BillStatus, Bill, AdvanceRequestBill } from '@/context/BillContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Plus } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalStages from '@/components/ui/ApprovalStages';

const isAdvanceRequestBill = (bill: Bill): bill is AdvanceRequestBill => {
  return bill.type === BillType.ADVANCE_REQUEST;
};

const AdvanceBills: React.FC = () => {
  const { bills } = useBillContext();
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');

  // Filter for advance request bills
  const advanceBills = bills
    .filter(isAdvanceRequestBill)
    .filter(bill => 
      (statusFilter === 'all' || bill.status === statusFilter) &&
      (vendorFilter === 'all' || bill.vendorName === vendorFilter)
    );

  // Get unique vendors
  const vendors = Array.from(new Set(
    bills
      .filter(isAdvanceRequestBill)
      .map(bill => bill.vendorName)
  ));

  // Calculate statistics
  const stats = {
    total: advanceBills.length,
    pending: advanceBills.filter(b => b.status === BillStatus.PENDING).length,
    approved: advanceBills.filter(b => b.status === BillStatus.APPROVED).length,
    rejected: advanceBills.filter(b => b.status === BillStatus.REJECTED).length,
    totalAmount: advanceBills.reduce((sum, bill) => sum + bill.amountRequested, 0)
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Advance Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage advance requests and track their adjustments with bills
          </p>
        </div>
        <Link
          to="/bills/advance/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Advance Request
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total Amount: ${stats.totalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select
          className="form-select"
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
        >
          <option value="all">All Vendors</option>
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>{vendor}</option>
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Details</TableHead>
              <TableHead>Request Info</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advanceBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{bill.vendorName}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {bill.vendorId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bill.contactNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{bill.purpose}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(bill.requestDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    ${bill.amountRequested.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{bill.paymentMethod}</div>
                    <div className="text-sm text-muted-foreground">
                      {bill.bankDetails}
                    </div>
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdvanceBills;
