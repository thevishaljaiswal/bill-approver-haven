
import React, { useState } from 'react';
import { useBillContext, BillType, BillStatus, ConstructionContractBill, Bill } from '@/context/BillContext';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalStages from '@/components/ui/ApprovalStages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Filter, Hammer, MapPin } from 'lucide-react';

const ConstructionBills = () => {
  const { bills } = useBillContext();
  const [selectedStatus, setSelectedStatus] = useState<BillStatus | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Filter for construction bills only and type guard them
  const constructionBills = bills.filter((bill): bill is ConstructionContractBill => 
    bill.type === BillType.CONSTRUCTION_CONTRACT &&
    (selectedStatus === 'all' || bill.status === selectedStatus) &&
    (selectedLocation === 'all' || bill.siteLocation === selectedLocation)
  );

  // Get unique locations from construction bills
  const locations = Array.from(new Set(
    bills
      .filter((bill): bill is ConstructionContractBill => bill.type === BillType.CONSTRUCTION_CONTRACT)
      .map(bill => bill.siteLocation)
  ));

  // Calculate construction statistics
  const getConstructionStats = () => {
    const filteredBills = bills.filter((bill): bill is ConstructionContractBill => 
      bill.type === BillType.CONSTRUCTION_CONTRACT &&
      (selectedLocation === 'all' || bill.siteLocation === selectedLocation)
    );
    
    return {
      total: filteredBills.length,
      pending: filteredBills.filter(b => b.status === BillStatus.PENDING).length,
      approved: filteredBills.filter(b => b.status === BillStatus.APPROVED).length,
      rejected: filteredBills.filter(b => b.status === BillStatus.REJECTED).length,
      totalAmount: filteredBills.reduce((sum, bill) => sum + bill.invoiceAmount, 0),
      retentionAmount: filteredBills.reduce((sum, bill) => sum + bill.retentionAmount, 0)
    };
  };

  const stats = getConstructionStats();

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Construction Contract Bills</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track construction project bills and payments
          </p>
        </div>
        <Button asChild>
          <Link to="/bills/construction/new">
            <Hammer className="mr-2 h-4 w-4" />
            New Construction Bill
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Retention</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.retentionAmount.toLocaleString()}
            </div>
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
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Contractor</TableHead>
              <TableHead>Work Order</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Bill Number</TableHead>
              <TableHead>Invoice Amount</TableHead>
              <TableHead>Retention</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {constructionBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.projectId}</TableCell>
                <TableCell>{bill.projectName}</TableCell>
                <TableCell>{bill.contractorName}</TableCell>
                <TableCell>{bill.workOrderNumber}</TableCell>
                <TableCell>{bill.siteLocation}</TableCell>
                <TableCell>{bill.billNumber}</TableCell>
                <TableCell>
                  ${bill.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  ${bill.retentionAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ConstructionBills;
