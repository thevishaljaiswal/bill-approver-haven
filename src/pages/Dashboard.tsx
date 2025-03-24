
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBillContext, BillStatus, BillType } from '@/context/BillContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  Building, 
  HardHat, 
  ShoppingCart, 
  DollarSign, 
  PlusCircle,
  ChevronRight,
  BarChart3,
  CircleDollarSign,
  AlertCircle,
  Clock 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { bills, filterBills } = useBillContext();
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Get counts for dashboard stats
  const pendingCount = filterBills(undefined, BillStatus.PENDING).length;
  const approvedCount = filterBills(undefined, BillStatus.APPROVED).length;
  const rejectedCount = filterBills(undefined, BillStatus.REJECTED).length;
  const totalCount = bills.length;
  
  // Calculate total amount for all bills
  const totalAmount = bills.reduce((sum, bill) => {
    if ('amount' in bill) return sum + bill.amount;
    if ('invoiceAmount' in bill) return sum + bill.invoiceAmount;
    if ('totalAmount' in bill) return sum + bill.totalAmount;
    if ('amountRequested' in bill) return sum + bill.amountRequested;
    return sum;
  }, 0);
  
  // Filter bills based on selected tab
  const getFilteredBills = () => {
    switch (selectedTab) {
      case 'pending':
        return filterBills(undefined, BillStatus.PENDING);
      case 'approved':
        return filterBills(undefined, BillStatus.APPROVED);
      case 'rejected':
        return filterBills(undefined, BillStatus.REJECTED);
      default:
        return bills;
    }
  };
  
  const filteredBills = getFilteredBills().slice(0, 5); // Get only the latest 5 bills

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of all bills and their status
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Bills</p>
            <h3 className="text-3xl font-bold mt-1">{totalCount}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
            <h3 className="text-3xl font-bold mt-1">{pendingCount}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting next action
            </p>
          </div>
          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
            <h3 className="text-3xl font-bold mt-1">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              All bills combined
            </p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <CircleDollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
            <h3 className="text-3xl font-bold mt-1">{rejectedCount}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Need attention
            </p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
      
      {/* New Bill Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Bill</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link 
            to="/bills/department/new"
            className="glass-card p-6 rounded-xl text-center group hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium">Department Overhead</h3>
            <p className="text-sm text-muted-foreground mt-2">
              For operational expenses
            </p>
            <div className="mt-4 text-primary flex items-center justify-center">
              <PlusCircle className="h-5 w-5 mr-1" />
              <span className="text-sm">Create</span>
            </div>
          </Link>
          
          <Link 
            to="/bills/construction/new"
            className="glass-card p-6 rounded-xl text-center group hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
              <HardHat className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-medium">Construction Contract</h3>
            <p className="text-sm text-muted-foreground mt-2">
              For project related expenses
            </p>
            <div className="mt-4 text-primary flex items-center justify-center">
              <PlusCircle className="h-5 w-5 mr-1" />
              <span className="text-sm">Create</span>
            </div>
          </Link>
          
          <Link 
            to="/bills/purchase/new"
            className="glass-card p-6 rounded-xl text-center group hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium">Purchase Bills</h3>
            <p className="text-sm text-muted-foreground mt-2">
              For purchase orders
            </p>
            <div className="mt-4 text-primary flex items-center justify-center">
              <PlusCircle className="h-5 w-5 mr-1" />
              <span className="text-sm">Create</span>
            </div>
          </Link>
          
          <Link 
            to="/bills/advance/new"
            className="glass-card p-6 rounded-xl text-center group hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium">Advance Request</h3>
            <p className="text-sm text-muted-foreground mt-2">
              For advance payments
            </p>
            <div className="mt-4 text-primary flex items-center justify-center">
              <PlusCircle className="h-5 w-5 mr-1" />
              <span className="text-sm">Create</span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Recent Bills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Bills</h2>
          <Link to="/bills" className="text-primary text-sm flex items-center hover:underline">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === 'all'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedTab('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === 'pending'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedTab('pending')}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === 'approved'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedTab('approved')}
              >
                Approved
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === 'rejected'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedTab('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>
          
          {filteredBills.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No bills found.</p>
              <p className="text-sm mt-1">
                Create your first bill to get started.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Bill Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Bill Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBills.map((bill) => {
                  let icon;
                  let billNumber = '';
                  let vendor = '';
                  let amount = 0;
                  
                  switch (bill.type) {
                    case BillType.DEPARTMENT_OVERHEAD:
                      icon = <Building className="h-4 w-4 text-blue-600" />;
                      billNumber = (bill as any).billNumber;
                      vendor = (bill as any).vendorName;
                      amount = (bill as any).amount;
                      break;
                    case BillType.CONSTRUCTION_CONTRACT:
                      icon = <HardHat className="h-4 w-4 text-orange-600" />;
                      billNumber = (bill as any).billNumber;
                      vendor = (bill as any).contractorName;
                      amount = (bill as any).invoiceAmount;
                      break;
                    case BillType.PURCHASE:
                      icon = <ShoppingCart className="h-4 w-4 text-green-600" />;
                      billNumber = (bill as any).invoiceNumber;
                      vendor = (bill as any).vendorName;
                      amount = (bill as any).totalAmount;
                      break;
                    case BillType.ADVANCE_REQUEST:
                      icon = <DollarSign className="h-4 w-4 text-purple-600" />;
                      billNumber = bill.id.substring(0, 8);
                      vendor = (bill as any).vendorName;
                      amount = (bill as any).amountRequested;
                      break;
                  }
                  
                  return (
                    <tr key={bill.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {icon}
                          <span className="ml-2 text-sm">{bill.type.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link to={`/bills/${bill.id}`} className="text-sm font-medium text-primary hover:underline">
                          {billNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {bill.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {vendor}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={bill.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
