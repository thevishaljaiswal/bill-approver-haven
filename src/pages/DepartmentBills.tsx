
import React, { useState } from 'react';
import { useBillContext, BillType, BillStatus, DepartmentOverheadBill, Bill } from '@/context/BillContext';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalStages from '@/components/ui/ApprovalStages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Building, Filter } from 'lucide-react';

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

const DepartmentBills = () => {
  const { bills } = useBillContext();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<BillStatus | 'all'>('all');

  // Filter for department overhead bills only and type guard them
  const departmentBills = bills.filter((bill): bill is DepartmentOverheadBill => 
    bill.type === BillType.DEPARTMENT_OVERHEAD &&
    (selectedDepartment === 'all' || 'department' in bill && bill.department === selectedDepartment) &&
    (selectedStatus === 'all' || bill.status === selectedStatus)
  );

  // Calculate department statistics
  const getDepartmentStats = (department: string) => {
    const deptBills = bills.filter((bill): bill is DepartmentOverheadBill => 
      bill.type === BillType.DEPARTMENT_OVERHEAD &&
      (department === 'all' || 'department' in bill && bill.department === department)
    );
    
    return {
      total: deptBills.length,
      pending: deptBills.filter(b => b.status === BillStatus.PENDING).length,
      approved: deptBills.filter(b => b.status === BillStatus.APPROVED).length,
      rejected: deptBills.filter(b => b.status === BillStatus.REJECTED).length,
      totalAmount: deptBills.reduce((sum, bill) => sum + bill.amount, 0)
    };
  };

  const stats = getDepartmentStats(selectedDepartment);

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Department Bills</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track department overhead bills across different departments
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
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
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select
          className="form-select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
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
              <TableHead>Bill Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departmentBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.billNumber}</TableCell>
                <TableCell>
                  {bill.billDate.toLocaleDateString()}
                </TableCell>
                <TableCell>{bill.department}</TableCell>
                <TableCell>{bill.vendorName}</TableCell>
                <TableCell>
                  ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {bill.dueDate.toLocaleDateString()}
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

export default DepartmentBills;
